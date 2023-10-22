import * as React from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { indigo } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";

export default function BlogCard({ title, description, image, username, time, id, isUser }) {
    const navigate = useNavigate();
    const handleEdit = () => {
        navigate(`/blog-details/${id}`)
    }

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(`/api/v1/blog/delete-blog/${id}`)
            if (data?.success) {
                toast.success('blog deleted')
                window.location.reload();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Card className="blog" sx={{
            margin: "auto",
            mt: 2,
            padding: 2,
            boxShadow: "1px 1px 5px #ccc;",
        }} >
            {isUser && (
                <Box display={'flex'}>
                    <IconButton onClick={handleEdit} sx={{ marginLeft: "auto" }} >
                        <EditIcon color="success" />
                    </IconButton>
                    <IconButton onClick={handleDelete}>
                        <DeleteOutlineIcon color="error" />
                    </IconButton>
                </Box>
            )}
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: indigo[500] }} aria-label="recipe">
                        {username}
                    </Avatar>
                }
                title={username}
                subheader={time}
            />
            <CardMedia component="img" height="210" image={image} alt="blog photo" />
            <CardContent>
                <Typography variant="h6" >
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
}