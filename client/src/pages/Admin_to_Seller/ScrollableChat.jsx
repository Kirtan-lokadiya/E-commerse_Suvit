import ScrollableFeed from "react-scrollable-feed";
import {
  getSender,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./config/ChatLogic";
import { Tooltip } from "@mui/material";
import { useSelector } from "react-redux";

function ScrollableChat({ messages }) {
  const authState = useSelector((state) => state.auth);
  const id = authState.user._id;
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, i) => (
          <div key={i} style={{ display: "flex" }}>
            <span
              style={{
                backgroundColor: `${
                  message.senderId === id ? "#BEE3F8" : "#B9F5D2"
                }`,
                borderRadius: "10px",
                padding: "5px 15px",
                maxWidth: "75%",
                // marginLeft: isSameSenderMargin(messages, message, i, id),
                marginTop: 3,
              }}
            >
              {message}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
