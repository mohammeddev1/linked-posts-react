import { User } from "@heroui/react";

export default function PostComment({ post }) {
  return (
    <div className="bg-gray-100 rounded-md p-2 mt-2 w-full">
      {post.topComment && (
        <>
          <User
            avatarProps={{
              src: post.topComment.commentCreator.photo,
            }}
            description={new Date(post.topComment.createdAt).toLocaleString(
              "en-us",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              },
            )}
            name={post.topComment.commentCreator.name}
          />
          <p className="ml-6 py-1">{post.topComment.content}</p>
        </>
      )}
    </div>
  );
}
