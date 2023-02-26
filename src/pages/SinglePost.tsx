import { FunctionComponent, useState } from "react";
import { useIsMutating, useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createComment, fetchSinglePost, getLoginInfo, Post as PostType } from "../api";
import TimeAgo from "timeago-react";
import ArrowLeft from "../components/icons/ArrowLeft";
import Layout from "../components/Layout";
import Reply from "../components/icons/Reply";
import Post from "../components/Post";
import LoadingSpinner from "../components/icons/LoadingSpinner";
import Plus from "../components/icons/Plus";

import defaultProfilePic from "../assets/default-profile-picture.png";

const SinglePost: FunctionComponent = () => {
  const [commentFormIsOpen, setCommentFormIsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { id: postId } = useParams();
  const query = useQuery(`post-${postId}`, async () => {
    return await fetchSinglePost(Number(postId));
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const postIsDeleting =
    useIsMutating({
      mutationKey: ["delete-post", Number(postId!)],
    }) > 0;

  const post = query.data;

  const pageTitle = () => {
    if (query.isLoading) return "Shouter";

    if (query.data) return query.data.title;

    return "404 Post Not Found";
  };

  const createCommentMutation = useMutation(
    async () => {
      if (post) {
        await createComment(post.id, commentText);
      }
    },
    {
      onMutate: () => {
        queryClient.setQueryData<PostType>(`post-${post!.id}`, (oldPost) => {
          const newPost: PostType = structuredClone(oldPost);
          newPost.comments.push({
            body: commentText,
            replyToId: null,
            id: 0,
            postId: post!.id,
            owner: getLoginInfo()!.name,
            created: new Date().toISOString(),
            author: {
              name: getLoginInfo()!.name,
              email: getLoginInfo()!.email,
              avatar: getLoginInfo()!.avatar,
              banner: getLoginInfo()!.avatar,
            },
          });
          return newPost;
        });
        return;
      },
    }
  );

  return (
    <Layout title={pageTitle()}>
      <div className="mb-1 flex flex-row p-6">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 fill-white pr-8" />
        </button>
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
          <div className="relative">
            <Post post={post} clickable={false} onDelete={() => navigate("/")} />

            {postIsDeleting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <LoadingSpinner className="w-24" />
              </div>
            )}
          </div>

          <div className="mb-4 flex flex-row items-center justify-between p-4 text-white">
            Comments
            <button
              onClick={() => {
                setCommentFormIsOpen(true);
              }}
            >
              <Plus className="h-4 fill-white"></Plus>
            </button>
          </div>
          {commentFormIsOpen && (
            <form className="flex w-full flex-col items-center gap-6 px-4 text-zinc-400">
              <label className="hidden">Comment text-area</label>
              <textarea
                className="text-input w-full"
                onChange={(e) => {
                  setCommentText(e.target.value);
                }}
                placeholder="Share your opinion"
              />
              <button
                className="button mb-6 h-10 w-1/3"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  createCommentMutation.mutate();
                  setCommentFormIsOpen(false);
                }}
              >
                Submit comment
              </button>
            </form>
          )}

          {post.comments.length == 0 && (
            <span className="p-4 text-white/50">(No comments yet)</span>
          )}

          {post.comments
            .slice()
            .reverse()
            .map((comment) => (
              <div className="mb-6 pl-4" key={comment.id}>
                <div className="flex items-center">
                  <Link to={`/profiles/${comment.author.name}`}>
                    <div className="aspect-square w-8 overflow-hidden rounded-full">
                      <img
                        className="h-full w-full object-cover object-center"
                        src={comment.author.avatar || defaultProfilePic}
                        onError={(e) => (e.currentTarget.src = defaultProfilePic)}
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
                <div className="mt-2 whitespace-pre-wrap text-white">{comment.body}</div>
              </div>
            ))}
        </>
      )}
    </Layout>
  );
};

export default SinglePost;
