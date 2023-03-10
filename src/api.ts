const API_URL = "https://api.noroff.dev/api/v1";

// Fetches login info from localStorage
export function getLoginInfo(): LoginInfo | null {
  if (sessionStorage.getItem("login-info"))
    return JSON.parse(sessionStorage.getItem("login-info")!) as LoginInfo;

  if (localStorage.getItem("login-info"))
    return JSON.parse(localStorage.getItem("login-info")!) as LoginInfo;

  return null;
}

// Saves login info in local/session storage
function setLoginInfo(loginInfo: LoginInfo, type: "session" | "persistent") {
  if (type == "session") {
    sessionStorage.setItem("login-info", JSON.stringify(loginInfo));
  } else {
    localStorage.setItem("login-info", JSON.stringify(loginInfo));
  }
}

// Deletes login-info from localStorage
export function signOut() {
  localStorage.removeItem("login-info");
  sessionStorage.removeItem("login-info");
}

// Fetch access token from local storage, or crash if it doesn't exist
//
// Only use this from functions that will only be called when a user is already
// logged in.
//
function getAccessToken() {
  const loginInfo = getLoginInfo();

  if (loginInfo === null) throw "User is not logged in!";

  return loginInfo.accessToken;
}

export async function signIn(
  email: string,
  password: string,
  type: "session" | "persistent"
) {
  const response = await fetch(`${API_URL}/social/auth/login`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.status == 200) {
    setLoginInfo(await response.json(), type);
    return true;
  }

  return false;
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
  avatarUrl: string,
  bannerUrl: string
) {
  const response = await fetch(`${API_URL}/social/auth/register`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: username,
      email,
      password,
      avatar: avatarUrl,
      banner: bannerUrl,
    }),
  });

  if (response.status == 201) {
    return true;
  } else if (response.status == 400) {
    const responseData = await response.json();
    const errors: [{ message: string }] = responseData.errors;

    return (
      "Registration failed with error(s):\n" +
      errors.map((error) => `- ${error.message}`).join("\n")
    );
  }

  console.error("Unexpected API response", response);

  throw `Unknown response code from API: ${response.status}`;
}

export async function createPost(title: string, body: string, media: string) {
  const response = await fetch(`${API_URL}/social/posts`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body, media }),
  });

  return response.status == 200;
}

export async function createComment(postId: number, commentBody: string) {
  const response = await fetch(`${API_URL}/social/posts/${postId}/comment`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body: commentBody,
    }),
  });
  return await response.json();
}

export async function createReaction(postId: number, emoji: string) {
  const response = await fetch(`${API_URL}/social/posts/${postId}/react/${emoji}`, {
    method: "put",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      symbol: emoji,
    }),
  });

  if (response.status != 200) {
    console.error("Expected response code 200", response);
    return false;
  }

  return true;
}

export async function deletePost(postId: number) {
  const response = await fetch(`${API_URL}/social/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

export async function fetchPosts() {
  const response = await fetch(
    `${API_URL}/social/posts?_author=true&_reactions=true&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  return (await response.json()) as Post[];
}

export async function fetchSinglePost(postId: number) {
  const response = await fetch(
    `${API_URL}/social/posts/${postId}?_author=true&_comments=true&_reactions=true`,
    {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  if (response.status == 200) {
    return (await response.json()) as Post;
  }
  return null;
}

export async function fetchPostsByProfile(profileName: string) {
  const response = await fetch(
    `${API_URL}/social/profiles/${profileName}/posts?_author=true&_reactions=true`,
    {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );

  if (response.status == 200) {
    return (await response.json()) as Post[];
  }

  console.log("fetchPostsByProfile got unexpected response code", response.status);
  console.log(response);

  return null;
}

export async function fetchProfiles() {
  const response = await fetch(`${API_URL}/social/profiles`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return (await response.json()) as Profile[];
}

export async function fetchSingleProfile(profileName: string) {
  const response = await fetch(
    `${API_URL}/social/profiles/${profileName}?_followers=true`,
    {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  if (response.status == 200) {
    return (await response.json()) as Profile;
  }
  return null;
}

export async function editPost(
  postId: number,
  title: string,
  body: string,
  media: string | null
) {
  const response = await fetch(`${API_URL}/social/posts/${postId}`, {
    method: "put",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      body,
      media,
    }),
  });
  return response.status == 200;
}

export async function editAvatarUrl(profileName: string, avatar: string) {
  const response = await fetch(`${API_URL}/social/profiles/${profileName}/media`, {
    method: "put",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      avatar: avatar,
    }),
  });
  return response.status == 200;
}

export async function editBannerUrl(profileName: string, banner: string) {
  const response = await fetch(`${API_URL}/social/profiles/${profileName}/media`, {
    method: "put",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      banner: banner,
    }),
  });
  return response.status == 200;
}

export async function followProfile(profileName: string) {
  const response = await fetch(`${API_URL}/social/profiles/${profileName}/follow`, {
    method: "put",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.status == 200;
}

export async function unfollowProfile(profileName: string) {
  const response = await fetch(`${API_URL}/social/profiles/${profileName}/unfollow`, {
    method: "put",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.status == 200;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  media: string | null;
  created: string;
  updated: string;
  _count: {
    comments: number;
    reactions: number;
  };
  author: {
    name: string;
    email: string;
    avatar: string | null;
  };
  reactions: Array<{
    symbol: string;
    count: number;
    postId: number;
    message?: string;
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
      avatar: string | null;
      banner: string | null;
    };
  }>;
}

export interface Profile {
  name: string;
  email: string;
  banner: string;
  avatar: string;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
  followers: Array<{
    name: string;
    avatar: string | null;
  }>;
}

interface LoginInfo {
  name: string;
  email: string;
  avatar: string | null;
  accessToken: string;
}
