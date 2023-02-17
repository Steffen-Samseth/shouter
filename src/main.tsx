import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./index.css";
import Posts from "./pages/Posts";
import Profiles from "./pages/Profiles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";
import SingleProfile from "./pages/SingleProfile";
import { QueryClient, QueryClientProvider } from "react-query";
import Error404 from "./pages/Error404";
import { getLoginInfo } from "./api";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const loginInfo = getLoginInfo();
  return loginInfo ? children : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/posts" />,
  },
  {
    path: "/posts",
    element: (
      <PrivateRoute>
        <Posts />
      </PrivateRoute>
    ),
  },
  {
    path: "/profiles",
    element: (
      <PrivateRoute>
        <Profiles />
      </PrivateRoute>
    ),
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
    element: (
      <PrivateRoute>
        <SinglePost />
      </PrivateRoute>
    ),
  },
  {
    path: "/profiles/:name",
    element: (
      <PrivateRoute>
        <SingleProfile />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
