import { Box, FormControl, Typography } from "@mui/material";
import { useSelector } from "react-redux";
// import { getSender } from "../../config/ChatLogic";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useEffect, useState } from "react";
import { MDBInput } from "mdb-react-ui-kit";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import axiosInstance from "../../../axiosInstance";

const ENDPOINT = "http://192.168.20.173:5000";
let socket, selectedChatCompare;

function SingleChat({
  selectedChat,
  setSelectedChat,
  fetchAgain,
  setFetchAgain,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [socket, setSocket] = useState(null);
  const authState = useSelector((state) => state.auth);

  // useEffect(() => {
  //   socket = io(ENDPOINT);
  //   socket.emit("setup", authState.token);
  //   socket.on("connection", () => {
  //     setSocketConnected(true);
  //   });
  // }, []);
  useEffect(() => {
    // Connect to the server socket
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    // Listen for incoming messages
    if (selectedChat) {
      // console.log(`chat message ${selectedChat._id}`);
      newSocket.on(
        `chat message ${authState.user._id} ${selectedChat._id}`,
        (message) => {
          console.log("message recieved", message);
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      );
      newSocket.on(
        `chat message ${selectedChat._id} ${authState.user._id}`,
        (message) => {
          console.log("message recieved", message);
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      );
    }

    // Clean up function to disconnect socket when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [selectedChat]);

  const sendMessage = (e) => {
    // Send message to the server

    if (e.key === "Enter" && newMessage) {
      console.log({
        senderId: authState.user._id,
        receiverId: selectedChat._id,
        message: newMessage,
      });
      socket.emit("chat message", {
        senderId: authState.user._id, // Replace with the sender's ID
        receiverId: selectedChat._id, // Replace with the receiver's ID
        message: newMessage,
      });
      // console.log(`chat message ${selectedChat._id}`);
      // Clear input field
      setNewMessage("");
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      //   // fetch messages here
      const res = await axiosInstance.get(
        `/chat/history/${selectedChat._id}/${authState.user._id}`
      );
      setMessages(res.data);
      // socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("Error: hii ", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, fetchAgain]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing indicator
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Typography
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily="Work sans"
            pb={3}
            px={3}
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {selectedChat.firstName}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            height="100%"
            width="100%"
            bgcolor="#F8F8F8"
            overflowY="hidden"
          >
            <Box overflowY="scroll" height="100%">
              <ScrollableChat messages={messages} />
            </Box>
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <MDBInput
                label="Enter a message"
                onChange={(e) => typingHandler(e)}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Typography fontSize="large" pb={3}>
            Click on a chat to start
          </Typography>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
