import React, { ReactElement, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
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
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  // Always scroll to top of page when switching pages
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const authenticated = getLoginInfo() !== null;
  return authenticated ? children : <Navigate to="/login" replace />;
};

// Wrapper for a route that can only be visited when not logged in, such as the
// login- and register pages.
const UnauthenticatedRoute = ({ children }: { children: ReactElement }) => {
  // Always scroll to top of page when switching pages
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const authenticated = getLoginInfo() !== null;
  return authenticated ? <Navigate to="/" replace /> : children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/posts" replace />,
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
    element: (
      <UnauthenticatedRoute>
        <Login />
      </UnauthenticatedRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <UnauthenticatedRoute>
        <Register />
      </UnauthenticatedRoute>
    ),
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
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
