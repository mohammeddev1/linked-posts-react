import { User } from "@heroui/react";

export default function LikesCard({ like }) {
  return (
    <div className="bg-gray-100 rounded-md p-2 mt-2 w-full">
      <User
        avatarProps={{
          src: like.photo,
        }}
        description={like.username}
        name={like.name}
      />
    </div>
  );
}
