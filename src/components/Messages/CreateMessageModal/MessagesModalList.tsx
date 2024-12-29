import { List } from "@mui/material";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../../state/hooks";
import { Conversation } from "../../../state/slices/messagesSlice";
import useAxios from "../../../utilities/useAxios";
import MessagesModalListItem from "./MessagesModalListItem";

type MessagesListProps = {
  onClose: () => void;
};

const MessagesList = ({ onClose }: MessagesListProps) => {
  const userId = useAppSelector((state) => state.user.userId);
  const [conversationList, setConversationList] = useState<Conversation[]>([]);
  const { sendRequest } = useAxios();

  useEffect(() => {
    const fetchConversationList = async () => {
      const result = await sendRequest(
        {
          method: "GET",
          params: { userId },
        },
        "messages/",
      );
      setConversationList(result);
    };
    fetchConversationList();
  }, [userId, sendRequest]);

  return (
    <List component="div">
      {conversationList.map((o) => (
        <MessagesModalListItem
          key={o.otherUserId}
          onClose={onClose}
          otherUser={{
            displayName: o.displayName,
            userId: o.otherUserId,
            username: o.username,
          }}
        />
      ))}
    </List>
  );
};

export default MessagesList;
