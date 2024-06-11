import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
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
function GroupChatModal({ chats, setChats, children }) {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const authState = useSelector((state) => state.auth);

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
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      alert("Please enter a chat name");
      return;
    }
    try {
      //   create group chat here
      //   const config = {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${authState.token}`,
      //     },
      //   };
      //   const res = await axiosInstance.post(
      //     "/chats",
      //     {
      //       name: groupChatName,
      //       users: JSON.stringify(selectedUsers.map((user) => user._id)),
      //     },
      //     config
      //   );
      //   setChats([res.data, ...chats]);
      setOpen(false);
      handleClose();
      alert("Chat created successfully");
    } catch (error) {
      alert("Error: ", error);
    }
  };

  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      alert("User already selected");
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };

  return (
    <div>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Group Chat
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <MDBInput
              label="Chat Name"
              style={{ marginBottom: "1rem" }}
              //   value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <MDBInput
              label="Search by name or email"
              style={{ marginBottom: "1rem" }}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Box width="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
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
                  onClick={handleDelete}
                >
                  <Typography>{user.name}</Typography>
                </Box>
              ))}
            </Box>
            {loading ? (
              <p>Loading...</p>
            ) : (
              searchResults?.slice(0, 4).map((user) => (
                <Box
                  key={user._id}
                  style={{
                    hover: {
                      backgroundColor: "lightgrey",
                    },
                  }}
                  onClick={() => handleGroup(user)}
                  sx={{ cursor: "pointer" }}
                >
                  <Typography>{user.name}</Typography>
                </Box>
              ))
            )}
          </Typography>
          <MDBBtn onClick={handleSubmit}>Create Chat</MDBBtn>
        </Box>
      </Modal>
    </div>
  );
}

export default GroupChatModal;
