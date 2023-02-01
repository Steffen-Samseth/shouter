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
  return await response.json();
}
