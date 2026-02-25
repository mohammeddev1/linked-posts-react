import { addToast, Button, Form, Input } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { authContext } from "../context/AuthContext";
import { RotatingLines } from "react-loader-spinner";
import { FaComment } from "react-icons/fa";
import HandlePostLike from "./HandlePostLike";

export default function CreateComment({ post }) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  function createComment() {
    const commentData = {
      content: comment,
    };
    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/comments`,
      commentData,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      addToast({
        title: data.data.message,
        color: "success",
      });
      queryClient.invalidateQueries(["allPosts"]);
      queryClient.invalidateQueries(["postComments", post._id]);
      setComment("");
    },
    onError: (data) => {
      console.log(data.response);
      addToast({
        title: data.response.data.errors,
        color: "danger",
        timeout: 5000,
        classNames: {
          base: "min-w-md",
        },
      });
    },
  });

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
        className="w-full"
      >
        <div className="flex gap-2 w-full my-2 p-2">
          <Input
            required
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            className="w-full"
            placeholder="add comment"
          />
          <Button
            type="submit"
            disabled={isPending}
            color="primary"
            variant="faded"
            className="font-bold"
          >
            {isPending ? (
              <RotatingLines
                visible={true}
                height="26"
                width="26"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            ) : (
              <>
                add <FaComment className="text-3xl md:text-4xl" />
              </>
            )}
          </Button>

          <HandlePostLike post={post} />
        </div>
      </Form>
    </>
  );
}
