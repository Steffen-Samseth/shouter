import { FunctionComponent, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

const Layout: FunctionComponent<Props> = ({ children }) => {
  return (
    <div className="container flex justify-evenly">
      {/* Left column */}
      <div className="flex w-1/5 flex-col items-center pt-12">
        <div className="mb-10">
          <img src="../../public/img/logo.svg" />
        </div>
        <nav className="flex flex-col gap-3 text-white">
          <Link
            to="/"
            className="flex h-8 w-36 items-center justify-center rounded bg-blue-800"
          >
            Feed
          </Link>
          <Link
            to="/"
            className="flex h-8 w-36 items-center justify-center rounded bg-blue-800"
          >
            My profile
          </Link>
          <Link
            to="/profiles"
            className="flex h-8 w-36 items-center justify-center rounded bg-blue-800"
          >
            View all profile
          </Link>
          <Link
            to="/"
            className="flex h-8 w-36 items-center justify-center rounded bg-blue-800"
          >
            About us
          </Link>
        </nav>
      </div>

      {/* Middle column */}
      <div className="min-h-screen w-3/5">{children}</div>

      {/* Right column */}
      <div className="w-1/5 pt-5 pl-5">
        <div className="flex flex-row">
          <div className="aspect-square h-6 w-6 overflow-hidden rounded-full">
            <img
              className="h-full w-full object-cover object-center"
              src="../../public/img/default-profile-picture.png"
            />
          </div>
          <div className="ml-2 flex flex-col text-xs text-white">
            <div>Student name local storage</div>
            <div>Log out</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
