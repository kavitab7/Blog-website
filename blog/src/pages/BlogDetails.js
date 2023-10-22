import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import toast from "react-hot-toast";

const BlogDetails = () => {
    const navigate = useNavigate();
    const [blog, setBlog] = useState({});
    const id = useParams().id;
    const [inputs, setInputs] = useState({})

    const getBlogDetail = async () => {
        try {
            const { data } = await axios.get(`/api/v1/blog/get-blog/${id}`)
            if (data?.success) {
                setBlog(data?.blog)
                setInputs({
                    title: data?.blog.title,
                    description: data?.blog.description,
                    image: data?.blog.image,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getBlogDetail();
    }, [id])

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
            const { data } = await axios.put(`/api/v1/blog/update-blog/${id}`, {
                title: inputs.title, description: inputs.description, image: inputs.image, user: id,
            })
            if (data.success) {
                toast.success('blog updated successfully')
                navigate('/my-blogs')
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <div className="login">
                <h2 className="mb-5" >Edit a Blog </h2>
                <form onSubmit={handleSubmit}>
                    <div className="login-info">
                        <div className="mb-3">
                            <label for="exampleInputEmail1" className="form-label">Title</label>
                            <input type="text" value={inputs.title} onChange={handleChange} className="form-control" name='title' id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputEmail1" className="form-label">Description</label>
                            <textarea type="text" value={inputs.description} onChange={handleChange} className="form-control" name='description' id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label">Image</label>
                            <input type="text" value={inputs.image} onChange={handleChange} className="form-control" name='image' id="exampleInputPassword1" />
                        </div>
                        <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default BlogDetails