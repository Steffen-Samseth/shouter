import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout";

const Login: FunctionComponent = () => {
  return (
    <Layout>
      <div className="h-full">
        <div className="mb-1 flex flex-row bg-zinc-900 p-6">
          <h1 className="font-bold text-white">Sign in</h1>
        </div>
        <div className="flex flex-col items-center bg-zinc-900 pt-4">
          <form className="w-1/2 text-zinc-400">
            <label className="hidden">Email</label>
            <input
              className="mt-4 w-full rounded border border-zinc-400 bg-zinc-900 py-2 px-4"
              type="email"
              name="Email"
              placeholder="Email"
            />
            <label className="hidden">Password</label>
            <input
              className="mt-6 w-full rounded border border-zinc-400 bg-zinc-900 py-2 px-4"
              type="password"
              placeholder="Password"
              name="Password"
            />
            <div className="mt-6 flex items-center pl-4">
              <input
                className="h-4 w-4 fill-blue-800"
                type="checkbox"
                value="lsRememberMe"
              />
              <label className="ml-2" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <input
              className="mt-6 mb-6 w-full cursor-pointer rounded bg-blue-800 py-2 text-white"
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
