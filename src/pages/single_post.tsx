import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { fetchSinglePost, Post } from "../api";
import TimeAgo from "timeago-react";
import ArrowLeft from "../components/icons/ArrowLeft";
import Comment from "../components/icons/Comment";
import Layout from "../components/layout";
import Reply from "../components/icons/Reply";

const SinglePost: FunctionComponent = () => {
  const { id: postId } = useParams();
  const query = useQuery(`post-${postId}`, async () => {
    return await fetchSinglePost(Number(postId));
  });

  if (query.isLoading) return <div className="text-white">Loading...</div>;

  if (query.isError)
    return (
      <div className="text-white">{`An error has occured ${query.error}`}</div>
    );

  const profilePicture = (post: Post) =>
    post.author.avatar || "../../public/img/default-profile-picture.png";

  const post = query.data!;

  return (
    <Layout>
      <div className="mb-1 flex flex-row p-6">
        <Link to="/">
          <ArrowLeft className="h-6 fill-white pr-8" />
        </Link>
        <h1 className="font-bold text-white">Shout</h1>
      </div>
      <div className="grid grid-cols-[100px_minmax(0,1fr)_minmax(0,1fr)] grid-rows-[auto_auto_auto] border-b-4 border-t-4 border-zinc-800">
        <div className="row-span-2 overflow-hidden p-5">
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
        <div className="col-span-3 flex flex-row justify-between px-5">
          <div className="flex items-center text-xs text-white">
            <Comment className="mr-2 h-4 fill-zinc-400" />
            {post._count.comments}
          </div>
          <div className="flex h-12 flex-row-reverse items-center gap-2 text-xs">
            {post.reactions.map((reaction) => (
              <span className="text-white">{`${reaction.symbol}${reaction.count}`}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-4 p-4 text-white">Comments</div>
      {post.comments.map((comment) => (
        <div className="mb-6 pl-4">
          <div className="flex items-center">
            <div className="aspect-square w-8 overflow-hidden rounded-full">
              <img
                className="h-full w-full object-cover object-center"
                src={profilePicture(post)}
              />
            </div>
            <div className="ml-4 font-bold text-white">
              {comment.author.name}
            </div>
            <Reply className="ml-4 h-4 fill-white"></Reply>
            <span className="ml-1 text-white">
              <TimeAgo datetime={post.created} />
            </span>
          </div>
          <div className="mt-2 text-white">{comment.body}</div>
        </div>
      ))}
    </Layout>
  );
};

export default SinglePost;
