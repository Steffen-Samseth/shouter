import { FunctionComponent, useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../api";
import LoadingSpinner from "../components/icons/LoadingSpinner";
import Layout from "../components/Layout";

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useMutation(
    async () => {
      if (!(await signIn(email, password))) throw "Login failed";
    },
    {
      onSuccess: () => navigate("/"),
      onError: () => alert("Login failed, abandon ship!"),
    }
  );

  return (
    <Layout title="Sign in">
      <div className="h-full">
        <div className="mb-1 flex flex-row p-6">
          <h1 className="font-bold text-white">Sign in</h1>
        </div>
        <div className="flex flex-col items-center pt-4">
          <form className="flex w-1/2 flex-col gap-6 text-zinc-200">
            <label className="hidden">Email</label>
            <input
              disabled={loginMutation.isLoading}
              className="text-input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              autoComplete="username"
            />
            <label className="hidden">Password</label>
            <input
              disabled={loginMutation.isLoading}
              className="text-input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
            />
            <div className="flex items-center pl-4">
              <input
                disabled={loginMutation.isLoading}
                className="h-4 w-4 fill-blue-800"
                onChange={(e) => setRememberMe(e.target.checked)}
                checked={rememberMe}
                type="checkbox"
                id="remember-me"
              />
              <label className="ml-2" htmlFor="remember-me">
                Remember me
              </label>
            </div>
            <button
              disabled={loginMutation.isLoading}
              className="button mb-6 h-10 w-full"
              onClick={(e) => {
                e.preventDefault();
                loginMutation.mutate();
              }}
              type="submit"
            >
              {loginMutation.isLoading ? <LoadingSpinner className="w-4" /> : "Sign in"}
            </button>
          </form>
          <div className="mb-6 text-zinc-400">
            Don't have an account?
            <Link className="ml-4 text-blue-500" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
