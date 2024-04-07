import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import { useParams } from 'react-router-dom';

const SingleBlog = () => {
    const [blog, setBlog] = useState(null);
    const { id } = useParams()
    // Fetch the blog data based on the blogId
    const fetchBlog = async () => {
        try {
            const { data } = await axios.get(`/api/v1/blog/get-blog/${id}`);
            if (data?.success) {
                setBlog(data.blog);
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
        }
    };

    useEffect(() => {
        fetchBlog();
    }, [id]);
    return (
        <>
            {blog && (
                <div className="blog-page">
                    <BlogCard
                        key={blog._id}
                        id={blog._id}
                        isUser={localStorage.getItem('userId') === blog.user._id}
                        title={blog.title}
                        description={blog.description}
                        image={blog.image}
                        username={blog.user.username}
                        time={blog.createdAt}
                    />
                </div>
            )}
        </>
    )
}

export default SingleBlog