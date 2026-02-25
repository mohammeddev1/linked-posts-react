import { addToast, Button } from "@heroui/react";
import axios from "axios";
import { useContext } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { authContext } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RotatingLines } from "react-loader-spinner";

export default function HandlePostLike({ post }) {
  const { userId } = useContext(authContext);
  const queryClient = useQueryClient();
  const hasLiked = post.likes.includes(userId);

  const { token } = useContext(authContext);

  function addLikeOnPost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}/like`,
      {},
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: addLikeOnPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["allPosts"]);
      queryClient.invalidateQueries(["postLikes", post._d]);
    },
    onError: (data) => {
      console.log(data.response);
      addToast({
        color: "danger",
        title: "Something is error",
      });
    },
  });

  return (
    <>
      <Button
        onPress={() => {
          mutate();
        }}
        disabled={isPending}
        variant={hasLiked ? "solid" : "ghost"}
        color={hasLiked ? "primary" : "default"}
        className="font-bold min-w-fit"
      >
        {isPending ? (
          <RotatingLines
            visible={isPending}
            height="26"
            width="26"
            color="grey"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        ) : (
          <>
            <AiOutlineLike type="Button" className="text-xl" />
          </>
        )}
      </Button>
    </>
  );
}
