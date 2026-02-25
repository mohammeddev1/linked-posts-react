import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PostCard from "./PostCard";
import { useContext } from "react";
import axios from "axios";
import { authContext } from "../../context/AuthContext";
import { RotatingLines } from "react-loader-spinner";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@heroui/react";
import PostDetailsCard from "./PostDetailsCard";
import { Helmet } from "react-helmet";

export default function PostDetails() {
  const { postId } = useParams();
  const [searchParam, setSearchParams] = useSearchParams();
  const { token } = useContext(authContext);
  const nav = useNavigate();

  function getPost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${postId}`, {
      headers: {
        token: token,
      },
    });
  }

  let { data: post } = useQuery({
    queryKey: ["post", postId],
    queryFn: getPost,
  });

  function getPostComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      {
        headers: {
          token: token,
        },
      },
    );
  }
  let { isLoading, data: comments } = useQuery({
    queryKey: ["postComments", postId],
    queryFn: getPostComments,
  });

  function getPostLikes() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/likes`,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  let { isLoading: loading, data: likes } = useQuery({
    queryKey: ["postLikes", postId],
    queryFn: getPostLikes,
  });

  return (
    <>
      <Helmet>
        <title>Post Details</title>
      </Helmet>
      {!isLoading && !loading ? (
        <>
          <Button
            onPress={() => {
              nav("/");
            }}
            className="md:ml-20 ml-3"
          >
            <FaArrowLeft className="text-xl cursor-pointer" />
          </Button>

          <PostDetailsCard
            searchParam={{ tab: searchParam.get("tab"), setSearchParams }}
            post={post.data.data.post}
            comments={comments.data.data.comments}
            likes={likes.data.data.likes}
          />
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
