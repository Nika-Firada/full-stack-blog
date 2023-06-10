const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const multer = require('multer');
const { Register, Login, getProfile, Logout, CreatePost, GetPost, GetPostById, EditPost } = require("./controllers/UserCont");
const app = express();
const uploadMiddleware = multer({dest:'uploads/'})

dotenv.config();
app.use(cors({credentials: true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGO_URL);

app.post("/register", Register);
app.post("/login", Login);
app.post("/logout", Logout);
app.post("/post", uploadMiddleware.single('file'), CreatePost);
app.get("/post", GetPost);
app.get("/post/:id", GetPostById);
app.get('/profile', getProfile);
app.put('/post', uploadMiddleware.single('file'), EditPost);

const port = process.env.PORT;
app.listen(port);