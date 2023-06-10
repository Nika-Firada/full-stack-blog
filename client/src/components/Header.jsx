import { Link } from 'react-router-dom'
import { UserContext } from "../UserContext";
import { useContext, useEffect } from "react";

const Header = () => {
    const { setUserInfo, userInfo } = useContext(UserContext);

    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(res => {
            res.json().then(user => {
                setUserInfo(user);
            })
        })
    }, []);

    const handleLogOut = () => {
        fetch('http://localhost:4000/logout', {
            credentials:"include",
            method:'POST'
        })
        setUserInfo(null);
    }
    const username = userInfo?.username;

    return (
        <header>
            <Link to={'/'} className="logo">
                MyBlog
            </Link>
            <nav>
                {username ?
                    (<>
                        <Link to='/create'>Create new post</Link>
                        <Link onClick={handleLogOut} to="/">Log Out</Link>
                    </>
                    ) :
                    (<>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>)
                }

            </nav>
        </header>
    )
}

export default Header