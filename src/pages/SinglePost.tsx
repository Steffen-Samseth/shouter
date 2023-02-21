import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { fetchSinglePost } from "../api";
import TimeAgo from "timeago-react";
import ArrowLeft from "../components/icons/ArrowLeft";
import Layout from "../components/Layout";
import Reply from "../components/icons/Reply";
import Post from "../components/Post";
import LoadingSpinner from "../components/icons/LoadingSpinner";

const SinglePost: FunctionComponent = () => {
  const { id: postId } = useParams();
  const query = useQuery(`post-${postId}`, async () => {
    return await fetchSinglePost(Number(postId));
  });

  const post = query.data;

  const pageTitle = () => {
    if (query.isLoading) return "Shouter";

    if (query.data) return query.data.title;

    return "404 Post Not Found";
  };

  return (
    <Layout title={pageTitle()}>
      <div className="mb-1 flex flex-row p-6">
        <Link to="/">
          <ArrowLeft className="h-6 fill-white pr-8" />
        </Link>
        <h1 className="font-bold text-white">Shout</h1>
      </div>

      {query.isError && (
        <div className="text-white">{`An error has occured ${query.error}`}</div>
      )}

      {query.isSuccess && post === null && (
        <div className="my-24 text-center text-3xl font-bold text-white/80">
          This post does not exist
        </div>
      )}

      {query.isLoading && <LoadingSpinner className="my-24 mx-auto w-24" />}

      {query.isSuccess && post && (
        <>
          <Post post={post} clickable={false} />
          <div className="mb-4 p-4 text-white">Comments</div>

          {post.comments.length == 0 && (
            <span className="p-4 text-white/50">(No comments yet)</span>
          )}

          {post.comments.map((comment) => (
            <div className="mb-6 pl-4" key={comment.id}>
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
        </>
      )}
    </Layout>
  );
};

export default SinglePost;
