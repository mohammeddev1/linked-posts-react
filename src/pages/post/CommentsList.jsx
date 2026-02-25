import {
  addToast,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";
import axios from "axios";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { authContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RotatingLines } from "react-loader-spinner";
import UpdateComment from "../../components/UpdateComment";

export default function CommentsList({ comment, postId }) {
  const { token, userId } = useContext(authContext);
  const [update, setUpdate] = useState(false);
  const canDoActionsOnComment = () => userId === comment.commentCreator._id;

  const queryClient = useQueryClient();
  function deleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: deleteComment,
    onSuccess: (data) => {
      addToast({
        title: data.data.message,
        color: "success",
      });
      queryClient.invalidateQueries(["allPosts"]);
      queryClient.invalidateQueries(["postComments", postId]);
    },
    onError: (data) => {
      addToast({
        title: data.response.data.message,
        color: "warning",
      });
    },
  });

  return (
    <div className="bg-gray-100  flex justify-between  rounded-md p-2 mt-2 w-full">
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
        <div className="flex-col w-full">
          <div className="flex justify-between ">
            <div>
              <User
                avatarProps={{
                  src: comment.commentCreator.photo,
                }}
                description={new Date(comment.createdAt).toLocaleString(
                  "en-us",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  },
                )}
                name={comment.commentCreator.name}
              />
              <p className="ml-6 py-1">{comment.content}</p>
            </div>
            {canDoActionsOnComment() && (
              <div>
                <Dropdown>
                  <DropdownTrigger>
                    <HiOutlineDotsVertical className="text-xl" />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Dynamic Actions">
                    <DropdownItem
                      onClick={() => {
                        setUpdate(true);
                      }}
                      className="text-green-700 font-bold"
                      color="success"
                    >
                      Update
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        mutate();
                      }}
                      className="text-red-700 font-bold"
                      color="danger"
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>
          {update && (
            <UpdateComment
              commentId={comment._id}
              postId={postId}
              commentContent={comment.content}
              setUpdate={setUpdate}
            />
          )}
        </div>
      )}
    </div>
  );
}
