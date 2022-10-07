export type Comment = {
  created_at: string;
  id: number;
  post_id: number;
  text: string;
  username: string;
};

export type Vote = {
  created_at: string;
  id: number;
  post_id: number;
  upvote: boolean;
  username: string;
};

export type Subreddit = {
  created_at: string;
  id: number;
  topic: string;
};

export type Post = {
  created_at: string;
  id: number;
  body: string;
  image: string;
  video: string
  subreddit_id: string;
  title: string;
  username: string;
  votes: Vote[];
  comments: Comment[];
  subreddit: Subreddit[];
};
