import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import Editor from "../components/Editor";
import { useNavigate } from "react-router-dom";


const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();


    const createNewPost = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);

        const res = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        if(res.ok){
            navigate('/')
        }
    }

    return (
        <form onSubmit={createNewPost}>
            <input type="title"
                placeholder={'Title'}
                value={title}
                onChange={e => setTitle(e.target.value)} 
            />
            <input type="summary"
                placeholder={'Summary'}
                value={summary}
                onChange={e => setSummary(e.target.value)} 
            />
            <input type="file"
                onChange={e => setFiles(e.target.files)}
            />
            <Editor value={content} onChange={setContent} />
            <button style={{ marginTop: '5px' }}>Create post</button>
        </form>
    )
}

export default CreatePost