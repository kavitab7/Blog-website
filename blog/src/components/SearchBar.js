import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { value } = event.target;
        setQuery(value);

        clearTimeout(typingTimeout);
        if (value.trim() !== '') {
            const newTimeout = setTimeout(() => {
                fetchSuggestions(value);
            }, 400);

            setTypingTimeout(newTimeout);
        } else {
            setSuggestions([]);
        }
    };

    const fetchSuggestions = async (value) => {
        try {
            const { data } = await axios.get(`/api/v1/blog/search?query=${value}`);
            setSuggestions(data.blogs);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };
    const handleSuggestionClick = (id) => {
        navigate(`/blog/${id}`);
    };


    return (
        <div className="input-group">
            <input
                type="text"
                className="form-control"
                placeholder="Search"
                aria-label="Search"
                value={query}
                onChange={handleChange}
            />


            {suggestions.length === 0 && query.trim() !== '' && (
                <ul className="list-group mt-2">
                    <li className="list-group-item suggestion-item">No search results found</li>
                </ul>
            )}
            {suggestions.length > 0 && (
                <ul className="list-group mt-2">
                    {suggestions.map((blog) => (
                        <li key={blog._id} className="list-group-item suggestion-item" onClick={() => handleSuggestionClick(blog._id)}>
                            <div className="d-flex align-items-center">
                                <img src={blog.image} alt="Blog" className="mr-3" style={{ width: '50px', height: 'auto' }} />
                                <div>
                                    <h5>{blog.title}</h5>

                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default SearchBar;
