import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Box, Divider, IconButton, List, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import {
  setConversations,
  setSelectedConversation,
} from "../../state/slices/messagesSlice";
import SearchBar from "../Common/SearchBar";
import ConversationListItem from "./ConversationListItem";
import CreateMessageModal from "./CreateMessageModal/CreateMessageModal";

const styles = {
  header: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 1,
    paddingLeft: 2,
    paddingRight: 1,
  },
  searchBarContainer: { padding: 1 },
};

const ConversationList = () => {
  const { conversations, selectedConversation } = useAppSelector(
    (state) => state.messages,
  );
  const [messageModal, showMessageModal] = useState(false);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      const result = await axios.get("http://localhost:3001/api/messages", {
        params: {
          userId: user.userId,
        },
      });
      dispatch(setConversations(result.data));
    };
    fetchMessages();
  }, [dispatch, user]);

  return (
    <Box>
      <Box sx={styles.header}>
        <Typography variant="h2">Messages</Typography>
        <IconButton onClick={() => showMessageModal(true)}>
          <ChatOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={styles.searchBarContainer}>
        <SearchBar placeholder="Search Messages" />
      </Box>
      <Divider />
      <List component="div">
        {conversations.map((o) => (
          <ConversationListItem
            conversation={o}
            key={o.otherUserId}
            onClick={() => {
              dispatch(
                setSelectedConversation({
                  displayName: o.displayName,
                  username: o.username,
                  userId: o.otherUserId,
                }),
              );
              navigate(`/messages/${user.userId}/${o.otherUserId}`);
            }}
            selected={selectedConversation.userId === o.otherUserId}
          />
        ))}
      </List>
      <CreateMessageModal
        onClose={() => showMessageModal(false)}
        open={messageModal}
      />
    </Box>
  );
};

export default ConversationList;
