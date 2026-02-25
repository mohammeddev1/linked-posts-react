import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Image,
  addToast,
} from "@heroui/react";
import { IoCloseSharp } from "react-icons/io5";

import { useContext, useState } from "react";
import { MdAddPhotoAlternate } from "react-icons/md";
import { Form } from "react-router-dom";
import axios from "axios";
import { authContext } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
export default function CreatePost({ reFetch }) {
  const { token } = useContext(authContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postData, setPostData] = useState({
    body: "",
    image: "",
  });

  function handleCreatePost(formData) {
    return axios.post("https://route-posts.routemisr.com/posts", formData, {
      headers: {
        token: token,
      },
    });
  }

  let { mutate, isPending } = useMutation({
    mutationFn: handleCreatePost,
    mutationKey: ["createNewPost"],

    onSuccess: (data) => {
      console.log(data);
      addToast({
        title: data.data.message || "Post created successfully",
        color: "success",
      });
      reFetch();
      setPostData({
        body: "",
        image: "",
      });
    },

    onError: (error) => {
      console.log(error.response);

      addToast({
        title: error.response?.data?.message || "Something went wrong",
        color: "danger",
      });

      onOpen();
    },
  });

  return (
    <>
      <div className="flex flex-wrap max-w-lg w-full mx-auto gap-3">
        <Button
          disabled={isPending}
          className="w-full mx-auto block"
          onPress={() => onOpen()}
        >
          Create New Post
        </Button>
      </div>
      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <Form
              onSubmit={(e) => {
                e.preventDefault();

                const formData = new FormData();

                if (postData.body) {
                  formData.append("body", postData.body);
                }

                if (postData.image) {
                  formData.append("image", postData.image);
                }
                addToast({
                  title: "Creating post...",
                  color: "default",
                });
                onClose();

                mutate(formData);
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
                      console.log(file);
                      setPostData({ ...postData, image: file });
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

                  {postData.image && (
                    <div className="relative h-37.5 w-62.5">
                      <Image
                        alt="HeroUI hero Image with delay h-full"
                        className="object-cover w-full"
                        src={URL.createObjectURL(postData.image)}
                      />
                      <Button
                        onPress={() => {
                          setPostData({ ...postData, image: "" });
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
                  create post
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
