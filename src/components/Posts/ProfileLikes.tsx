import { useEffect } from "react";
import PostItem from "./PostItem";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { Post, setPosts } from "../../state/slices/postsSlice";
import formatTimestamp from "../Misc/formatTimestamp";

const ProfileLikes = () => {
  const posts = useAppSelector((state) => state.posts);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await axios.get(
        "http://localhost:3001/api/profile/getOwnLikes",
        {
          params: {
            userId: user.userId,
          },
        }
      );
      const modified = result.data.map((entry: any) => ({
        ...entry,
        timestamp: formatTimestamp(entry),
      }));
      dispatch(setPosts(modified as Post[]));
    };
    fetchPosts();
  }, [dispatch, user]);

  return (
    <>
      {posts.map((o, index) => (
        <PostItem key={index} post={o} />
      ))}
    </>
  );
};

export default ProfileLikes;
