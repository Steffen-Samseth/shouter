import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { fetchProfiles, Profile } from "../api";
import ArrowLeft from "../components/icons/ArrowLeft";
import Heart from "../components/icons/Heart";
import Layout from "../components/Layout";

const Profiles: FunctionComponent = () => {
  const query = useQuery("profiles", fetchProfiles);

  if (query.isLoading) return <div>Loading...</div>;

  if (query.isError) return <div>{`Oh fuck, an error: ${query.error}`}</div>;

  const profilePicture = (profile: Profile) =>
    profile.avatar || "../../public/img/default-profile-picture.png";

  return (
    <Layout title="Shouters">
      <div className="mb-1 flex flex-row p-6">
        <Link to="/">
          <ArrowLeft className="h-6 fill-white pr-8" />
        </Link>
        <h1 className="font-bold text-white">Fellow shouters</h1>
      </div>
      <div className="grid grid-cols-2 border-t-4 border-zinc-800">
        {query.data!.map((profile) => (
          <div className="flex flex-row p-4" key={profile.name}>
            {/*Profile left column*/}
            <div className="flex flex-col items-center">
              <Link to={`/profiles/${profile.name}`}>
                <div className="aspect-square h-12 w-12 overflow-hidden rounded-full">
                  <img
                    className="h-full w-full object-cover object-center"
                    src={profilePicture(profile)}
                    onError={(e) =>
                      (e.currentTarget.src =
                        "../../public/img/default-profile-picture.png")
                    }
                  />
                </div>
              </Link>
              <button className="flex items-center p-2 text-xs text-blue-300">
                <Heart className="mr-1 h-3 fill-blue-300" />
                Follow
              </button>
            </div>
            {/*Profile right column*/}
            <div className="ml-4 flex max-w-full grow flex-col">
              <Link
                to={`/profiles/${profile.name}`}
                className="break-words font-bold text-white"
              >
                {profile.name}
              </Link>
              <div className="text-xs text-zinc-300">
                Followers: {profile._count.followers}
              </div>
              <div className="text-xs text-zinc-300">
                Following: {profile._count.following}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Profiles;
