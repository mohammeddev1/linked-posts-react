import axios from "axios";
import { memo, useContext } from "react";
import { authContext } from "../context/AuthContext";
import { RotatingLines } from "react-loader-spinner";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/Post/PostCard";
import Error from "../components/Error";
import CreatePost from "../components/Post/CreatePost.jsx";

function Home() {
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
const HomeMemo = memo(Home);
export default HomeMemo;
