import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Image,
  Button,
} from "@heroui/react";
import axios from "axios";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { authContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { RotatingLines } from "react-loader-spinner";
import PostCard from "../components/Post/PostCard.jsx";

export default function Profile() {
  // const user = {
  //   name: "Mohammed Hussein",
  //   username: "mohammedhussein12",
  //   email: "mohammedhm@gmail.com",
  //   dateOfBirth: "2004-12-25",
  //   gender: "Male",
  //   photo:
  //     "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png",
  //   cover: "",
  //   followersCount: 120,
  //   followingCount: 75,
  //   bookmarksCount: 18,
  // };
  const { token, userId } = useContext(authContext);
  function getProfileData() {
    return axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: {
        token: token,
      },
    });
  }
  const { data: user, isLoading } = useQuery({
    queryFn: getProfileData,
    queryKey: ["profileDat", userId],
  });

  function getUserPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${userId}/posts`,
      {
        headers: {
          token: token,
        },
      },
    );
  }
  const { data: userPosts, isLoading: loadingPOsts } = useQuery({
    queryFn: getUserPosts,
    queryKey: ["userPosts", userId],
  });

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="max-w-3xl mx-auto mt-10 mb-5">
        {!user ? (
          <div className="flex justify-center items-center">
            <RotatingLines
              visible={isLoading}
              height="86"
              width="86"
              color="blue"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
          </div>
        ) : (
          <>
            <Card className="shadow-lg mb-5">
              {/* Cover */}
              <h1 className="text-center text-3xl text-gray-900 font-mono">
                User Information
              </h1>
              <CardHeader className="flex  items-start mt-6 gap-3 px-6">
                <Avatar size="lg" src={user.data.data.user.photo} />
                <div className="flex flex-col items-start  ">
                  <h2 className="text-2xl font-bold">
                    {user.data.data.user.name}
                  </h2>
                  <p className="text-gray-500">
                    @{user.data.data.user.username}
                  </p>
                </div>
              </CardHeader>

              <CardBody className="px-6 space-y-4">
                {/* Info */}
                <div className="text-gray-700 space-y-1">
                  <p>
                    <strong>Email:</strong> {user.data.data.user.email}
                  </p>
                  <p>
                    <strong>Gender:</strong> {user.data.data.user.gender}
                  </p>
                  <p>
                    <strong>Date of Birth: </strong>
                    {new Date(
                      user.data.data.user.dateOfBirth,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </CardBody>
            </Card>

            <div>
              <h1 className="text-center bg-white shadow-md max-w-3xl mx-auto rounded-2xl p-2  text-3xl text-gray-900 font-mono">
                User Posts
              </h1>
              {userPosts &&
                userPosts.data.data.posts.map((post) => (
                  <PostCard post={post} key={post._id} />
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
