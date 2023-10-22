import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard';
import axios from 'axios'

const UserBlogs = () => {
    const [blogs, setBlogs] = useState([]);

    const getUserBlogs = async () => {
        try {
            const id = localStorage.getItem('userId');
            const { data } = await axios.get(`/api/v1/blog/user-blog/${id}`)
            if (data?.success) {
                setBlogs(data?.userBlog.blogs)
            }

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getUserBlogs();
    }, [])
    return (
        <>
            <div className="blog-page">
                {blogs && blogs.length > 0 ? (
                    blogs.map((blog) =>
                        <BlogCard
                            key={blog._id}
                            id={blog?._id}
                            isUser={true}
                            title={blog?.title}
                            description={blog?.description}
                            image={blog?.image}
                            username={blog?.user.username}
                            time={blog?.createdAt} />))
                    : (<h1>You haven't created any blog</h1>)
                }
            </div>
        </>
    )
}

export default UserBlogs