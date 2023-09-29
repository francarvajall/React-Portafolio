import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./apiUser";
import DefaultProfile from "../images/Profile.png";

function EditProfile() {
  const { userId } = useParams();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToProfile, setRedirectToProfile] = useState(false);
  const [error, setError] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [about, setAbout] = useState("");
  const [photo, setPhoto] = useState(null); // Added state for photo

  useEffect(() => {
    const init = (userId) => {
      const token = isAuthenticated().token;
      read(userId, token).then((data) => {
        if (data.error) {
          setRedirectToProfile(true);
        } else {
          setId(data._id);
          setName(data.name);
          setEmail(data.email);
          setAbout(data.about);
          setError("");
        }
      });
    };

    init(userId);
  }, [userId]);

  const isValid = () => {
    if (fileSize > 1000000) {
      setError("File size should be less than 100kb");
      setLoading(false);
      return false;
    }
    if (name.length === 0) {
      setError("Name is required");
      setLoading(false);
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError("A valid Email is required");
      setLoading(false);
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return false;
    }
    return true;
  };

  const handleChange = (name) => (event) => {
    setError("");
    if (name === "photo") {
      const file = event.target.files[0]; // Get the selected file
      setPhoto(file); // Store the file in state
    } else {
      const value = event.target.value;
      if (name === "name") {
        setName(value);
      } else if (name === "email") {
        setEmail(value);
      } else if (name === "password") {
        setPassword(value);
      } else if (name === "about") {
        setAbout(value);
      }
    }
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    if (isValid()) {
      const token = isAuthenticated().token;
      const userData = new FormData();

      userData.set("name", name);
      userData.set("email", email);
      userData.set("password", password);
      userData.set("about", about);

      if (photo) {
        // Append the photo to the FormData if it exists
        userData.append("photo", photo);
      }

      update(userId, token, userData).then((data) => {
        if (data.error) {
          setError(data.error.message);
          setLoading(false);
        } else if (isAuthenticated().user.role === "admin") {
          setRedirectToProfile(true);
        } else {
          updateUser(data, (err) => {
            if (err) {
              setError("Error updating user profile");
              setLoading(false);
            } else {
              setRedirectToProfile(true);
            }
          });
        }
      });
    }
  };

  const signupForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Profile Photo</label>
        <input
          onChange={handleChange("photo")}
          type="file"
          name="photo" // Add the 'name' attribute
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">About</label>
        <textarea
          onChange={handleChange("about")}
          type="text"
          className="form-control"
          value={about}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={clickSubmit} className="btn btn-raised btn-primary">
        Update
      </button>
    </form>
  );

  if (redirectToProfile) {
    return <Navigate to={`/user/${id}`} />;
  }

  const photoUrl = id
    ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}`
    : DefaultProfile;

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Edit Profile</h2>
      <div className="alert alert-danger" style={{ display: error ? "block" : "none" }}>
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
        src={photoUrl}
        onError={(i) => (i.target.src = `${DefaultProfile}`)}
        alt={name}
      />

      {(isAuthenticated().user.role === "admin" || isAuthenticated().user._id === id) && signupForm()}
    </div>
  );
}

export default EditProfile;
