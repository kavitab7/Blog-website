import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { authActions } from '../redux/store';
import toast from "react-hot-toast";

const Header = () => {
    //global state
    let isLogin = useSelector((state) => state.isLogin);
    isLogin = isLogin || localStorage.getItem('userId');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            dispatch(authActions.logout());
            toast.success("Logout Successfully");
            navigate("/login");
            localStorage.clear();
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg ">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" >BlogLy.</NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav mb-2 mb-lg-0 ">
                            <NavLink to="/" className="nav-link active" aria-current="page" >Home</NavLink>
                            <NavLink to="/blogs" className="nav-link" >Blogs</NavLink>
                            {isLogin && (<>
                                <NavLink to="/my-blogs" className="nav-link" >Myblogs</NavLink>
                                <NavLink to="/create-blog" className="nav-link" >Create blogs</NavLink>
                            </>
                            )}
                            {!isLogin && (<>
                                <NavLink to="/login" className="nav-link" >Login</NavLink>
                                <NavLink to="/register" className="nav-link" >Register</NavLink>
                            </>)}
                            {isLogin && (<NavLink to="/logout" onClick={handleLogout} className="nav-link" >Logout</NavLink>)}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header