import React, { useState } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Link, useParams } from "react-router-dom";
import DefaultProfile from "../images/Profile.png";

const Comment = (props) => {
    const { postId, comments, updateComments } = props;
    const { id } = useParams();

    const [text, setText] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setError("");
        setText(event.target.value);
    };

    const isValid = () => {
        if (!text.length > 0 || text.length > 150) {
            setError("Comment should not be empty and less than 150 characters long");
            return false;
        }
        return true;
    };

    const addComment = (e) => {
        e.preventDefault();

        if (!isAuthenticated()) {
            setError("Please sign in to leave a comment");
            return false;
        }

        if (isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            comment(userId, token, postId, { text }).then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setText("");
                    // dispatch fresh list of comments to parent (SinglePost)
                    updateComments(data.comments);
                }
            });
        }
    };

    const deleteComment = (comment) => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        uncomment(userId, token, postId, comment).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                updateComments(data.comments);
            }
        });
    };

    const deleteConfirmed = (comment) => {
        let answer = window.confirm("Are you sure you want to delete your comment?");
        if (answer) {
            deleteComment(comment);
        }
    };

    return (
        <div>
            <h2 className="mt-5 mb-5">Leave a comment</h2>

            <form onSubmit={addComment}>
                <div className="form-group">
                    <input
                        type="text"
                        onChange={handleChange}
                        value={text}
                        className="form-control"
                        placeholder="Leave a comment..."
                    />
                    <button className="btn btn-raised btn-success mt-2">Post</button>
                </div>
            </form>

            <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                {error}
            </div>

            <div className="col-md-12">
                <h3 className="text-primary">{comments.length} Comments</h3>
                <hr />
                {comments.map((comment, i) => (
                    <div key={i}>
                        <div>
                            <Link to={`/user/${comment.postedBy._id}`}>
                                <img
                                    style={{
                                        borderRadius: "50%",
                                        border: "1px solid black",
                                    }}
                                    className="float-left mr-2"
                                    height="30px"
                                    width="30px"
                                    onError={(i) => (i.target.src = `${DefaultProfile}`)}
                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                                    alt={comment.postedBy.name}
                                />
                            </Link>
                            <div>
                                <p className="lead">{comment.text}</p>
                                <p className="font-italic mark">
                                    Posted by{" "}
                                    <Link to={`/user/${comment.postedBy._id}`}>
                                        {comment.postedBy.name}{" "}
                                    </Link>
                                    on {new Date(comment.created).toDateString()}
                                    <span>
                                        {isAuthenticated().user &&
                                            isAuthenticated().user._id === comment.postedBy._id && (
                                                <>
                                                    <span
                                                        onClick={() => deleteConfirmed(comment)}
                                                        className="text-danger float-right mr-1"
                                                    >
                                                        Remove
                                                    </span>
                                                </>
                                            )}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comment;
