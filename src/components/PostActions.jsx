import {
  addToast,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";

import { HiOutlineDotsVertical } from "react-icons/hi";

import { useContext } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UpdatePost from "../pages/post/UpdatePost";
import { authContext } from "../context/AuthContext";

export default function PostActions({ post }) {
  const { userId, token } = useContext(authContext);
  const queryClient = useQueryClient();
  const canDoActionsOnPost = () => userId === post.user._id;
  const { isOpen, onOpen, onClose } = useDisclosure();

  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
      headers: {
        token: token,
      },
    });
  }

  const { mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: (data) => {
      console.log(data.data);
      addToast({
        title: data.data.message,
        color: "success",
      });
      queryClient.invalidateQueries(["post", post._id]);
      queryClient.invalidateQueries(["allPosts"]);
    },
    onError: (error) => {
      console.log(error.response.data);
      addToast({
        title: error.response.data.message,
        color: "danger",
      });
    },
  });
  return (
    <>
      <UpdatePost
        post={post}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
      {canDoActionsOnPost() && (
        <Dropdown>
          <DropdownTrigger>
            <HiOutlineDotsVertical className="text-xl" />
          </DropdownTrigger>
          <DropdownMenu aria-label="Dynamic Actions">
            <DropdownItem
              onPress={() => {
                onOpen();
              }}
              className="text-green-700 font-bold"
              color="success"
            >
              Update
            </DropdownItem>
            <DropdownItem
              onPress={() => {
                mutate();
              }}
              className="text-red-700 font-bold"
              color="danger"
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </>
  );
}
