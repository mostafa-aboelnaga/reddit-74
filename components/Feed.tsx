import { useQuery } from "@apollo/client";
import React from "react";
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from "../graphql/queries";
import Post from "./Post";
import { Post as PostType } from "../typings";

type Props = {
  topic?: string;
  searchQuery?: string;
};

function Feed({ topic, searchQuery }: Props) {
  const { data, error } = !topic
    ? useQuery(GET_ALL_POSTS)
    : useQuery(GET_ALL_POSTS_BY_TOPIC, {
        variables: {
          topic: topic,
        },
      });
  const posts: PostType[] = !topic
    ? data?.getPostList
    : data?.getPostListByTopic;

  const search = searchQuery || "";

  return (
    <div className="w-full mt-5 space-y-4">
      {posts
        ?.filter((post) => {
          return search
            ? post.title.toLowerCase().includes(search) ||
                post.body.toLowerCase().includes(search)
            : post;
        })
        .map((post) => (
          <Post key={post.id} post={post} />
        ))}
    </div>
  );
}

export default Feed;
