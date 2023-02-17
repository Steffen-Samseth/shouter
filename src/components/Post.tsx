import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "timeago-react";
import ArrowRight from "./icons/ArrowRight";
import Comment from "./icons/Comment";
import { deletePost, Post as PostType } from "../api";
import Trash from "./icons/Trash";
import Pen from "./icons/Pen";
import { useMutation, useQueryClient } from "react-query";

interface Props {
  post: PostType;
  clickable?: boolean;
}
const Post: FunctionComponent<Props> = ({ post, clickable = true }) => {
  const queryClient = useQueryClient();
  const deletePostMutation = useMutation(
    async () => await deletePost(post.id),
    {
      mutationKey: "posts-delete",

      onMutate: () => {
        const originalPosts: PostType[] | undefined =
          queryClient.getQueryData("posts");

        queryClient.setQueryData("posts", (posts: PostType[] | undefined) => {
          return posts!.filter((x) => x.id != post.id);
        });

        return originalPosts;
      },

      onError: (_error, _variables, originalPosts: PostType[] | undefined) => {
        queryClient.setQueryData("posts", () => {
          return originalPosts!;
        });
      },
    }
  );

  return (
    <div className="grid grid-cols-[100px_minmax(0,1fr)_minmax(0,1fr)] grid-rows-[auto_auto_auto] border-t-4 border-zinc-800">
      <div className="row-span-2 overflow-hidden p-5">
        <Link to={`/profiles/${post.author.name}`}>
          <div className="aspect-square w-16 overflow-hidden rounded-full">
            <img
              className="h-full w-full object-cover object-center"
              src={
                post.author.avatar ||
                "../../public/img/default-profile-picture.png"
              }
              onError={(e) =>
                (e.currentTarget.src =
                  "../../public/img/default-profile-picture.png")
              }
            />
          </div>
        </Link>
      </div>
      <div className="col-span-2 flex h-12 justify-between">
        <div className="self-center">
          <Link
            to={`/profiles/${post.author.name}`}
            className="mr-2 self-center font-bold text-white"
          >
            {post.author.name}
          </Link>
          <span className="self-center text-white">
            <TimeAgo datetime={post.created} />
          </span>
        </div>
        {/*
         * If logged in user email matches post.author.email render this button
         */}
        <div className="flex">
          {post.author.email == "steffen.samseth@stud.noroff.no" && (
            <>
              <button className="mr-3" onClick={() => {}}>
                <Pen className="h-4 fill-zinc-400"></Pen>
              </button>
              <button
                className="mr-3"
                onClick={() => {
                  deletePostMutation.mutate();
                }}
              >
                <Trash className="h-4 fill-zinc-400"></Trash>
              </button>
            </>
          )}
          {clickable && (
            <Link className="ml-auto self-center" to={`/posts/${post.id}`}>
              <ArrowRight className="mr-4 h-4 fill-white"></ArrowRight>
            </Link>
          )}
        </div>
      </div>
      <div className="col-span-2 flex">
        <div className="max-w-full grow basis-px break-words text-white">
          {(clickable && (
            <Link className="self-center" to={`/posts/${post.id}`}>
              <h2 className="font-bold text-white">{post.title}</h2>
            </Link>
          )) || <h2 className="font-bold text-white">{post.title}</h2>}
          {post.body}
        </div>
        {post.media && (
          <div className="max-h-64 grow basis-px overflow-hidden">
            <img
              className="h-full w-full object-cover object-center"
              src={post.media}
              onError={(e) =>
                (e.currentTarget.src = "../../public/img/broken-link.svg")
              }
            />
          </div>
        )}
      </div>
      <div className="col-span-3 flex flex-row justify-between px-5">
        <Link className="self-center" to={`/posts/${post.id}`}>
          <div className="flex items-center text-xs text-white">
            {clickable && (
              <>
                <Comment className="mr-2 h-4 fill-zinc-400" />
                {post._count.comments}
              </>
            )}
          </div>
        </Link>
        <div className="flex h-12 flex-row-reverse items-center gap-2 text-xs">
          {post.reactions.map((reaction) => (
            <span className="text-white">{`${reaction.symbol} ${reaction.count}`}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
