import { addToast, Button, Form, Input } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { authContext } from "../../context/AuthContext";
import { RotatingLines } from "react-loader-spinner";
import { FaComment } from "react-icons/fa";

export default function UpdateComment({
  postId,
  commentId,
  commentContent,
  setUpdate,
}) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState(commentContent);

  function updateComment() {
    const commentData = {
      content: comment,
    };
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      commentData,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updateComment,
    onSuccess: (data) => {
      setUpdate(false);
      addToast({
        title: data.data.message,
        color: "success",
      });
      queryClient.invalidateQueries(["allPosts"]);
      queryClient.invalidateQueries(["postComments", postId]);
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
            classNames={{
              inputWrapper: "bg-gray-200",
            }}
            required
            variant="bordered"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            placeholder="add comment"
          />
          <Button
            type="submit"
            disabled={isPending}
            variant="solid"
            className="font-bold bg-green-700 text-green-100"
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
                update <FaComment className="text-3xl md:text-4xl" />
              </>
            )}
          </Button>
        </div>
      </Form>
    </>
  );
}
