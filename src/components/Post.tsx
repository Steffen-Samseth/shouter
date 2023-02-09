import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "timeago-react";
import ArrowRight from "./icons/ArrowRight";
import Comment from "./icons/Comment";
import { Post as PostType } from "../api";

interface Props {
  post: PostType;
}

const Post: FunctionComponent<Props> = ({ post }) => (
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
    <div className="col-span-2 flex h-12">
      <Link
        to={`/profiles/${post.author.name}`}
        className="mr-2 self-center font-bold text-white"
      >
        {post.author.name}
      </Link>
      <span className="self-center text-white">
        <TimeAgo datetime={post.created} />
      </span>
      <Link className="ml-auto self-center" to={`/posts/${post.id}`}>
        <ArrowRight className="mr-4 h-4 fill-white"></ArrowRight>
      </Link>
    </div>
    <div className="col-span-2 flex">
      <div className="max-w-full grow basis-px break-words text-white">
        <Link className="self-center" to={`/posts/${post.id}`}>
          <h2 className="font-bold text-white">{post.title}</h2>
        </Link>
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
          <Comment className="mr-2 h-4 fill-zinc-400" />
          {post._count.comments}
        </div>
      </Link>
      <div className="flex h-12 flex-row-reverse items-center gap-2 text-xs">
        {post.reactions.map((reaction) => (
          <span className="text-white">{`${reaction.symbol}${reaction.count}`}</span>
        ))}
      </div>
    </div>
  </div>
);

export default Post;
