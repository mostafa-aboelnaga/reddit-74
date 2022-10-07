import { gql } from "@apollo/client";

export const ADD_POST = gql`
  mutation InsertPost(
    $body: String!
    $image: String!
    $video: String!
    $subreddit_id: ID!
    $title: String!
    $username: String!
  ) {
    insertPost(
      body: $body
      image: $image
      video: $video
      subreddit_id: $subreddit_id
      title: $title
      username: $username
    ) {
      body
      created_at
      id
      image
      video
      subreddit_id
      title
      username
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost(
    $id: ID!
  ) {
    deletePost(
      id: $id
    ) {
      body
      created_at
      id
      image
      video
      subreddit_id
      title
      username
    }
  }
`;

export const ADD_SUBREDDIT = gql`
  mutation InsertSubreddit($topic: String!) {
    insertSubreddit(topic: $topic) {
      id
      created_at
      topic
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation InsertComment($post_id: ID!, $username: String!, $text: String!) {
    insertComment(post_id: $post_id, username: $username, text: $text) {
      id
      post_id
      username
      text
      created_at
    }
  }
`;

export const ADD_VOTE = gql`
  mutation InsertVote($post_id: ID!, $username: String!, $upvote: Boolean!) {
    insertVote(post_id: $post_id, username: $username, upvote: $upvote) {
      id
      post_id
      username
      upvote
      created_at
    }
  }
`;
