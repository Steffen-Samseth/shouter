import { FunctionComponent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import {
  editAvatarUrl,
  editBannerUrl,
  fetchPostsByProfile,
  fetchSingleProfile,
  followProfile,
  getLoginInfo,
  Post as PostType,
  Profile,
  unfollowProfile,
} from "../api";
import ArrowLeft from "../components/icons/ArrowLeft";
import Heart from "../components/icons/Heart";
import HeartCrack from "../components/icons/HeartCrack";
import LoadingSpinner from "../components/icons/LoadingSpinner";
import Layout from "../components/Layout";
import Post from "../components/Post";

const SingleProfile: FunctionComponent = () => {
  const queryClient = useQueryClient();
  const [bannerPopupIsOpen, setBannerPopupIsOpen] = useState(false);
  const [newBannerUrl, setNewBannerUrl] = useState("");
  const [avatarPopupIsOpen, setAvatarPopupIsOpen] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const { name: profileName } = useParams();
  const query = useQuery(
    `profile-${profileName}`,
    async () => {
      const profile = await fetchSingleProfile(profileName!);
      const posts = await fetchPostsByProfile(profileName!);
      return [profile, posts] as const;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const followMutation = useMutation({
    mutationFn: () => {
      return followProfile(profileName!);
    },
    onMutate: () => {
      queryClient.setQueryData<[Profile, PostType[]]>(
        `profile-${profileName}`,
        (profileAndPosts) => {
          const [profile, posts] = profileAndPosts!;

          const newProfile: Profile = structuredClone(profile);
          newProfile.followers.push({
            name: getLoginInfo()!.name,
            avatar: getLoginInfo()!.avatar,
          });
          newProfile._count.followers += 1;

          return [newProfile, posts];
        }
      );
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => {
      return unfollowProfile(profileName!);
    },
    onMutate: () => {
      queryClient.setQueryData<[Profile, PostType[]]>(
        `profile-${profileName}`,
        (profileAndPosts) => {
          const [profile, posts] = profileAndPosts!;

          const newProfile: Profile = structuredClone(profile);
          newProfile.followers = newProfile.followers.filter(
            (follower) => follower.name != getLoginInfo()!.name
          );
          newProfile._count.followers -= 1;

          return [newProfile, posts];
        }
      );
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: () => {
      return editBannerUrl(profileName!, newBannerUrl);
    },
    onSuccess: () => {
      query.refetch();
      setBannerPopupIsOpen(false);
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: () => {
      return editAvatarUrl(profileName!, newAvatarUrl);
    },
    onSuccess: () => {
      query.refetch();
      setAvatarPopupIsOpen(false);
    },
  });

  if (query.isError)
    return <div className="text-white">{`An error has occured ${query.error}`}</div>;

  const [profile, posts] = query.data ? query.data : [null, null];

  const showNumFollowers = 5;

  const getExcessFollowers = (profile: Profile) =>
    profile.followers.length - showNumFollowers;

  const pageName = () => {
    if (query.isLoading) return "Shouter";

    if (query.isSuccess && query.data[0]) return query.data[0].name;

    return "404 Profile Not Found";
  };

  return (
    <Layout title={pageName()}>
      <div className="flex flex-row border-b-4 border-zinc-800 p-6">
        <Link to="/">
          <ArrowLeft className="h-6 fill-white pr-8" />
        </Link>
        <h1 className="font-bold text-white">{profileName}</h1>
      </div>

      {query.isLoading && <LoadingSpinner className="my-24 mx-auto w-24" />}

      {query.isSuccess && !profile && !posts && (
        <div className="my-24 text-center text-3xl font-bold text-white/80">
          This profile does not exist
        </div>
      )}

      {query.isSuccess && profile && posts && (
        <>
          <div className="h-52">
            <img
              className="h-full w-full object-cover object-center"
              src={profile.banner || "../../public/img/default-profile-picture.png"}
              onError={(e) =>
                (e.currentTarget.src = "../../public/img/default-profile-picture.png")
              }
            />
          </div>
          <div className="mb-6 px-6">
            <div className="mb-6 flex items-start justify-between">
              <div className="-mt-16 aspect-square w-32 overflow-hidden rounded-full">
                <img
                  className="h-full w-full object-cover object-center"
                  src={profile.avatar || "../../public/img/default-profile-picture.png"}
                  onError={(e) =>
                    (e.currentTarget.src = "../../public/img/default-profile-picture.png")
                  }
                />
              </div>
              <div className="flex flex-col gap-2 pt-4 text-right">
                {getLoginInfo()!.name == profile.name ? (
                  <>
                    <button onClick={() => setBannerPopupIsOpen(true)} className="button">
                      Edit banner
                    </button>
                    <button onClick={() => setAvatarPopupIsOpen(true)} className="button">
                      Edit avatar
                    </button>
                  </>
                ) : (
                  <>
                    {profile.followers.some(
                      (follower) => follower.name == getLoginInfo()!.name
                    ) ? (
                      <button
                        className="inline-flex items-center gap-2 text-zinc-400"
                        onClick={() => unfollowMutation.mutate()}
                      >
                        <HeartCrack className="w-4 fill-zinc-400" />
                        Unfollow
                      </button>
                    ) : (
                      <button
                        className="inline-flex items-center gap-2 text-zinc-400"
                        onClick={() => followMutation.mutate()}
                      >
                        <Heart className="w-4 fill-zinc-400" />
                        Follow
                      </button>
                    )}
                    <div className="text-zinc-400">
                      {profile._count.followers} Followers
                    </div>
                  </>
                )}
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
                        src={
                          follower.avatar ||
                          "../../public/img/default-profile-picture.png"
                        }
                        onError={(e) =>
                          (e.currentTarget.src =
                            "../../public/img/default-profile-picture.png")
                        }
                      />
                    </div>
                  </Link>
                ))}
                {getExcessFollowers(profile) > 0 && (
                  <div className="ml-2">+{getExcessFollowers(profile)} more</div>
                )}
              </div>
            </div>
          </div>
          {posts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </>
      )}

      {bannerPopupIsOpen && (
        <div
          id="banner-popup-backdrop"
          onClick={(e) => {
            if ((e.target as HTMLDivElement).id == "banner-popup-backdrop")
              setBannerPopupIsOpen(false);
          }}
          className="fixed inset-0 flex items-center justify-center bg-gray-500/50 backdrop-blur"
        >
          <div className="flex flex-col justify-center gap-2 rounded bg-black p-20 text-white">
            {updateBannerMutation.isLoading ? (
              <LoadingSpinner className="w-24" />
            ) : (
              <>
                <label>New url for banner image</label>
                <input
                  value={newBannerUrl}
                  className="p-1 text-black"
                  onChange={(e) => setNewBannerUrl(e.target.value)}
                />
                <button
                  className="button"
                  onClick={() => {
                    updateBannerMutation.mutate();
                  }}
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {avatarPopupIsOpen && (
        <div
          id="avatar-popup-backdrop"
          onClick={(e) => {
            if ((e.target as HTMLDivElement).id == "avatar-popup-backdrop")
              setAvatarPopupIsOpen(false);
          }}
          className="fixed inset-0 flex items-center justify-center bg-gray-500/50 backdrop-blur"
        >
          <div className="flex flex-col justify-center gap-2 rounded bg-black p-20 text-white">
            {updateAvatarMutation.isLoading ? (
              <LoadingSpinner className="w-24" />
            ) : (
              <>
                <label>New url for avatar image</label>
                <input
                  value={newAvatarUrl}
                  className="p-1 text-black"
                  onChange={(e) => setNewAvatarUrl(e.target.value)}
                />
                <button
                  className="button"
                  onClick={() => {
                    updateAvatarMutation.mutate();
                  }}
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SingleProfile;
