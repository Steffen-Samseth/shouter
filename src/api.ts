const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjYxLCJuYW1lIjoiU3RlU2FtIiwiZW1haWwiOiJzdGVmZmVuLnNhbXNldGhAc3R1ZC5ub3JvZmYubm8iLCJhdmF0YXIiOm51bGwsImJhbm5lciI6bnVsbCwiaWF0IjoxNjc1MTcyMzUxfQ.qkYYdnoULDAHM3B2zkefWiMJ3bmJoZrDTImE5Q-YnxU";

const API_URL = "https://api.noroff.dev/api/v1";

export async function fetchPosts() {
  const response = await fetch(
    `${API_URL}/social/posts?_author=true&_reactions=true&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }
  );
  return (await response.json()) as Post[];
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  media: string;
  created: string;
  updated: string;
  _count: {
    comments: number;
    reactions: number;
  };
  author: {
    name: string;
    email: string;
    avatar: string;
  };
  reactions: Array<{
    symbol: string;
    count: number;
    postId: number;
    message: string;
  }>;
  comments: Array<{
    body: string;
    replyToId: null | number;
    id: number;
    postId: number;
    owner: string;
    created: string;
    author: {
      name: string;
      email: string;
      avatar: string;
      banner: string;
    };
  }>;
}
