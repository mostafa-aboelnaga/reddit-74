import React, { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
  EllipsisHorizontalIcon,
  GiftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import TimeAgo from "react-timeago";
import Avatar from "./Avatar";
import Link from "next/link";
import { Jelly } from "@uiball/loaders";
import { Post, Vote } from "../typings";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { GET_ALL_POSTS, GET_ALL_VOTES_BY_POST_ID } from "../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_VOTE, DELETE_POST } from "../graphql/mutations";
import { useRouter } from "next/router";

type Props = {
  post: Post;
};

function Post({ post }: Props) {
  const router = useRouter();
  const [vote, setVote] = useState<boolean>();
  const { data: session } = useSession();

  const { data, loading } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      post_id: post?.id,
    },
  });

  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID],
  });

  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: [GET_ALL_POSTS],
  });

  const deletePostHandler = async () => {
    if (!session) {
      toast("🚩 You need to sign in to delete something!");
      return;
    }

    await deletePost({
      variables: {
        id: post.id,
      },
    });

    router.push("/");
    toast("Post deleted 😁👍");
  };

  const upVote = async (isUpvote: boolean) => {
    if (!session) {
      toast("🚩 You need to sign up to vote!");
      return;
    }

    if (vote && isUpvote) return;
    if (vote === false && !isUpvote) return;

    console.log("Voting..", isUpvote);
    await addVote({
      variables: {
        post_id: post.id,
        username: session.user?.name,
        upvote: isUpvote,
      },
    });
  };

  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostId;
    const latestUserVote = votes?.find(
      (vote) => vote.username == session?.user?.name,
    )?.upvote;

    setVote(latestUserVote);
  }, [data]);

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVotesByPostId;
    const displayNumber = votes?.reduce(
      (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
      0,
    );

    if (votes?.length === 0) return 0;
    if (displayNumber === 0) return votes[0]?.upvote ? 1 : -1;
    return displayNumber;
  };

  if (!post)
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    );
  return (
    <div className="flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border hover:border-gray-600">
      <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
        <ArrowUpIcon
          onClick={() => upVote(true)}
          className={`voteButtons hover:text-blue-400 ${
            vote && "text-blue-400"
          }`}
        />
        <p className="text-black font-bold text-xs">{displayVotes(data)}</p>
        <ArrowDownIcon
          onClick={() => upVote(false)}
          className={`voteButtons hover:text-red-400 ${
            vote === false && "text-red-400"
          }`}
        />
      </div>
      <Link href={`/post/${post.id}`}>
        <div className="p-3 pb-1">
          {/* Header */}
          <div className="flex justify-between items-center w-[36rem]">
            <div className="flex items-center space-x-2">
              <Avatar seed={post.subreddit[0]?.topic} />
              <p className="text-xs text-gray-400">
                <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
                  <span className="font-bold text-black hover:underline hover:text-blue-400">
                    r/{post.subreddit[0]?.topic}
                  </span>
                </Link>{" "}
                - Posted by u/
                {post.username} <TimeAgo date={post.created_at} />
              </p>
            </div>
            {post.username === session?.user?.name && (
              <div>
                <button onClick={() => deletePostHandler()}>Delete</button>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="py-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm font-light">{post.body}</p>
          </div>
          {/* Image */}

          {post.image && (
            <img className="w-full h-96" src={post.image} alt="" />
          )}
          {post.video && (
            <video className="w-full h-96" src={post.video} controls />
          )}

          {/* Footer */}
          <div className="flex space-x-4 text-gray-400">
            <div className="postButtons">
              <ChatBubbleOvalLeftIcon className="h-6 w-6" />
              <p className="">{post.comments.length} Comments</p>
            </div>
            <div className="postButtons">
              <GiftIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Award</p>
            </div>
            <div className="postButtons">
              <ShareIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Share</p>
            </div>
            <div className="postButtons">
              <BookmarkIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Save</p>
            </div>
            <div className="postButtons">
              <EllipsisHorizontalIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Post;
