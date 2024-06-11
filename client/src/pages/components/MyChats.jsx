import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { getSender } from "./../config/ChatLogic";
import GroupChatModal from "./Miscellaneous/GroupChatModal";
import axiosInstance from "../../axiosInstance";

function MyChats({
  selectedChat,
  setSelectedChat,
  chats,
  setChats,
  fetchAgain,
  setFetchAgain,
}) {
  const authState = useSelector((state) => state.auth);
  const [loggedUser, setLoggedUser] = useState();
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // fetch chats here
        const res = await axiosInstance.get("/users-update/details", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setChats(res.data);
      } catch (error) {
        alert("Error: ", error);
      }
    };
    setLoggedUser(authState);
    fetchChats();
  }, [authState, fetchAgain, setChats]);
  return (
    <>
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal chats={chats} setChats={setChats}>
          <Button>New Group Chat</Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDirection="column"
        pb={3}
        bgcolor="#F8F8F8"
        width="100%"
        height="100%"
        overflowY="hidden"
      >
        <Stack overflowY="scroll">
          {chats.length !== 0 &&
            chats?.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                px={2}
                py={2}
                bgcolor={
                  selectedChat && selectedChat === chat ? "#3572EF" : "white"
                }
                color={
                  selectedChat && selectedChat === chat ? "white" : "black"
                }
                cursor="pointer"
              >
                <Typography>
                  Chat with {chat.firstName}
                  <br />
                  {chat.email}
                </Typography>
              </Box>
            ))}
        </Stack>
      </Box>
    </>
  );
}

export default MyChats;
