import { FunctionComponent, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchPosts } from "../api";
import Bullhorn from "../components/icons/Bullhorn";
import Comment from "../components/icons/Comment";

const Posts: FunctionComponent = () => {
  const query = useQuery("posts", fetchPosts);

  if (query.isLoading) return <div>Loading...</div>;

  if (query.isError) return <div>{`Oh fuck, an error: ${query.error}`}</div>;

  return (
    <div className="flex justify-evenly container">
      {/* Left column */}
      <div className="w-1/5">Shouter</div>

      {/* Middle column */}
      <div className="w-3/5 bg-zinc-900 h-screen">
        <div className="px-6 py-8">
          <div className="px-8 h-10 bg-blue-800 text-white flex items-center rounded-full">
            <Bullhorn className="h-4 pr-8" />
            <input
              type="text"
              value="SHOUT your feelings"
              className="font-bold bg-transparent"
            />
          </div>
        </div>
        <div className="h-1 bg-neutral-800"></div>

        {query.data.map((post) => (
          <div className="grid grid-cols-[100px_1fr_1fr] grid-rows-[auto_auto_auto] mb-8">
            <div className="row-span-3 bg-gray-400">
              <img className="rounded-full" src={post.author.avatar} />
            </div>
            <div className="col-span-2 bg-blue-400">{post.author.name}</div>
            <div className="col-span-2 flex bg-red-400">
              <div>
                <h2 className="font-bold">{post.title}</h2>
                {post.body}
              </div>
              <div>
                <img src={post.media} />
              </div>
            </div>
            <div className="bg-orange-400 flex items-center">
              <Comment className="h-4 mr-2" />
              {post._count.comments}
            </div>
            <div className="bg-violet-400">
              {post.reactions.map((reaction) => (
                <span className="mr-2">{`${reaction.symbol}${reaction.count}`}</span>
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
