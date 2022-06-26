import { Box } from "@chakra-ui/react";
import React from "react";
import { Chatstate } from "../context/Chatprovider";
import SideDrawer from "./sidedrawer";

function Chats() {
  // const { user } = Chatstate();

  return (
    <div style={{ width: "100%" }}>
      <SideDrawer />
      <Box
        d="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      ></Box>
    </div>
  );
}

export default Chats;
