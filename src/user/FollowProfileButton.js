import { useState } from "react";
import { follow, unfollow } from "./apiUser";

const FollowProfileButton = (props) => {
    const [following, setFollowing] = useState(props.following);

    const followClick = () => {
        setFollowing(true);
        props.onButtonClick(follow);
    };

    const unfollowClick = () => {
        setFollowing(false);
        props.onButtonClick(unfollow);
    };

    return (
        <div className="d-inline-block">
            {!following ? (
                <button
                    onClick={followClick}
                    className="btn btn-success btn-raised mr-5"
                >
                    Follow
                </button>
            ) : (
                <button
                    onClick={unfollowClick}
                    className="btn btn-warning btn-raised"
                >
                    Unfollow
                </button>
            )}
        </div>
    );
};

export default FollowProfileButton;
