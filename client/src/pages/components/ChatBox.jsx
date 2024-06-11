import { Box } from "@mui/material";
import SingleChat from "./Miscellaneous/SingleChat";
function ChatBox({ selectedChat, setSelectedChat, fetchAgain, setFetchAgain }) {
  return (
    // <Box
    //   display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
    //   alignItems="center"
    //   flexDirection="column"
    //   p={3}
    //   bgcolor="white"
    //   width={{ base: "100%", md: "68%" }}
    //   borderRadius={10}
    //   borderWidth={1}
    // >
      <SingleChat
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    // </Box>
  );
}

export default ChatBox;
