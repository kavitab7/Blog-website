import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";

const CreateBlog = () => {
    const navigate = useNavigate();
    const id = localStorage.getItem('userId')
    const [inputs, setInputs] = useState({
        title: '',
        description: '',
        image: ''
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
            const { data } = await axios.post('/api/v1/blog/create-blog', {
                title: inputs.title, description: inputs.description, image: inputs.image, user: id,
            })
            if (data.success) {
                toast.success('Blog created successfully')
                navigate('/my-blogs')
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <div className="login">
                <h2 className="mb-4" >Create a Blog </h2>
                <form onSubmit={handleSubmit}>
                    <div className="login-info">

                        <div className="mb-3">
                            <label for="exampleInputEmail1" className="form-label">Title</label>
                            <input type="text" value={inputs.title} onChange={handleChange} className="form-control" name='title' id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputEmail1" className="form-label">Description</label>
                            <textarea type="textarea" value={inputs.description} onChange={handleChange} className="form-control" name='description' id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label">Image Address Link</label>
                            <input type="text" value={inputs.image} onChange={handleChange} className="form-control" name='image' id="exampleInputPassword1" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CreateBlog