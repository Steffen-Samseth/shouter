import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { fetchPosts, createPost } from "../api";
import Post from "../components/Post";
import Bullhorn from "../components/icons/Bullhorn";
import Layout from "../components/Layout";

const Posts: FunctionComponent = () => {
  const query = useQuery("posts", fetchPosts, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (query.isLoading) return <div>Loading...</div>;

  if (query.isError) return <div>{`Oh fuck, an error: ${query.error}`}</div>;

  return (
    <Layout>
      <button
        onClick={() => {
          createPost();
        }}
      >
        test button
      </button>
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
        <Post post={post} />
      ))}
    </Layout>
  );
};

export default Posts;