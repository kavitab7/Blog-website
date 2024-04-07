import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';

const Following = () => {
    const [blogs, setBlogs] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAllBlogs = async () => {
        try {
            const { data } = await axios.get('/api/v1/user/following/blogs');
            if (data?.success) {
                setBlogs(data?.blogs);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem('userId');
        setUserId(userIdFromStorage);
        getAllBlogs();
    }, [userId]);

    return (
        <>
            <div className="blog-page">
                {loading ? (
                    <p>Loading...</p>
                ) : blogs.length === 0 ? (
                    <p>No blogs found. Follow some users to see their blogs.</p>
                ) : (
                    blogs.map((blog) => (
                        <BlogCard
                            key={blog?._id}
                            id={blog?._id}
                            isUser={localStorage.getItem('userId') === blog?.user?._id}
                            title={blog?.title}
                            description={blog?.description}
                            image={blog?.image}
                            username={blog?.user?.username}
                            time={blog?.createdAt}
                            userToFollowId={blog?.user?._id}
                        />
                    ))
                )}
            </div>
        </>
    );
};

export default Following;
