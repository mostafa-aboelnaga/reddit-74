import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Avatar from "./Avatar";
import { LinkIcon, PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ADD_POST, ADD_SUBREDDIT } from "../graphql/mutations";
import client from "../apollo-client";
import { GET_ALL_POSTS, GET_SUBREDDIT_LIST_BY_TOPIC } from "../graphql/queries";
import toast from "react-hot-toast";

type FormData = {
  postTitle: string;
  postBody: string;
  postImage: string;
  postVideo: string;
  subreddit: string;
};

type Props = {
  subreddit?: string;
};

function PostBox({ subreddit }: Props) {
  const { data: session } = useSession();
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS],
  });
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);
  const [imageBoxOpen, setImageBoxOpen] = useState(false);
  const [videoBoxOpen, setVideoBoxOpen] = useState(false);

  const onSubmit = handleSubmit(async (formData: FormData) => {
    console.log(formData);
    const notification = toast.loading("Creating new post...");
    try {
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_LIST_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit,
        },
      });

      console.log(getSubredditListByTopic);
      const subredditExists = getSubredditListByTopic.length > 0;
      console.log(subredditExists);
      if (!subredditExists) {
        console.log("Subreddit doesnt exist, creating a NEW subreddit...");

        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        });

        console.log("Now creating this post within this new subreddit...");

        const image = formData.postImage || "";
        const video = formData.postVideo || "";

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            title: formData.postTitle,
            body: formData.postBody,
            image: image,
            video: video,
            subreddit_id: newSubreddit.id,
            username: session?.user?.name,
          },
        });

        console.log("New post added: ", newPost);
      } else {
        console.log("Using an already existing subreddit...");

        const image = formData.postImage || "";
        const video = formData.postVideo || "";

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            title: formData.postTitle,
            body: formData.postBody,
            image: image,
            video: video,
            subreddit_id: getSubredditListByTopic[0].id,
            username: session?.user?.name,
          },
        });

        console.log("New post added: ", newPost);
      }

      setValue("postTitle", "");
      setValue("postBody", "");
      setValue("postImage", "");
      setValue("subreddit", "");

      toast.success("New post created", {
        id: notification,
      });
    } catch (error) {
      console.log("error is: ", error);
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-20 z-50 bg-white p-2 border rounded-md border-gray-300"
    >
      <div className="flex items-center space-x-3">
        <Avatar />
        <input
          {...register("postTitle", { required: true })}
          disabled={!session}
          className="rounded flex-1 bg-gray-50 p-2 pl-5 outline-none"
          type="text"
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : "Create a post by entering a title"
              : "Sign in to post something"
          }
        />
        <PhotoIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 text-gray-300 cursor-pointer ${
            imageBoxOpen && "text-blue-300"
          }`}
        />
        <VideoCameraIcon
          onClick={() => setVideoBoxOpen(!videoBoxOpen)}
          className={`h-6 text-gray-300 cursor-pointer ${
            videoBoxOpen && "text-blue-300"
          }`}
        />
        <LinkIcon className="h-6 text-gray-300 cursor-pointer" />
      </div>

      {!!watch("postTitle") && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              type="text"
              placeholder="Text (optional)"
              {...register("postBody")}
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
            />
          </div>
          {!subreddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Subreddit:</p>
              <input
                type="text"
                placeholder="i.e. memes"
                {...register("subreddit", { required: true })}
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              />
            </div>
          )}
          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                type="text"
                placeholder="optional..."
                {...register("postImage")}
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              />
            </div>
          )}
          {videoBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Video URL:</p>
              <input
                type="text"
                placeholder="optional..."
                {...register("postVideo")}
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              />
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === "required" && (
                <p>A post title is required</p>
              )}
              {errors.subreddit?.type === "required" && (
                <p>A subreddit is required</p>
              )}
            </div>
          )}

          {!!watch("postTitle") && (
            <button
              type="submit"
              className="w-full rounded-full bg-blue-400 p-2 text-white"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
}

export default PostBox;
