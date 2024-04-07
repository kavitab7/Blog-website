import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, IconButton, TextField, Collapse, Typography, Badge } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { indigo } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplyIcon from '@mui/icons-material/Reply';
import axios from 'axios';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';


export default function BlogCard({ title, description, image, username, time, id, isUser, userToFollowId }) {
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [userId, setUserId] = useState("");
    const [liked, setLiked] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const [following, setFollowing] = useState(false);


    useEffect(() => {
        const userIdFromStorage = localStorage.getItem('userId');
        setUserId(userIdFromStorage);
        const fetchComments = async () => {
            try {
                const { data } = await axios.get(`/api/v1/blog/comments/${id}`);
                setComments(data?.comments || []);
            } catch (error) {
                console.error('Error fetching comments: ', error);
            }
        };

        const fetchLikes = async () => {
            try {
                const { data } = await axios.get(`/api/v1/blog/check-like/${id}`);
                setLiked(data?.liked);
                setLikes(data?.likes.length || 0);
            } catch (error) {
                console.error('Error fetching likes: ', error);
            }
        };

        fetchComments();
        fetchLikes();
    }, [id]);

    useEffect(() => {
        const checkFollowingStatus = async () => {
            try {
                const { data } = await axios.get(`/api/v1/user/is-following/${userId}/${userToFollowId}`);
                if (data?.success) {
                    setFollowing(data.following);
                }
            } catch (error) {
                console.error('Error checking following status: ', error);
            }
        };
        if (userId && userToFollowId) {
            checkFollowingStatus();
        }
    }, [userId, userToFollowId]);

    const handleFollowUser = async () => {
        try {
            const { data } = await axios.post(`/api/v1/user/follow/${userId}/${userToFollowId}`);
            if (data?.success) {
                setFollowing(true);
                toast.success('User followed successfully');
            }
        } catch (error) {
            toast.error('Error following user: ', error);
        }
    };

    const handleUnfollowUser = async () => {
        try {
            const { data } = await axios.post(`/api/v1/user/unfollow/${userId}/${userToFollowId}`);
            if (data?.success) {
                setFollowing(false);
                toast.success('User unfollowed successfully');
            }
        } catch (error) {
            console.error('Error unfollowing user: ', error);
        }
    };

    const handleEdit = () => {
        navigate(`/blog-details/${id}`);
    };

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(`/api/v1/blog/delete-blog/${id}`);
            if (data?.success) {
                toast.success('blog deleted');
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleComment = async () => {
        try {
            const { data } = await axios.post(`/api/v1/blog/comment/${id}`, { content: comment });
            if (data?.success) {
                toast.success('Comment posted successfully');
                setComment("");

                const { data: newData } = await axios.get(`/api/v1/blog/comments/${id}`);
                const updatedComments = newData.comments.map(comment => ({
                    ...comment,
                    user: {
                        username: username
                    }
                }));
                setComments(updatedComments);
            }
        } catch (error) {
            console.error('Error posting comment: ', error);
        }
    };

    const handleLike = async () => {
        try {
            const { data } = await axios.get(`/api/v1/blog/check-like/${id}`);
            setLiked(data?.liked);
            if (data?.liked) {
                toast.error('You have already liked this blog post');
            } else {
                const likeResponse = await axios.post(`/api/v1/blog/like/${id}`);
                if (likeResponse.data?.success) {
                    setLikes(likes + 1);
                    setLiked(true);
                    toast.success('You liked this blog post');
                }
            }
        } catch (error) {
            console.error('Error handling like: ', error);
        }
    };

    const handleReply = async (commentId, replyContent) => {
        try {
            const { data } = await axios.post(`/api/v1/blog/comment/${id}/reply`, { commentId, content: replyContent });
            if (data?.success) {
                toast.success('Reply posted successfully');
                const { data: newData } = await axios.get(`/api/v1/blog/comments/${id}`);
                setComments(newData.comments);
            }
        } catch (error) {
            console.error('Error posting reply: ', error);
        }
    };

    const handleReplyToggle = () => {
        setShowReplies(!showReplies);
    };


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
                title={
                    <Box display="flex" alignItems="center">
                        <Typography>{username}</Typography>
                        {userId && userId !== userToFollowId && (
                            <>
                                {following ? (
                                    <IconButton onClick={handleUnfollowUser}>
                                        <Typography variant="body2" sx={{ color: 'primary.main', ml: 1 }}>Unfollow </Typography>
                                    </IconButton>
                                ) : (
                                    <IconButton onClick={handleFollowUser}>
                                        <Typography variant="body2" sx={{ color: 'primary.main', ml: 1 }}>Follow </Typography>
                                    </IconButton>
                                )}
                            </>
                        )}
                    </Box>
                }
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
                <Box display="flex" alignItems="center" mt={2} >
                    <IconButton onClick={handleLike}>
                        {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <Typography mr={2}>{likes}</Typography>
                    <TextField
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        label="Add a comment"
                        variant="outlined"
                        size="small"
                    />
                    <IconButton onClick={handleComment}>
                        <SendIcon />
                    </IconButton>
                    <Box onClick={() => setExpanded(!expanded)}
                        aria-expanded={expanded}
                        aria-label="show more" sx={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}>
                        <IconButton aria-label="comments" disabled>
                            <Badge badgeContent={comments.length} color="primary">
                                <CommentIcon />
                            </Badge>
                        </IconButton>
                    </Box>

                </Box>
                <Collapse in={expanded} timeout="auto" unmountOnExit>

                    {comments.map((comment) => (
                        <Box key={comment._id} ml={2} mt={2} display="flex" flexDirection="column">
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: indigo[500], marginRight: 1, width: 25, height: 25 }}>
                                    {comment.user && comment.user.username ? comment.user.username : ''}
                                </Avatar>
                                <Typography>{comment.user && comment.user.username}</Typography>
                            </Box>
                            <Typography>{comment.content}</Typography>
                            <Box display="flex" alignItems="center">
                                <TextField
                                    label="Reply"
                                    variant="outlined"
                                    size="small"
                                    value={comment.replyContent || ""}
                                    onChange={(e) => {
                                        const updatedComments = [...comments];
                                        const commentIndex = updatedComments.findIndex(c => c._id === comment._id);
                                        updatedComments[commentIndex].replyContent = e.target.value;
                                        setComments(updatedComments);
                                    }}
                                />
                                <IconButton
                                    onClick={() => handleReply(comment._id, comment.replyContent)}
                                    disabled={!comment.replyContent}
                                >
                                    <ReplyIcon />
                                </IconButton>
                            </Box>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <Typography onClick={handleReplyToggle} sx={{ cursor: 'pointer', mt: 1, mb: 1 }}>Replies...</Typography>
                                <Collapse in={showReplies} timeout="auto" unmountOnExit>
                                    {comment.replies.map((reply) => (
                                        <Box key={reply._id} ml={2} mt={1} display="flex" flexDirection="column">
                                            <Box display="flex" alignItems="center">
                                                <Avatar sx={{ bgcolor: indigo[500], marginRight: 1, width: 22, height: 22 }}>{reply.user && reply.user.username}</Avatar>
                                                <Typography variant="body2">{reply.user && reply.user.username}</Typography>
                                                <Typography variant="body2">{reply.content}</Typography>
                                            </Box>

                                        </Box>
                                    ))}
                                </Collapse>
                            </Collapse>
                        </Box>
                    ))}

                </Collapse>
            </CardContent>

        </Card>
    );
}
