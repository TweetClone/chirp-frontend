import { Divider } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { setPosts } from "../../state/slices/postsSlice";
import useAxios from "../../utilities/useAxios";
import PostItem from "./PostItem";

type ExpandedPostRepliesProps = {
  postId: number;
};

const ExpandedPostReplies = ({ postId }: ExpandedPostRepliesProps) => {
  const { posts } = useAppSelector((state) => state.posts);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { sendRequest } = useAxios();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const resultReplies = await sendRequest(
          {
            method: "GET",
            params: { userId: user.userId, postId },
          },
          "posts/fetchReplies",
        );
        dispatch(setPosts(resultReplies));
      } catch (e) {
        console.log(e.message);
      }
    };
    fetchPosts();
  }, [dispatch, user, postId]);

  return (
    <>
      {posts
        .filter((o) => o.parentPostId === postId)
        .map((o) => (
          <PostItem key={o.postId} post={o} />
        ))}
      <Divider />
    </>
  );
};

export default ExpandedPostReplies;
