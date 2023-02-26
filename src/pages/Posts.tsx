import { FunctionComponent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchPosts, createPost, Post as PostType, getLoginInfo, Profile } from "../api";
import Post from "../components/Post";
import Bullhorn from "../components/icons/Bullhorn";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/icons/LoadingSpinner";

function createPostStub(title: string, body: string, media: string): PostType {
  const loginInfo = getLoginInfo()!;

  return {
    id: 0,
    title,
    body,
    tags: [],
    media,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    author: {
      name: loginInfo.name,
      email: loginInfo.email,
      avatar: loginInfo.avatar,
    },
    reactions: [],
    comments: [],
    _count: {
      comments: 0,
      reactions: 0,
    },
  };
}

const Posts: FunctionComponent = () => {
  const [newShoutDialogOpen, setNewShoutDialogOpen] = useState(false);
  const [newShoutTitle, setNewShoutTitle] = useState("");
  const [newShoutBody, setNewShoutBody] = useState("");
  const [newShoutMedia, setNewShoutMedia] = useState("");

  const queryClient = useQueryClient();
  const query = useQuery("posts", fetchPosts);

  const createPostMutation = useMutation(
    async () => {
      const success = await createPost(newShoutTitle, newShoutBody, newShoutMedia);

      if (!success) throw "Failed to create post!";
    },
    {
      onMutate: () => {
        const loginInfo = getLoginInfo()!;

        const context = {
          postsQuery: queryClient.getQueryData<PostType[]>("posts"),
          profileQuery: queryClient.getQueryData<[Profile, PostType[]]>(
            `profile-${loginInfo.name}`
          ),
        };

        if (context.postsQuery) {
          queryClient.setQueryData<PostType[]>("posts", (posts) => {
            const newPosts: PostType[] = structuredClone(posts!);
            newPosts.unshift(createPostStub(newShoutTitle, newShoutBody, newShoutMedia));

            return newPosts;
          });
        }

        if (context.profileQuery) {
          queryClient.setQueryData<[Profile, PostType[]]>(
            `profile-${loginInfo.name}`,
            (profileAndPosts) => {
              const [profile, posts] = profileAndPosts!;

              const newPosts: PostType[] = structuredClone(posts!);
              newPosts.unshift(
                createPostStub(newShoutTitle, newShoutBody, newShoutMedia)
              );

              return [profile, newPosts];
            }
          );
        }

        return context;
      },
      onSuccess: () => {
        queryClient.refetchQueries("posts");
        queryClient.refetchQueries(`profile-${getLoginInfo()!.name}`);
      },
      onError: (e, _, context) => {
        console.error("Failed to create post:", e);

        alert("Failed to create post!");

        if (!context) return;

        if (context.postsQuery) {
          queryClient.setQueryData<PostType[]>("posts", (_) => {
            return context.postsQuery!;
          });
        }

        const loginInfo = getLoginInfo()!;

        if (context.profileQuery) {
          queryClient.setQueryData<[Profile, PostType[]]>(
            `profile-${loginInfo.name}`,
            (_) => {
              return context.profileQuery!;
            }
          );
        }
      },
    }
  );

  if (query.isError) return <div>{`Oh fuck, an error: ${query.error}`}</div>;

  return (
    <Layout>
      <div className="mb-1 px-6 py-8">
        <div
          className="flex h-10 items-center rounded bg-blue-800 px-8 text-white hover:brightness-105"
          role="button"
          tabIndex={0}
          onClick={() => setNewShoutDialogOpen(true)}
        >
          <Bullhorn className="h-4 fill-white pr-8" />
          <div className="font-bold">SHOUT your feelings</div>
        </div>
      </div>

      {query.isLoading && <LoadingSpinner className="mx-auto my-24 w-24" />}

      {query.isSuccess && query.data!.map((post) => <Post post={post} key={post.id} />)}

      {newShoutDialogOpen && (
        <div
          id="new-shout-dialog-backdrop"
          onMouseDown={(e) => {
            if ((e.target as HTMLDivElement).id == "new-shout-dialog-backdrop")
              setNewShoutDialogOpen(false);
          }}
          className="fixed inset-0 flex items-center justify-center bg-gray-500/50 backdrop-blur"
        >
          <div className="relative flex flex-col justify-center gap-2 rounded bg-black p-10 text-white">
            <form
              className="flex w-96 flex-col gap-6 text-zinc-200"
              onSubmit={(e) => {
                e.preventDefault();
                setNewShoutDialogOpen(false);
                createPostMutation.mutate();
              }}
            >
              <label>
                <span className="font-bold">Title</span>
                <input
                  className="text-input mt-1 w-full"
                  type="text"
                  placeholder="Title"
                  value={newShoutTitle}
                  onChange={(e) => setNewShoutTitle(e.target.value)}
                />
              </label>
              <label>
                <span className="font-bold">Content</span>
                <textarea
                  className="text-input mt-1 max-h-[300px] min-h-[75px] w-full"
                  autoComplete="current-password"
                  rows={7}
                  value={newShoutBody}
                  onChange={(e) => setNewShoutBody(e.target.value)}
                />
              </label>
              <label>
                <span className="font-bold">Media</span>
                <input
                  className="text-input mt-1 w-full"
                  type="text"
                  placeholder="Media"
                  value={newShoutMedia || ""}
                  onChange={(e) => setNewShoutMedia(e.target.value)}
                />
              </label>

              <div className="mt-6 flex flex-col gap-4">
                <button type="submit" className="button w-full p-10 font-bold">
                  SHOUT!
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Posts;
