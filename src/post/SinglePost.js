import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { singlePost, remove, like, unlike } from './apiPost';

import DefaultPost from '../images/Profile.png';
import { isAuthenticated } from '../auth';
import Comment from './Comment';

const SinglePost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [redirectToHome, setRedirectToHome] = useState(false);
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const [likeStatus, setLikeStatus] = useState(false); // Cambiado el nombre de la variable aquí
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);

    const checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        return likes.indexOf(userId) !== -1;
    };

    useEffect(() => {
        singlePost(postId).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log('COMMENTING USER IN SINGLE POST', data);
                setPost(data);
                setLikes(data.likes.length);
                setLikeStatus(checkLike(data.likes)); // Cambiado el nombre de la variable aquí
                setComments(data.comments);
            }
        });
    }, [postId]);

    const updateComments = (updatedComments) => {
        setComments(updatedComments);
    };

    const likeToggle = () => {
        if (!isAuthenticated()) {
            setRedirectToSignin(true);
            return;
        }

        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const apiCallFunction = likeStatus ? unlike : like; // Cambiado el nombre de la variable aquí

        apiCallFunction(userId, token, postId).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setLikeStatus(!likeStatus); // Cambiado el nombre de la variable aquí
                setLikes(data.likes.length);
            }
        });
    };

    const deletePost = () => {
        const token = isAuthenticated().token;
        remove(postId, token).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setRedirectToHome(true);
            }
        });
    };

    const deleteConfirmed = () => {
        const answer = window.confirm('Are you sure you want to delete your post?');
        if (answer) {
            deletePost();
        }
    };

    const renderPost = (post) => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : '';
        const posterName = post.postedBy ? post.postedBy.name : ' Unknown';

        return (
            <div className="card-body">
                <img
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    alt={post.title}
                    onError={(i) => (i.target.src = `${DefaultPost}`)}
                    className="img-thumbnail mb-3"
                    style={{
                        height: '300px',
                        width: '100%',
                        objectFit: 'cover',
                    }}
                />

                <h3 onClick={likeToggle}>
                    <i
                        className={`fa fa-thumbs-up text-${likeStatus ? 'success' : 'warning'} bg-dark`}
                        style={{ padding: '10px', borderRadius: '50%' }}
                    />{' '}
                    {likes} Like
                </h3>

                <p className="card-text">{post.body}</p>
                <br />
                <p className="font-italic mark">
                    Posted by <Link to={posterId}>{posterName} </Link>
                    on {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">
                        Back to posts
                    </Link>

                    {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && (
                        <>
                            <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning btn-sm mr-5">
                                Update Post
                            </Link>
                            <button onClick={deleteConfirmed} className="btn btn-raised btn-danger">
                                Delete Post
                            </button>
                        </>
                    )}

                    {isAuthenticated().user && isAuthenticated().user.role === 'admin' && (
                        <div className="card mt-5">
                            <div className="card-body">
                                <h5 className="card-title">Admin</h5>
                                <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                                <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning btn-sm mr-5">
                                    Update Post
                                </Link>
                                <button onClick={deleteConfirmed} className="btn btn-raised btn-danger">
                                    Delete Post
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (redirectToHome) {
        navigate('/');
        return null;
    } else if (redirectToSignin) {
        navigate('/signin');
        return null;
    }

    return (
        <div className="container">
            {post ? (
                <>
                    <h2 className="display-2 mt-5 mb-5">{post.title}</h2>
                    {renderPost(post)}
                    <Comment postId={post._id} comments={comments.reverse()} updateComments={updateComments} />
                </>
            ) : (
                <div className="jumbotron text-center">
                    <h2>Loading...</h2>
                </div>
            )}
        </div>
    );
};

export default SinglePost;
