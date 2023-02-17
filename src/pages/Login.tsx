import { FunctionComponent, useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../api";
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

  const submitForm = () => {
    loginMutation.mutate();
  };

  return (
    <Layout>
      <div className="h-full">
        <div className="mb-1 flex flex-row p-6">
          <h1 className="font-bold text-white">Sign in</h1>
        </div>
        <div className="flex flex-col items-center pt-4">
          <form className="w-1/2 text-zinc-400">
            <label className="hidden">Email</label>
            <input
              className="mt-4 w-full rounded border border-zinc-400 bg-zinc-900 py-2 px-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="Email"
              placeholder="Email"
              autoComplete="username"
            />
            <label className="hidden">Password</label>
            <input
              className="mt-6 w-full rounded border border-zinc-400 bg-zinc-900 py-2 px-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              name="Password"
            />
            <div className="mt-6 flex items-center pl-4">
              <input
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
            <input
              className="mt-6 mb-6 w-full cursor-pointer rounded bg-blue-800 py-2 text-white"
              onClick={async (e) => {
                e.preventDefault();
                await submitForm();
              }}
              type="submit"
              value="Sign in"
            />
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
