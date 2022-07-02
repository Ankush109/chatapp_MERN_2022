import { AddIcon, SmallAddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
// import { getSender } from "../config/ChatLogics";
// import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../context/Chatprovider";
import Chatloading from "./Chatloading";
import { getSender } from "../config/Chatlogics";
import GroupChatModal from "./GroupChatModal";
import "./styles.css";
const MyChats = ({ fetchagain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const [loggedUser, setLoggedUser] = useState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchagain]);

  return (
    <Box
      flexDir="column"
      alignItems="center"
      p={3}
      bg="facebook.300"
      w={{ base: "99%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={4}
        px={6}
        fontSize="4xl"
        fontFamily="Work sans"
        d="flex"
        w="90%"
        bg="facebook.300"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            bg="facebook.200"
            py="1"
            px="4"
            rightIcon={<AddIcon />}
          >
            Create New Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="twitter.400"
        w="100%"
        h="90%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <div className="chat-1">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "facebook.300" : "twitter.200"}
                color={selectedChat === chat ? "white" : "black"}
                px={4}
                py={2}
                borderColor="blue.300"
                borderWidth={1}
                borderRadius="lg"
                key={chat._id}
              >
                <Text fontSize="xl">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </div>
        ) : (
          <Chatloading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
