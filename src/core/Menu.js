import React from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";

const isActive = (path) => {
  return window.location.pathname === path ? { color: "#ff9900" } : { color: "#ffffff" };
};

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div>
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link className="nav-link" style={isActive("/")} to="/">
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" style={isActive("/users")} to="/users">
            Users
          </Link>
        </li>

        {!isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link className="nav-link" style={isActive("/signin")} to="/signin">
                Sign In
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" style={isActive("/signup")} to="/signup">
                Signup
              </Link>
            </li>
          </>
        )}

        {isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                to={`/user/${isAuthenticated().user._id}`}
                style={isActive(`/user/${isAuthenticated().user._id}`)}
                className="nav-link"
              >
                {`${isAuthenticated().user.name}'s profile`}
              </Link>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={{ cursor: "pointer", color: "#fff" }}
                onClick={() => signout(() => navigate("/signin"))}
              >
                Sign Out
              </a>
            </li>
          </>
        )}
      </ul>

      {/* Outlet para mostrar las rutas anidadas */}
      <Outlet />
    </div>
  );
};

export default Menu;
