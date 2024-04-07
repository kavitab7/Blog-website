import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import Loader from '../components/Loader';

const PAGE_NUMBER = 1;

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(PAGE_NUMBER);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(async () => {
            try {
                const { data } = await axios.get(`/api/v1/blog/all-blogs?page=${page}`);
                if (data?.success) {
                    setBlogs((prev) => [...prev, ...data.blogs]);
                    setTotalPages(data.totalPages);
                    setHasMorePages(data.hasMorePages);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }, 1500);
    }, [page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight && hasMorePages) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <>
            <div className="blog-page">
                {blogs.map((blog, index) => (
                    <React.Fragment key={blog?._id}>
                        <BlogCard
                            id={blog?._id}
                            isUser={localStorage.getItem('userId') === blog?.user?._id}
                            title={blog?.title}
                            description={blog?.description}
                            image={blog?.image}
                            username={blog?.user?.username}
                            time={blog?.createdAt}
                            userToFollowId={blog?.user?._id}
                        />
                        {hasMorePages && loading && <Loader />}
                    </React.Fragment>
                ))}
            </div>
        </>
    );
};

export default Blogs;
