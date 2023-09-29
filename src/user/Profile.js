import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { read } from './apiUser';
import DefaultProfile from '../images/Profile.png';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import { listByUser } from '../post/apiPost';

function Profile() {
  const [user, setUser] = useState({ following: [], followers: [] });
  const [following, setFollowing] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();

  const checkFollow = () => {
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => {
      return follower._id === jwt.user._id;
    });
    return match;
  };

  const clickFollowButton = callApi => {
    const jwt = isAuthenticated();
    const token = jwt.token;

    callApi(jwt.user._id, token, userId).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setUser(data);
        setFollowing(!following);
      }
    });
  };

  const init = () => {
    const jwt = isAuthenticated();
    const token = jwt.token;
    read(userId, token).then(data => {
      if (data.error) {
        navigate('/signin');
      } else {
        let following = checkFollow(data);
        setUser(data);
        setFollowing(following);
        loadPosts(userId); // Call loadPosts here
      }
    });
  };
  

  useEffect(() => {
    init();
  }, [userId]);

  const loadPosts = (userId) => {
    const token = isAuthenticated().token;
    listByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  };

  const photoUrl = user._id
    ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`
    : DefaultProfile;
  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Profile</h2>
      <div className="row">
        <div className="col-md-4">
          <img
            style={{ height: '200px', width: 'auto' }}
            className="img-thumbnail"
            src={photoUrl}
            onError={i => (i.target.src = `${DefaultProfile}`)}
            alt={user.name}
          />
        </div>

        <div className="col-md-8">
          <div className="lead mt-2">
            <p>Hello {user.name}</p>
            <p>Email: {user.email}</p>
            <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
          </div>

          {isAuthenticated().user && isAuthenticated().user._id === user._id ? (
            <div className="d-inline-block">
              <Link className="btn btn-raised btn-info mr-5" to={`/post/create`}>
                Create Post
              </Link>

              <Link className="btn btn-raised btn-success mr-5" to={`/user/edit/${user._id}`}>
                Edit Profile
              </Link>
              <DeleteUser userId={user._id} />
            </div>
          ) : (
            <FollowProfileButton following={following} onButtonClick={clickFollowButton} />
          )}

          <div>
            {isAuthenticated().user && isAuthenticated().user.role === 'admin' && (
              <div className="card mt-5">
                <div className="card-body">
                  <h5 className="card-title">Admin</h5>
                  <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                  <Link className="btn btn-raised btn-success mr-5" to={`/user/edit/${user._id}`}>
                    Edit Profile
                  </Link>
                  <DeleteUser userId={user._id} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col md-12 mt-5 mb-5">
          <hr />
          <p className="lead">{user.about}</p>
          <hr />

          <ProfileTabs followers={user.followers} following={user.following} posts={posts} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
