import { Box } from "@mui/material";
import SideDrawer from "./components/SideDrawer";
import MyChats from "./components/MyChats";
import ChatBox from "./components/ChatBox";
import NavBar from "./components/NavBar";
import { MDBRow, MDBCol } from "mdb-react-ui-kit";
import { useState } from "react";
import { useSelector } from "react-redux";
function Support() {
  const authState = useSelector((state) => state.auth);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <NavBar />
      {authState.user.role==='admin' && <SideDrawer
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        chats={chats}
        setChats={setChats}
      />}
      <MDBRow>
        <MDBCol md="4">
          <MyChats
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            chats={chats}
            setChats={setChats}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        </MDBCol>
        <MDBCol md="8">
          <ChatBox
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        </MDBCol>
      </MDBRow>
    </div>
  );
}

export default Support;
