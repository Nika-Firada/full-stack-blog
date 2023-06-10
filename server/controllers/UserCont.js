const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const fs = require("fs");

dotenv.config();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

const Register = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json("Username already taken");
      return;
    }
    // Check if the username is at least 4 characters long
    if (username.length < 4) {
      res.status(400).json("username must be at least 4 characters long");
      return;
    }
    if (password.length < 6) {
      res.status(400).json("password must be at least 6 characters long");
      return;
    }

    // Create the new user
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });

    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
};

const Login = async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) {
    // User not found
    res.status(400).json("wrong credentials");
    return;
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
};

const getProfile = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
};

const Logout = (req, res) => {
  res.cookie("token", "").json("ok");
};

const CreatePost = async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
};

const GetPost = async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
};

const GetPostById = async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc)
}

const EditPost = async(req,res) => {
  let newPath = null;
  if(req.file){
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext
    fs.renameSync(path,newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token,secret, {}, async(err,info) => {
    if(err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

    if(!isAuthor){
      return res.status(400).json('You are not the author');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover
    })
    res.json(postDoc)
  })
}

module.exports = {
  EditPost,
  Register,
  Login,
  getProfile,
  Logout,
  CreatePost,
  GetPost,
  GetPostById,
};