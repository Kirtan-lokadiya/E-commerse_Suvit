import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Input, Menu, Tooltip, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useState } from "react";
import axiosInstance from "../../axiosInstance";
import ChatLoading from "./ChatLoading";
import { useSelector } from "react-redux";

function SideDrawer({ selectedChat, setSelectedChat, chats, setChats }) {
  const authState = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSearch = async () => {
    if (!search) {
      alert("Please enter a search term");
      return;
    }
    try {
      setLoading(true);
      // fetch user data here
      const res = await axiosInstance.get(
        `/users-update/search?query=${search}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      // console.log(res.data);
      setSearchResults(res.data);
      setLoading(false);
      setSearch("");
    } catch (error) {
      alert("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    setChats([...chats, userId]);
    setOpen(false);
    // try {
    //   setLoadingChat(true);
    //   // fetch chat data here
    //   //   const config = {
    //   //     headers: {
    //   //       "Content-Type": "application/json",
    //   //       Authorization: `Bearer ${authState.token}`,
    //   //     },
    //   //   };
    //   //   const res = await axiosInstance.post(`/chats/${userId}`,{},config);
    //   //   console.log(res.data);
    //   //   setSelectedChat(res.data
    //   //   if(!chats.find((chat) => chat._id === res.data._id)){
    //   //     setChats([res.data,...chats]);
    //   //   }
    //   setLoadingChat(false);
    // } catch (error) {
    //   alert("Error: ", error);
    // } finally {
    //   setLoadingChat(false);
    // }
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <Typography
        display={{ base: "none", md: "flex", fontSize: "large" }}
        padding={2}
      >
        Search User
      </Typography>
      <Box d="flex" pb={2}>
        <Input
          placeholder="Search by name or email"
          mr={2}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>GO</Button>
      </Box>
      {loading ? (
        <ChatLoading />
      ) : (
        <List>
          {searchResults.map((user) => (
            <ListItem key={user._id}>
              <ListItemButton onClick={() => accessChat(user)}>
                <ListItemText primary={user.firstName} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <>
      {/* <p>Side Drawer</p> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "white",
          width: "100%",
          p: "5px 10px 5px 10px",
          borderWidth: "5px",
        }}
      >
        <Tooltip title="Search for a user" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={toggleDrawer(true)}>
            <FontAwesomeIcon icon={faSearch} />
            <Typography display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Typography>
          </Button>
        </Tooltip>
        <Typography
          display="flex"
          justifyContent="center"
          fontSize="large"
          fontFamily="Work sans"
        >
          Support
        </Typography>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </Box>
    </>
  );
}

export default SideDrawer;
