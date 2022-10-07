import { gql } from "@apollo/client";

export const GET_SUBREDDIT_LIST_BY_TOPIC = gql`
  query GetSubredditListByTopic($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;

export const GET_SUBREDDITS_WITH_LIMIT = gql`
  query GetSubredditListLimited($limit: Int!) {
    getSubredditListLimited(limit: $limit) {
      id
      topic
      created_at
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query GetPostList {
    getPostList {
      id
      title
      body
      image
      video
      created_at
      subreddit_id
      username
      comments {
        id
        text
        username
        post_id
        created_at
      }
      votes {
        id
        upvote
        username
        post_id
        created_at
      }
      subreddit {
        id
        topic
        created_at
      }
    }
  }
`;

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query GetPostList($topic: String!) {
    getPostListByTopic(topic: $topic) {
      id
      title
      body
      image
      video
      created_at
      subreddit_id
      username
      comments {
        id
        text
        username
        post_id
        created_at
      }
      votes {
        id
        upvote
        username
        post_id
        created_at
      }
      subreddit {
        id
        topic
        created_at
      }
    }
  }
`;

export const GET_POST_BY_POST_ID = gql`
  query GetPostByPostId($post_id: ID!) {
    getPostByPostId(post_id: $post_id) {
      id
      title
      body
      image
      video
      created_at
      subreddit_id
      username
      comments {
        id
        text
        username
        post_id
        created_at
      }
      votes {
        id
        upvote
        username
        post_id
        created_at
      }
      subreddit {
        id
        topic
        created_at
      }
    }
  }
`;

export const GET_ALL_VOTES_BY_POST_ID = gql`
  query GetVotesByPostId($post_id: ID!) {
    getVotesByPostId(post_id: $post_id) {
      id
      upvote
      username
      post_id
      created_at
    }
  }
`;
