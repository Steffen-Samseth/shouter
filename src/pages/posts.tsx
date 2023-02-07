import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import TimeAgo from "timeago-react";
import { fetchPosts, Post } from "../api";
import ArrowRight from "../components/icons/ArrowRight";
import Bullhorn from "../components/icons/Bullhorn";
import Comment from "../components/icons/Comment";
import Layout from "../components/layout";

const Posts: FunctionComponent = () => {
  const query = useQuery("posts", fetchPosts);

  if (query.isLoading) return <div>Loading...</div>;

  if (query.isError) return <div>{`Oh fuck, an error: ${query.error}`}</div>;

  const profilePicture = (post: Post) =>
    post.author.avatar || "../../public/img/default-profile-picture.png";

  return (
    <Layout>
      <div className="mb-1 px-6 py-8">
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
        <div className="grid grid-cols-[100px_minmax(0,1fr)_minmax(0,1fr)] grid-rows-[auto_auto_auto] border-t-4 border-zinc-800">
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
              <Link className="self-center" to={`/posts/${post.id}`}>
                {post.author.name}
              </Link>
            </span>
            <span className="self-center text-white">
              <TimeAgo datetime={post.created} />
            </span>
            <Link className="ml-auto self-center" to={`/posts/${post.id}`}>
              <ArrowRight className="mr-4 h-4 fill-white"></ArrowRight>
            </Link>
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
          <div className="flex items-center text-xs text-white">
            <Link
              className="flex flex-row self-center"
              to={`/posts/${post.id}`}
            >
              <Comment className="mr-2 h-4 fill-zinc-400" />
              {post._count.comments}
            </Link>
          </div>
          <div className="flex h-12 flex-row-reverse items-center gap-2 pr-2 text-xs">
            {post.reactions.map((reaction) => (
              <span className="text-white">{`${reaction.symbol}${reaction.count}`}</span>
            ))}
          </div>
        </div>
      ))}
    </Layout>
  );
};

export default Posts;
