import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { fetchSinglePost } from "../api";
import TimeAgo from "timeago-react";
import ArrowLeft from "../components/icons/ArrowLeft";
import Layout from "../components/Layout";
import Reply from "../components/icons/Reply";
import Post from "../components/Post";

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

  const post = query.data!;

  return (
    <Layout>
      <div className="mb-1 flex flex-row p-6">
        <Link to="/">
          <ArrowLeft className="h-6 fill-white pr-8" />
        </Link>
        <h1 className="font-bold text-white">Shout</h1>
      </div>
      <Post post={post} clickable={false} />
      <div className="mb-4 p-4 text-white">Comments</div>
      {post.comments.map((comment) => (
        <div className="mb-6 pl-4" key={post.id}>
          <div className="flex items-center">
            <Link to={`/profiles/${comment.author.name}`}>
              <div className="aspect-square w-8 overflow-hidden rounded-full">
                <img
                  className="h-full w-full object-cover object-center"
                  src={
                    comment.author.avatar ||
                    "../../public/img/default-profile-picture.png"
                  }
                />
              </div>
            </Link>

            <Link
              to={`/profiles/${comment.author.name}`}
              className="ml-4 font-bold text-white"
            >
              {comment.author.name}
            </Link>
            <Reply className="ml-4 h-4 fill-white"></Reply>
            <span className="ml-1 text-white">
              <TimeAgo datetime={comment.created} />
            </span>
          </div>
          <div className="mt-2 text-white">{comment.body}</div>
        </div>
      ))}
    </Layout>
  );
};

export default SinglePost;
