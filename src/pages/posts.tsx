import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import TimeAgo from "timeago-react";
import { fetchPosts } from "../api";
import Bullhorn from "../components/icons/Bullhorn";
import Comment from "../components/icons/Comment";

const Posts: FunctionComponent = () => {
  const query = useQuery("posts", fetchPosts);

  if (query.isLoading) return <div>Loading...</div>;

  if (query.isError) return <div>{`Oh fuck, an error: ${query.error}`}</div>;

  const profilePicture = (post) =>
    post.author.avatar || "../../public/img/shouter-avatar.png";

  return (
    <div className="container flex justify-evenly">
      {/* Left column */}
      <div className="w-1/5">Shouter</div>

      {/* Middle column */}
      <div className="min-h-screen w-3/5">
        <div className="mb-1 bg-zinc-900 px-6 py-8">
          <div className="flex h-10 items-center rounded-full bg-blue-800 px-8 text-white">
            <Bullhorn className="h-4 pr-8" />
            <input
              type="text"
              value="SHOUT your feelings"
              className="bg-transparent font-bold"
            />
          </div>
        </div>

        {query.data!.map((post) => (
          <div className="mb-1 grid grid-cols-[100px_minmax(0,1fr)_minmax(0,1fr)] grid-rows-[auto_auto_auto] bg-zinc-900">
            <div className="row-span-3 overflow-hidden p-5">
              <div className="aspect-square w-16 overflow-hidden rounded-full">
                <img
                  className="h-full w-full object-cover object-center"
                  src={profilePicture(post)}
                />
              </div>
            </div>
            <div className="col-span-2 flex h-12">
              <span className="mr-2 self-center font-bold text-white">
                {post.author.name}
              </span>
              <span className="self-center text-white">
                <TimeAgo datetime={post.created} />
              </span>
            </div>
            <div className="col-span-2 flex">
              <div className="max-w-full grow basis-px break-words text-white">
                <h2 className="font-bold text-white">{post.title}</h2>
                {post.body}
              </div>
              {post.media && (
                <div className="max-h-64 grow basis-px overflow-hidden">
                  <img
                    className="h-full w-full object-cover object-center"
                    src={post.media}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center text-white">
              <Comment className="mr-2 h-4 fill-zinc-400" />
              {post._count.comments}
            </div>
            <div className="flex h-12 flex-row-reverse items-center gap-2 pr-2">
              {post.reactions.map((reaction) => (
                <span className="text-white">{`${reaction.symbol}${reaction.count}`}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right column */}
      <div className="w-1/5">Login info</div>
    </div>
  );
};

export default Posts;
