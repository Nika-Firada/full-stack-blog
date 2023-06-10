import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/register', {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        console.log('Registration successful');
        navigate('/login');
      } else {
        const errorResponse = await res.json();
        if (errorResponse) {
          setErrors(errorResponse)
        } else {
          alert('Registration failed');
        }
      }
    } catch (error) {
      alert('Network error: ' + error);
    }
  };


  return (
    <form onSubmit={handleRegister} className='register'>
      <h1>Register</h1>
      {errors && <span>{errors}</span>}
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
      <button>Register</button>
    </form>
  )
}

export default RegisterPage