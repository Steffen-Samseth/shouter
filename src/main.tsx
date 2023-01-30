import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./index.css";
import Posts from "./pages/posts";
import Profiles from "./pages/profiles";
import Login from "./pages/login";
import Register from "./pages/register";
import SinglePost from "./pages/single_post";
import SingleProfile from "./pages/single_profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/posts" />,
  },
  {
    path: "/posts",
    element: <Posts />,
  },
  {
    path: "/profiles",
    element: <Profiles />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/posts/:id",
    element: <SinglePost />,
  },
  {
    path: "/profiles/:id",
    element: <SingleProfile />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
