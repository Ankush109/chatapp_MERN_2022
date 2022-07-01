import { Box } from "@chakra-ui/layout";
import { ChatState } from "../context/Chatprovider";
import { Center, Square, Circle } from "@chakra-ui/react";
import Singlechat from "./Singlechat";
const Chatbox = ({ fetchagain, setfetchagain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Singlechat fetchagain={fetchagain} setfetchagain={setfetchagain} />
    </Box>
  );
};

export default Chatbox;
