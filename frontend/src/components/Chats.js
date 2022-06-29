import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../context/Chatprovider";
import Chatbos from "./Chatbox";
import MyChats from "./Mychats";
import Sidedrawer from "./sidedrawer";

function Chats() {
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <Sidedrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats />}
        {user && <Chatbos />}
      </Box>
    </div>
  );
}

export default Chats;
