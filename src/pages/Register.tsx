import { FunctionComponent, useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import LoadingSpinner from "../components/icons/LoadingSpinner";
import Layout from "../components/Layout";

const Register: FunctionComponent = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const navigate = useNavigate();

  const registerMutation = useMutation(
    async () => {
      return await registerUser(
        username,
        email,
        password,
        avatarUrl,
        bannerUrl
      );
    },
    {
      onSuccess: (data) => {
        // If the result is a string, it's an error
        if (typeof data == "string") {
          alert(data);
        }
        // Otherwise the registration succeeded
        else {
          alert("Registration succeeded! Please log in with your new account.");
          navigate("/login");
        }
      },
      onError: () =>
        alert("Unexpected error happened during registration! Send help"),
    }
  );

  return (
    <Layout title="Register">
      <div className="h-full">
        <div className="mb-1 flex flex-row p-6">
          <h1 className="font-bold text-white">Register</h1>
        </div>
        <div className="flex flex-col items-center pt-4">
          <form className="flex w-1/2 flex-col gap-6 text-zinc-200">
            <label className="hidden">Username</label>
            <input
              disabled={registerMutation.isLoading}
              className="text-input w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="name"
              autoComplete="username"
              placeholder="Username"
            />
            <label className="hidden">Email</label>
            <input
              disabled={registerMutation.isLoading}
              className="text-input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="Email"
            />
            <label className="hidden">Password</label>
            <input
              disabled={registerMutation.isLoading}
              className="text-input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              placeholder="Password"
            />
            <label className="hidden">Avatar URL (Optional)</label>
            <input
              disabled={registerMutation.isLoading}
              className="text-input w-full"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              type="text"
              placeholder="Avatar URL (Optional)"
            />
            <label className="hidden">Banner URL (Optional)</label>
            <input
              disabled={registerMutation.isLoading}
              className="text-input w-full"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              type="text"
              placeholder="Banner URL (Optional)"
            />
            <button
              disabled={registerMutation.isLoading}
              className="button mb-6 h-10 w-full"
              onClick={(e) => {
                e.preventDefault();
                registerMutation.mutate();
              }}
              type="submit"
            >
              {registerMutation.isLoading ? (
                <LoadingSpinner className="w-4" />
              ) : (
                "Register"
              )}
            </button>
          </form>
          <div className="mb-6 text-zinc-400">
            Already have an account?
            <Link className="ml-4 text-blue-500" to="/login">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
