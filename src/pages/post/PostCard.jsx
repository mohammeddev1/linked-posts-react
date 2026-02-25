import { Image } from "@heroui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@heroui/react";
import { AiOutlineLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import PostComment from "./PostComment";
import { useNavigate } from "react-router-dom";
import CreateComment from "../../components/CreateComment";
import PostActions from "../../components/PostActions";
import { memo } from "react";

function PostCard({ post }) {
  console.log("post card render");
  const nav = useNavigate();

  return (
    <>
      <Card className="max-w-3xl mx-auto my-4">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar isBordered radius="full" size="md" src={post.user.photo} />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">
                {post.user.name}
              </h4>
              <h5 className="text-small tracking-tight text-default-400">
                {new Date(post.createdAt).toLocaleString("en-us", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </h5>
            </div>
          </div>
          <PostActions post={post} />
        </CardHeader>

        <CardBody className="px-3 py-3 text-small text-gray-700">
          <p>{post.body}</p>
          {post.image && (
            <Image
              onClick={() => {
                nav(`/post-details/${post._id}?tab=comments`);
              }}
              alt={post.body}
              height={450}
              width={"100%"}
              className="w-full   rounded object-cover"
              src={post.image}
            />
          )}
        </CardBody>

        <CardFooter className="justify-center flex-col p-0">
          <div className="flex gap-4 p-3 sm:gap-16 justify-center items-center">
            <Button
              onPress={() => {
                nav(`/post-details/${post._id}?tab=likes`);
              }}
              variant="bordered"
              className="gap-1"
            >
              {post.likesCount > 0 && <p>{post.likesCount}</p>}

              <AiOutlineLike className="text-xl" />
              <p>Likes</p>
            </Button>
            <Button
              onPress={() => {
                nav(`/post-details/${post._id}?tab=comments`);
              }}
              variant="faded"
              className="items-center"
            >
              {post.commentsCount > 0 && <p>{post.commentsCount}</p>}
              <FaComment className="text-lg" />
              <p>Comments</p>
            </Button>
            {/* <Button variant="solid" className="items-center">
              {post.sharesCount > 0 && <p>{post.sharesCount}</p>}
              <FaShare className="text-lg" />
              <p>Share</p>
            </Button> */}
          </div>
          {/* Create Comment Element */}
          <CreateComment post={post} />
          {post.topComment && <PostComment post={post} />}
        </CardFooter>
      </Card>
    </>
  );
}
const PostCardMemo = memo(PostCard);
export default PostCardMemo;
