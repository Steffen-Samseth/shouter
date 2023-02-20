import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { fetchPostsByProfile, fetchSingleProfile } from "../api";
import ArrowLeft from "../components/icons/ArrowLeft";
import Heart from "../components/icons/Heart";
import Layout from "../components/Layout";
import Post from "../components/Post";

const SingleProfile: FunctionComponent = () => {
  const { name: profileName } = useParams();
  const query = useQuery(`profile-${profileName}`, async () => {
    const profile = await fetchSingleProfile(profileName!);
    const posts = await fetchPostsByProfile(profileName!);
    return [profile, posts] as const;
  });

  if (query.isLoading) return <div className="text-white">Loading...</div>;

  if (query.isError)
    return (
      <div className="text-white">{`An error has occured ${query.error}`}</div>
    );

  const [profile, posts] = query.data!;

  if (profile == null || posts == null)
    return <div className="text-white">Error 404</div>;

  const showNumFollowers = 5;
  const totalNumFollowers = profile.followers.length;
  const excessFollowers = totalNumFollowers - showNumFollowers;

  if (!query.data) {
    return (
      <Layout>
        <div className="mb-1 flex flex-row p-6">
          <Link to="/">
            <ArrowLeft className="h-6 fill-white pr-8" />
          </Link>
          <h1 className="font-bold text-white">404 profile not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={profile.name}>
      <div className="flex flex-row border-b-4 border-zinc-800 p-6">
        <Link to="/">
          <ArrowLeft className="h-6 fill-white pr-8" />
        </Link>
        <h1 className="font-bold text-white">{profile.name}</h1>
      </div>
      <div className="h-52">
        <img
          className="h-full w-full object-cover object-center"
          src={profile.banner || "../../public/img/default-profile-picture.png"}
          onError={(e) =>
            (e.currentTarget.src =
              "../../public/img/default-profile-picture.png")
          }
        />
      </div>
      <div className="mb-6 px-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="-mt-16 aspect-square w-32 overflow-hidden rounded-full">
            <img
              className="h-full w-full object-cover object-center"
              src={
                profile.avatar || "../../public/img/default-profile-picture.png"
              }
              onError={(e) =>
                (e.currentTarget.src =
                  "../../public/img/default-profile-picture.png")
              }
            />
          </div>
          <div className="pt-4 text-right">
            <button className="inline-flex items-center gap-2 text-zinc-400">
              <Heart className="w-4 fill-zinc-400" />
              Follow
            </button>
            <div className="text-zinc-400">
              {profile._count.followers} Followers
            </div>
          </div>
        </div>
        <div>
          <h2 className="mb-6 text-xl font-bold text-white">{profile.name}</h2>
          <div className="flex items-center text-xs text-white">
            <div className="mr-4">Followers:</div>
            {profile.followers.slice(0, showNumFollowers).map((follower) => (
              <Link to={`/profiles/${follower.name}`} key={follower.name}>
                <div
                  title={follower.name}
                  className="-ml-2 aspect-square w-6 overflow-hidden rounded-full"
                >
                  <img
                    className="h-full w-full object-cover object-center"
                    src={follower.avatar}
                    onError={(e) =>
                      (e.currentTarget.src =
                        "../../public/img/default-profile-picture.png")
                    }
                  />
                </div>
              </Link>
            ))}
            {excessFollowers > 0 && (
              <div className="ml-2">+{excessFollowers} more</div>
            )}
          </div>
        </div>
      </div>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </Layout>
  );
};

export default SingleProfile;
