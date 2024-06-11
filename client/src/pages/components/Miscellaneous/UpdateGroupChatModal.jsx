import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useSelector } from "react-redux";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function UpdateGroupChatModal({
  selectedChat,
  setSelectedChat,
  fetchAgain,
  setFetchAgain,
}) {
  const [open, setOpen] = useState(false);
  const authState = useSelector((state) => state.auth);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRename = async () => {
    if (!groupChatName) {
      alert("Please enter a chat name");
      return;
    }
    try {
      //   update group chat here
      //   const config = {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${authState.token}`,
      //     },
      //   };
      //   const res = await axiosInstance.put(
      //     `/chats/${selectedChat._id}`,
      //     { chatName: groupChatName },
      //     config
      //   );
      //   setSelectedChat(res.data);
      //   setFetchAgain(!fetchAgain);
      //   setOpen(false);
    } catch (error) {
      alert("Error: ", error);
    }
    setGroupChatName("");
  };
  const handleDelete = (user) => {};
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      // fetch user data here
      //   const res = await axiosInstance.get(`/users/search?search=${query}`);
      //   setSearchResults(res.data);
      setLoading(false);
    } catch (error) {
      alert("Error: ", error);
    }
  };

  const handleAddUser = (user) => {
    if (selectedChat.users.includes(user)) {
      alert("User already in chat");
      return;
    }
    // Left to Do
    if (selectedChat.groupAdmin._id !== authState.user._id) {
      alert("You are not the admin of this group chat");
      return;
    }
    try {
      //   add user to group chat here
      //   const config = {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${authState.token}`,
      //     },
      //   };
      //   const res = await axiosInstance.put(
      //     `/chats/${selectedChat._id}`,
      //     { user: user._id },
      //     config
      //   );
      //   setSelectedChat(res.data);
      //   setFetchAgain(!fetchAgain);
      //   setOpen(false);
    } catch (error) {
      alert("Error: ", error);
    }
  };
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {selectedChat.chatName.toUpperCase()}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box>
              {selectedChat.users.map((user) => (
                <Box
                  key={user._id}
                  px={2}
                  py={2}
                  borderRadius={10}
                  m={1}
                  mb={2}
                  variant="solid"
                  fontSize={12}
                  backgroundColor="teal"
                  color="white"
                  cursor="pointer"
                  //   onClick={() => handleAddUser(user)}
                >
                  <Typography>{user.name}</Typography>
                </Box>
              ))}
            </Box>
            <MDBInput
              label="Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <MDBBtn onClick={handleRename}>Update</MDBBtn>
            <MDBInput
              label="Add User to group chat"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Box width="100%" display="flex" flexWrap="wrap">
              {searchResults.map((user) => (
                <Box
                  key={user._id}
                  px={2}
                  py={2}
                  borderRadius={10}
                  m={1}
                  mb={2}
                  variant="solid"
                  fontSize={12}
                  backgroundColor="teal"
                  color="white"
                  cursor="pointer"
                  onClick={() => handleAddUser(user)}
                >
                  <Typography>{user.name}</Typography>
                </Box>
              ))}
            </Box>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default UpdateGroupChatModal;
