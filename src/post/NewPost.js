import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiPost";
import { useNavigate } from "react-router-dom";

const NewPost = () => {
  const [values, setValues] = useState({
    title: "",
    body: "",
    photo: "",
    error: "",
    user: {},
    fileSize: 0,
    loading: false,
    redirectToProfile: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    setValues({ ...values, user: isAuthenticated().user });
  }, []);

  const { title, body, photo, error, user, fileSize, loading, redirectToProfile } = values;

  const isValid = () => {
    if (fileSize > 100000) {
      setValues({ ...values, error: "File size should be less than 100kb", loading: false });
      return false;
    }
    if (title.trim().length === 0 || body.trim().length === 0) {
      setValues({ ...values, error: "All fields are required", loading: false });
      return false;
    }
    return true;
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    setValues({ ...values, [name]: value, fileSize });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, loading: true });

    if (isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      formData.append("photo", photo);

      create(userId, token, formData).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          setValues({
            ...values,
            loading: false,
            title: "",
            body: "",
            redirectToProfile: true,
          });
          navigate(`/user/${user._id}`);
        }
      });
    }
  };

  const newPostForm = () => (
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

      <button onClick={clickSubmit} className="btn btn-raised btn-primary">
        Create Post
      </button>
    </form>
  );

  if (redirectToProfile) {
    return <Navigate to={`/user/${user._id}`} />;
  }

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Create a new post</h2>
      <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
        {error}
      </div>

      {loading ? (
        <div className="jumbotron text-center">
          <h2>Loading...</h2>
        </div>
      ) : (
        ""
      )}

      {newPostForm()}
    </div>
  );
};

export default NewPost;
