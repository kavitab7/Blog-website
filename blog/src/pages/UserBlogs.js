import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard';
import axios from 'axios'

const UserBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const getUserBlogs = async () => {
        try {
            const id = localStorage.getItem('userId');
            const { data } = await axios.get(`/api/v1/blog/user-blog/${id}`)
            if (data?.success) {
                setUserDetails(data?.userBlog)
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
                <div className="user-details">
                    {userDetails && (
                        <>
                            <h1>Username:  {userDetails.username}</h1>
                            <div className="details">
                                <p>Following: {userDetails.following.length}</p> |
                                <p>Followers: {userDetails.followers.length}</p> |
                                <p>Blogs: {blogs.length}</p>
                            </div>
                        </>
                    )}
                </div>

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
                            time={blog?.createdAt}
                        />
                    ))
                    : (<h1>You haven't created any blog</h1>)
                }
            </div>
        </>
    )
}

export default UserBlogs