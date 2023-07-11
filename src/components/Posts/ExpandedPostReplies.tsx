import { useEffect } from "react";
import PostItem from "./PostItem";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { Post, setPosts } from "../../state/slices/postsSlice";
import formatTimestamp from "../Misc/formatTimestamp";

type ExpandedPostRepliesProps = {
  post: Post;
};

const ExpandedPostReplies = ({ post }: ExpandedPostRepliesProps) => {
  const posts = useAppSelector((state) => state.posts);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const resultReplies = await axios.get(
          "http://localhost:3001/api/posts/fetchReplies",
          {
            params: {
              userId: user.userId,
              postId: post.postId,
            },
          }
        );
        const modified = resultReplies.data.map((entry: any) => ({
          ...entry,
          timestamp: formatTimestamp(entry),
        }));
        dispatch(setPosts(modified as Post[]));
      } catch (e) {
        console.log(e.message);
      }
    };
    fetchPosts();
  }, [dispatch, user, post, posts]);

  return (
    <>
      {posts
        .filter((o) => o.parentPostId === post.postId)
        .map((o) => (
          <PostItem key={o.postId} post={o} />
        ))}
    </>
  );
};

export default ExpandedPostReplies;
