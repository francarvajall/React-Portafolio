import React, { useState, useEffect } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { useNavigate, useParams } from "react-router-dom";
import DefaultPost from "../images/Profile.png";

const EditPost = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState({
        id: "",
        title: "",
        body: "",
        error: "",
        fileSize: 0,
        loading: false,
    });

    const { id, title, body, error, fileSize, loading } = post;

    const init = (postId) => {
        singlePost(postId).then((data) => {
            if (data.error) {
                navigate(`/user/${isAuthenticated().user._id}`);
            } else {
                setPost({
                    ...post,
                    id: data.postedBy._id,
                    title: data.title,
                    body: data.body,
                    error: "",
                });
            }
        });
    };

    useEffect(() => {
        const formData = new FormData();
        init(postId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    const isValid = () => {
        if (fileSize > 1000000) {
            setPost({ ...post, error: "File size should be less than 100kb", loading: false });
            return false;
        }
        if (title.length === 0 || body.length === 0) {
            setPost({ ...post, error: "All fields are required", loading: false });
            return false;
        }
        return true;
    };

    const handleChange = (name) => (event) => {
        setPost({ ...post, error: "" });
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        const updatedPostData = new FormData();
        updatedPostData.set(name, value);
        setPost({ ...post, [name]: value, fileSize, postData: updatedPostData });
    };

    const clickSubmit = (event) => {
        event.preventDefault();
        setPost({ ...post, loading: true });

        if (isValid()) {
            const token = isAuthenticated().token;

            update(postId, token, post.postData).then((data) => {
                if (data.error) setPost({ ...post, error: data.error });
                else {
                    setPost({
                        ...post,
                        loading: false,
                        title: "",
                        body: "",
                    });
                    navigate(`/user/${isAuthenticated().user._id}`);
                }
            });
        }
    };

    const editPostForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Post Photo</label>
                <input
                    onChange={handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                    onChange={handleChange("title")}
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea
                    onChange={handleChange("body")}
                    type="text"
                    className="form-control"
                    value={body}
                />
            </div>

            <button
                onClick={clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Update Post
            </button>
        </form>
    );

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">{title}</h2>

            <div
                className="alert alert-danger"
                style={{ display: error ? "" : "none" }}
            >
                {error}
            </div>

            {loading ? (
                <div className="jumbotron text-center">
                    <h2>Loading...</h2>
                </div>
            ) : (
                ""
            )}

            <img
                style={{ height: "200px", width: "auto" }}
                className="img-thumbnail"
                src={`${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`}
                onError={(i) => (i.target.src = `${DefaultPost}`)}
                alt={title}
            />

            {(isAuthenticated().user.role === "admin" ||
                isAuthenticated().user._id === id) &&
                editPostForm(title, body)}
        </div>
    );
};

export default EditPost;
