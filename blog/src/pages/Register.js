import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        name: '',
        email: '',
        password: ''
    })
    const handleChange = (e) => {
        setInputs((preState) => ({
            ...preState,
            [e.target.name]: e.target.value,
        })
        )
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/v1/user/register', {
                username: inputs.name, email: inputs.email, password: inputs.password
            })
            if (data.success) {
                toast.success('user registered successfully')
                navigate('/login')
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <div className="login">
                <h3 className="mb-3" >Register</h3>
                <form onSubmit={handleSubmit}>
                    <div className="login-info">
                        <div className="mb-3">
                            <label for="exampleInputEmail1" className="form-label">Username</label>
                            <input type="text" value={inputs.name} onChange={handleChange} className="form-control" name='name' id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" value={inputs.email} onChange={handleChange} className="form-control" name='email' id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" value={inputs.password} onChange={handleChange} className="form-control" name='password' id="exampleInputPassword1" />
                        </div>
                        <button className='navi' onClick={() => navigate('/login')}>Already registered? please Login</button>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Register