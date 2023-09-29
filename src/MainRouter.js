import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Users from "./user/Users";
import Profile from "./user/Profile";
import EditProfile from "./user/EditProfile";
import PrivateRoute from "./auth/PrivateRoute"; // Importa PrivateRouteWrapper
import Admin from "./admin/Admin";
import FindPeople from "./user/FindPeople";
import NewPost from "./post/NewPost";
import EditPost from "./post/EditPost";
import SinglePost from "./post/SinglePost";
//import ForgotPassword from "./user/ForgotPassword";
//import ResetPassword from "./user/ResetPassword";

const MainRouter = () => (
  <div>
    <Menu />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/users" element={<Users />} />

      
      <Route path="/post/:postId" element={<SinglePost />} />

      
      <Route path="/user/:userId" element={<PrivateRoute><Profile /></PrivateRoute>}/>
      <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>}/>

      <Route path="/post/create" element={<PrivateRoute><NewPost /></PrivateRoute>}/>
      

      <Route path="/user/edit/:userId" element={ <PrivateRoute> <EditProfile /> </PrivateRoute>}/>
      <Route path="/findpeople" element={<PrivateRoute> <FindPeople /> </PrivateRoute>}/>
      <Route path="/post/edit/:postId" element={<PrivateRoute> < EditPost /> </PrivateRoute>}/>

    </Routes>
  </div>
);

export default MainRouter;  
