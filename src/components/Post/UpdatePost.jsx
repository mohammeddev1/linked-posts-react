import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Image,
  addToast,
  closeToast,
} from "@heroui/react";
import { IoCloseSharp } from "react-icons/io5";

import { useContext, useState } from "react";
import { MdAddPhotoAlternate } from "react-icons/md";
import { Form } from "react-router-dom";
import axios from "axios";
import { authContext } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UpdatePost({ post, isOpen, onOpen, onClose }) {
  const [toastKey, setToastKey] = useState("");
  const { token } = useContext(authContext);
  const [postData, setPostData] = useState({
    body: post.body,
    image: post.image,
  });
  const [preview, setPreview] = useState(post.image || "");

  const queryClient = useQueryClient();

  function handleUpdatePost(formData) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}`,
      formData,
      {
        headers: {
          token: token,
        },
      },
    );
  }
  let { mutate } = useMutation({
    mutationFn: handleUpdatePost,
    onMutate: () => {
      let toastId = addToast({
        title: "Updating post...",
        color: "default",
      });
      if (toastId) {
        setToastKey(toastId);
      }
    },
    onSuccess: (data) => {
      addToast({
        title: data.data.message || "Post created successfully",
        color: "success",
      });
      closeToast(toastKey);
      queryClient.invalidateQueries(["post", post._id]);
      queryClient.invalidateQueries(["allPosts"]);
    },

    onError: (error) => {
      console.log(error.response);

      addToast({
        title: error.response?.data?.message || "Something went wrong",
        color: "danger",
      });
      closeToast(toastKey);

      onOpen();
    },
  });
  return (
    <>
      <Modal
        size="lg"
        isOpen={isOpen}
        onClose={() => {
          setPostData({ body: post.body, image: post.image });
          setPreview(post.image || "");
          onClose();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData();

                if (postData.body) {
                  formData.append("body", postData.body);
                }

                if (postData.image instanceof File) {
                  formData.append("image", postData.image);
                }

                onClose();
                mutate(formData);
                console.log(postData);
              }}
            >
              <ModalHeader className="flex flex-col gap-1">
                Create New Post
              </ModalHeader>
              <ModalBody className="space-y-6">
                <div>
                  <Textarea
                    value={postData.body}
                    onChange={(e) => {
                      setPostData({ ...postData, body: e.target.value });
                    }}
                    required
                    disableAutosize
                    classNames={{
                      input: "h-30",
                    }}
                    placeholder="write post content here...."
                  />
                </div>

                <div>
                  <input
                    onChange={(e) => {
                      const file = e.target.files[0];

                      setPostData({ ...postData, image: file });
                      setPreview(URL.createObjectURL(file));
                      e.target.value = "";
                    }}
                    accept="image/*"
                    type="file"
                    id="image"
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="bg-gray-300 mb-2 flex justify-center items-center gap-2 cursor-pointer text-gray-950 rounded-lg  p-2 text-center w-fit"
                  >
                    <MdAddPhotoAlternate className="text-xl" />
                    Upload Image
                  </label>

                  {preview && (
                    <div className="relative h-37.5 w-62.5">
                      <Image
                        alt="HeroUI hero Image with delay h-full"
                        className="object-cover w-full"
                        src={preview}
                      />
                      <Button
                        onPress={() => {
                          setPostData({ ...postData, image: "" });
                          setPreview("");
                        }}
                        className="absolute hover:bg-red-600 hover:text-white min-w-fit px-1 py-2 h-5 rounded z-50 top-2 cursor-pointer right-2"
                      >
                        <IoCloseSharp className="text-xl" />
                      </Button>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  type="button"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Update post
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
