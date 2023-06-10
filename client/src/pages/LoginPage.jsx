import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUserInfo } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (res.ok) {
            res.json().then(userInfo => {
                setUserInfo(userInfo);
                navigate("/");
            });
        } else {
            alert('wrong credentials')
        }
    }

    return (
        <form onSubmit={handleLogin} className='login'>
            <h1>Login</h1>
            <input
                type="text"
                placeholder='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder='password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <button>Login</button>
        </form>
    )
}

export default LoginPage