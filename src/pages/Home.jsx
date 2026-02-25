import axios from "axios";
import { useContext } from "react";
import { authContext } from "../context/AuthContext";
import { RotatingLines } from "react-loader-spinner";
import PostCard from "./post/PostCard";
import { useQuery } from "@tanstack/react-query";
import Error from "../components/Error";
import CreatePost from "./post/CreatePost";
import { Helmet } from "react-helmet";

export default function Home() {
  const { token } = useContext(authContext);

  function getAllPosts() {
    return axios.get("https://route-posts.routemisr.com/posts", {
      headers: {
        token: token,
      },
    });
  }

  let {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryFn: getAllPosts,
    queryKey: ["allPosts"],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (isError) {
    return (
      <Error
        message={error.message}
        description={"can not load posts , please try again"}
        reFetch={refetch}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      {posts ? (
        <>
          <CreatePost reFetch={refetch} />
          {posts.data.data.posts.map((post) => (
            <PostCard post={post} key={post._id} />
          ))}
        </>
      ) : (
        <div className="h-[50vh] flex justify-center items-center ">
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
      )}
    </>
  );
}
