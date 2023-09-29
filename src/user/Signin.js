import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin, authenticate } from "../auth";

const Signin = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        error: "",
        loading: false
    });

    const { email, password, error, loading } = formData;

    const handleChange = (name) => (event) => {
        setFormData({ ...formData, error: "", [name]: event.target.value });
    };


    const clickSubmit = (event) => {
        event.preventDefault();
        const user = { email, password };

        console.log(user);
        signin(user).then((data) => {
            if (data.error) {
                setFormData({ ...formData, error: data.error });
            } else {
                // authenticate
                authenticate(data, () => {
                    navigate("/");
                });
            }
        });
    };


    const signinForm = () => (
        <form>
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
                <label className="text-muted">Password</label>
                <input
                    onChange={handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>

            <button
                onClick={clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Submit
            </button>
        </form>
    );
    
    return (
        <div className="container">
            <h2 className="mt-5 mb-5">SignIn</h2>

            <div
                className="alert alert-danger"
                style={{ display: error ? "" : "none" }}
            >
                {error}
            </div>

            {signinForm()}
        </div>
    );
};

export default Signin;
