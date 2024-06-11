import { Box, FormControl, Typography } from "@mui/material";
import { useSelector } from "react-redux";
// import { getSender } from "../../config/ChatLogic";
// import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useEffect, useState } from "react";
import { MDBInput } from "mdb-react-ui-kit";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import axiosInstance from "../../axiosInstance";

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
    newSocket.on("connect", () => {
      let seller;
      if (authState.user._id !== "") {
        seller = authState.seller._id;
      }
      newSocket.emit("registerSeller", seller);
    });
    // console.log(newSocket.so);
    // Listen for incoming messages

    // console.log(`chat message ${selectedChat._id}`);
    // newSocket.on(
    //   `chat message ${authState.user._id} ${selectedChat._id}`,
    //   (message) => {
    //     console.log("message recieved", message);
    //     setMessages((prevMessages) => [...prevMessages, message]);
    //   }
    // );
    // newSocket.on(
    //   `chat message ${selectedChat._id} ${authState.user._id}`,
    //   (message) => {
    //     console.log("message recieved", message);
    //     setMessages((prevMessages) => [...prevMessages, message]);
    //   }
    // );

    newSocket.on("broadcast message", (data) => {
      console.log("message recieved", data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    // Clean up function to disconnect socket when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [selectedChat]);

  const sendMessage = (e) => {
    // Send message to the server
    
    if (e.key === "Enter" && newMessage) {
      setMessages([...messages, newMessage]);
      socket.emit("broadcast message", {
        message: newMessage,
        adminId: authState.user._id,
      });
      setNewMessage("");
    }
  };

  const fetchMessages = async () => {
    // if (!selectedChat) return;
    try {
      //   // fetch messages here
      const res = await axiosInstance.get(`/chat/broadcast/messages`);
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
        Announcments to Sellers from Admin
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
        {messages.length !== 0 ? (
          <Box overflowY="scroll" height="100%">
            <ScrollableChat messages={messages} />
          </Box>
        ) : (
          <Box overflowY="scroll" height="100%">
            {" "}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography fontSize={{ base: "28px", md: "30px" }}>
                No messages yet
              </Typography>
            </div>
          </Box>
        )}
        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
          {authState.user.role === "admin" && (
            <MDBInput
              label="Enter a message"
              onChange={(e) => typingHandler(e)}
              value={newMessage}
            />
          )}
        </FormControl>
      </Box>
    </>
  );
}

export default SingleChat;
