import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { remove } from './apiUser';
import { signout } from '../auth';

const DeleteUser = ({ userId }) => {
    const navigate = useNavigate();

    const deleteAccount = () => {
        const token = isAuthenticated().token;
        console.log('userId in deleteAccount ', userId);
        remove(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                // signout user
                signout(() => console.log('User is deleted'));
                // redirect
                navigate('/');
            }
        });
    };

    const deleteConfirmed = () => {
        let answer = window.confirm('Are you sure you want to delete your account?');
        if (answer) {
            deleteAccount();
        }
    };

    return (
        <button onClick={deleteConfirmed} className="btn btn-raised btn-danger">
            Delete Profile
        </button>
    );
}

export default DeleteUser;
