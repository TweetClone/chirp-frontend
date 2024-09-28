import { Button } from "@mui/material";
import useAxios from "../../utilities/useAxios";

const styles = {
  followButton: {
    boxShadow: "none",
    fontWeight: "bold",
    minWidth: "84px",
    "&:hover": {
      boxShadow: "none",
    },
  },
};

type FollowButtonProps = {
  onClick?: () => void;
  visitedUserId: number;
};

const FollowButton = ({ onClick, visitedUserId }: FollowButtonProps) => {
  const { sendRequest } = useAxios();

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await sendRequest({
        endpoint: "follow/followUser",
        method: "PUT",
        body: { visitedUserId },
        headers: { "Content-Type": "application/json" },
      });
      onClick?.();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      onClick={handleFollow}
      size="small"
      sx={styles.followButton}
      variant="contained"
    >
      Follow
    </Button>
  );
};

export default FollowButton;
