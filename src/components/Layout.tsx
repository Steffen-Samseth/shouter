import { FunctionComponent, ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { getLoginInfo, signOut } from "../api";

interface Props {
  children?: ReactNode;
  title?: string;
}

const Layout: FunctionComponent<Props> = ({ children, title = "Shouter" }) => {
  const navigate = useNavigate();

  const loginInfo = getLoginInfo();
  const isLoggedIn = loginInfo !== null;

  return (
    <>
      <Helmet>
        <link
          rel="icon"
          type="image/svg+xml"
          href="../../public/img/logo.svg"
        />
        <title>{title}</title>
      </Helmet>
      <div className="container flex justify-evenly">
        {/* Left column */}
        <div className="flex w-1/5 flex-col items-center pt-12">
          <div className="mb-10">
            <img src="../../public/img/logo.svg" />
          </div>
          {isLoggedIn && (
            <nav className="flex flex-col gap-3 text-white">
              <Link to="/" className="button">
                Feed
              </Link>
              <Link to={`/profiles/${loginInfo.name}`} className="button">
                My profile
              </Link>
              <Link to="/profiles" className="button">
                View all profiles
              </Link>
            </nav>
          )}
        </div>

        {/* Middle column */}
        <div className="min-h-screen w-3/5 bg-zinc-900">{children}</div>

        {/* Right column */}
        <div className="w-1/5 pt-5 pl-5">
          {isLoggedIn && (
            <div className="flex flex-row">
              <div className="aspect-square h-10 w-10 overflow-hidden rounded-full">
                <Link to={`/profiles/${loginInfo.name}`}>
                  <img
                    className="h-full w-full object-cover object-center"
                    src={
                      loginInfo.avatar ||
                      "../../public/img/default-profile-picture.png"
                    }
                  />
                </Link>
              </div>
              <div className="ml-2 flex flex-col justify-between text-xs text-white">
                <Link to={`/profiles/${loginInfo.name}`}>
                  <div>{loginInfo.name}</div>
                </Link>
                <button
                  className="text-start"
                  onClick={() => {
                    signOut(), navigate("/login");
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Layout;
