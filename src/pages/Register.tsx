import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Register: FunctionComponent = () => {
  return (
    <Layout title="Register">
      <div className="h-full">
        <div className="mb-1 flex flex-row p-6">
          <h1 className="font-bold text-white">Register</h1>
        </div>
        <div className="flex flex-col items-center pt-4">
          <form className="w-1/2 text-zinc-400">
            <label className="hidden">Username</label>
            <input
              className="mt-4 w-full rounded border border-zinc-400 bg-zinc-900 py-2 px-4"
              type="name"
              autoComplete="name"
              placeholder="Username"
              name="name"
            />
            <label className="hidden">Email</label>
            <input
              className="mt-4 w-full rounded border border-zinc-400 bg-zinc-900 py-2 px-4"
              type="email"
              autoComplete="username"
              placeholder="Email"
              name="email"
            />
            <label className="hidden">Password</label>
            <input
              className="mt-6 w-full rounded border border-zinc-400 bg-zinc-900 py-2 px-4"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              name="password"
            />
            <label className="hidden">Avatar URL (Optional)</label>
            <input
              className="mt-6 w-full rounded border border-zinc-400 bg-zinc-900 py-2 px-4"
              type="text"
              placeholder="Avatar URL (Optional)"
              name="avatar-url"
            />
            <label className="hidden">Banner URL (Optional)</label>
            <input
              className="mt-6 w-full rounded border border-zinc-400 bg-zinc-900 py-2 px-4"
              type="text"
              placeholder="Banner URL (Optional)"
              name="banner-url"
            />
            <input
              className="mt-6 mb-6 w-full cursor-pointer rounded bg-blue-800 py-2 text-white"
              type="submit"
              value="Register"
            />
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
