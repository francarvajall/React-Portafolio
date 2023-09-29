import React, { useState, useEffect } from "react";
import { list } from "./apiPost";
import DefaultPost from "../images/Profile.png";
import { Link, useNavigate } from "react-router-dom";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const loadPosts = (pageNumber) => {
    list(pageNumber).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setPosts(data);
      }
    });
  };

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  const loadMore = (number) => {
    setPage(page + number);
  };

  const loadLess = (number) => {
    setPage(page - number);
  };

  const renderPosts = (posts) => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : " Unknown";

          if (!post.photo) {
            return null;
          }

          return (
            <div className="card col-md-4" key={i}>
              <div className="card-body">
                <img
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                  alt={post.title}
                  onError={(e) => (e.target.src = `${DefaultPost}`)}
                  className="img-thumbnail mb-3"
                  style={{ height: "200px", width: "100%" }}
                />
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body.substring(0, 100)}</p>
                <br />
                <p className="font-italic mark">
                  Posted by <Link to={posterId}>{posterName} </Link>
                  on {new Date(post.created).toDateString()}
                </p>
                <Link
                  to={`/post/${post._id}`}
                  className="btn btn-raised btn-primary btn-sm"
                >
                  Read more
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">
        {!posts.length ? "No more posts!" : "Recent Posts"}
      </h2>

      {renderPosts(posts)}

      {page > 1 ? (
        <button
          className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
          onClick={() => loadLess(1)}
        >
          Previous ({page - 1})
        </button>
      ) : null}

      {posts.length ? (
        <button
          className="btn btn-raised btn-success mt-5 mb-5"
          onClick={() => loadMore(1)}
        >
          Next ({page + 1})
        </button>
      ) : (
        <button
          className="btn btn-raised btn-warning mt-5 mb-5"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      )}
    </div>
  );
}

export default Posts;
