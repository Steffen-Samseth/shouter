import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "timeago-react";
import ArrowRight from "./icons/ArrowRight";
import Comment from "./icons/Comment";
import { createReaction, deletePost, Post as PostType, Profile } from "../api";
import Trash from "./icons/Trash";
import Pen from "./icons/Pen";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import EmojiPicker from "./EmojiPicker";

// Adds a reaction emoji to a post object
function addReactionToPost(post: PostType, emoji: string) {
  let reactionAlreadyExists = false;

  // If the emoji already exists in the reaction list, add +1 to it
  for (const reaction of post.reactions) {
    if (reaction.symbol == emoji) {
      reaction.count += 1;
      reactionAlreadyExists = true;
      break;
    }
  }

  // Otherwise, create it
  if (!reactionAlreadyExists) {
    post.reactions.push({
      symbol: emoji,
      count: 1,
      postId: post.id,
    });
  }
}

// Adds a reaction emoji to a post object
function removeReactionFromPost(post: PostType, emoji: string) {
  // If the emoji already exists in the reaction list, remove 1 from it
  for (const i in post.reactions) {
    const reaction = post.reactions[i];

    if (reaction.symbol == emoji) {
      reaction.count -= 1;

      if (reaction.count == 0) post.reactions.splice(Number(i), 1);

      break;
    }
  }
}

// Handles optimistic reaction to a post
//
// This updates the single-post query and post list query with the new reaction.
//
function optimisticReactToPost(
  queryClient: QueryClient,
  post: PostType,
  emoji: string,
  action: "add" | "remove"
) {
  if (queryClient.getQueryData(`post-${post.id}`)) {
    queryClient.setQueryData<PostType>(`post-${post.id}`, (oldPost) => {
      const newPost = structuredClone(oldPost!) as PostType;

      if (action == "add") addReactionToPost(newPost, emoji);
      if (action == "remove") removeReactionFromPost(newPost, emoji);

      return newPost;
    });
  }

  if (queryClient.getQueryData("posts")) {
    queryClient.setQueryData<PostType[]>("posts", (oldPosts) => {
      const newPosts = structuredClone(oldPosts);

      for (const cachedPost of newPosts!) {
        if (cachedPost.id == post.id) {
          if (action == "add") addReactionToPost(cachedPost, emoji);
          if (action == "remove") removeReactionFromPost(cachedPost, emoji);
        }
      }

      return newPosts;
    });
  }

  if (queryClient.getQueryData(`profile-${post.author.name}`)) {
    queryClient.setQueryData<[Profile, PostType[]]>(
      `profile-${post.author.name}`,
      (profileAndPosts) => {
        const [profile, posts] = profileAndPosts!;
        const newPosts = structuredClone(posts);

        for (const cachedPost of newPosts) {
          if (cachedPost.id == post.id) {
            if (action == "add") addReactionToPost(cachedPost, emoji);
            if (action == "remove") removeReactionFromPost(cachedPost, emoji);
          }
        }

        return [profile, newPosts];
      }
    );
  }
}

interface Props {
  post: PostType;
  clickable?: boolean;
}
const Post: FunctionComponent<Props> = ({ post, clickable = true }) => {
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation(async () => await deletePost(post.id), {
    mutationKey: "posts-delete",

    onMutate: () => {
      const originalPosts: PostType[] | undefined = queryClient.getQueryData("posts");

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
  });

  const createReactionMutation = useMutation(
    async (emoji: string) => {
      return await createReaction(post.id, emoji);
    },
    {
      onMutate: (emoji: string) => {
        optimisticReactToPost(queryClient, post, emoji, "add");
      },

      onError: (_, emoji) => {
        optimisticReactToPost(queryClient, post, emoji, "remove");
        alert("Failed to react to post, please check your network connection");
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
              src={post.author.avatar || "../../public/img/default-profile-picture.png"}
              onError={(e) =>
                (e.currentTarget.src = "../../public/img/default-profile-picture.png")
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
          <div className="whitespace-pre-wrap">{post.body}</div>
        </div>
        {post.media && (
          <div className="max-h-128 grow basis-px overflow-hidden">
            <img
              className="h-full w-full object-contain object-center"
              src={post.media}
              onError={(e) => (e.currentTarget.src = "../../public/img/broken-link.svg")}
            />
          </div>
        )}
      </div>
      <div className="col-span-3 flex flex-row justify-between gap-8 px-5">
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
        <div className="flex flex-row flex-wrap items-center gap-2 py-6">
          <EmojiPicker onEmojiClick={(emoji) => createReactionMutation.mutate(emoji)} />
          {post.reactions.map((reaction) => (
            <span
              className="text-white"
              key={reaction.symbol}
            >{`${reaction.symbol} ${reaction.count}`}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
