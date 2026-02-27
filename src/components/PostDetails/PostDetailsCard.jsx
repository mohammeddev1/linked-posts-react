import { Image, Input, Tab, Tabs } from "@heroui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import CommentsList from "../Comment/CommentsList";
import LikesCard from "../Likes/LikesCard.jsx";
import CreateComment from "../Comment/CreateComment.jsx";
import PostActions from "../Post/PostActions.jsx";

export default function PostDetailsCard({
  post,
  comments,
  likes,
  searchParam,
}) {
  let { tab, setSearchParams } = searchParam;
  const nav = useNavigate();
  return (
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
              nav(`/post-details/${post._id}`);
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
        <CreateComment post={post} />
        <div className="flex w-full flex-col">
          <Tabs
            selectedKey={tab}
            onSelectionChange={(key) => {
              setSearchParams({ tab: key });
            }}
            classNames={{ tabList: "w-full flex rounded-none" }}
            aria-label="Options"
          >
            <Tab
              className="w-full"
              key="comments"
              title={
                comments.length > 0
                  ? `${comments.length}  Comments`
                  : "Comments"
              }
            >
              <Card>
                <CardBody>
                  {comments && comments.length > 0 ? (
                    comments.map((comment) => {
                      return (
                        <CommentsList
                          key={comment._id}
                          comment={comment}
                          postId={post._id}
                        />
                      );
                    })
                  ) : (
                    <p className="text-gray-600 text-center text-lg">
                      No Comments
                    </p>
                  )}
                </CardBody>
              </Card>
            </Tab>

            <Tab
              key="likes"
              title={likes.length > 0 ? `${likes.length}  Likes` : "Likes"}
              className="w-full"
            >
              <Card>
                <CardBody>
                  {likes && likes.length > 0 ? (
                    likes.map((like) => {
                      return <LikesCard key={like._id} like={like} />;
                    })
                  ) : (
                    <p className="text-gray-600 text-center text-lg">
                      No Likes
                    </p>
                  )}
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </CardFooter>
    </Card>
  );
}
