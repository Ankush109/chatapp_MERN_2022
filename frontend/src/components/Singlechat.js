import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import {
  FormControl,
  IconButton,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { getSenderFull, getSender } from "../config/Chatlogics";
import { ChatState } from "../context/Chatprovider";
import ProfileModal from "./Profilemodel";
import UpdateGroupChatModal from "./Updategroupmodal";
import "./styles.css";
import axios from "axios";
const SingleChat = ({ fetchagain, setfetchagain }) => {
  const Toast = useToast();
  const [message, setmessage] = useState([]);
  const [loading, setloading] = useState(false);
  const [newmessage, setnewmessage] = useState();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const fetchmessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setloading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log(message);
      setmessage(data);
      setloading(false);
    } catch (error) {
      Toast({
        title: "error occured",
        description: "failed to load the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    fetchmessages();
  }, [selectedChat]);
  const sendmessage = async (e) => {
    if (e.key === "Enter" && newmessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewmessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newmessage,
            chatid: selectedChat._id,
          },
          config
        );
        console.log(data);

        setmessage([...message, data]);
      } catch (error) {
        Toast({
          title: "error occured",
          description: "failed to send the messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typinghandler = (e) => {
    setnewmessage(e.target.value);

    /// typing indicator logic will be here
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isgroupchat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatname.toUpperCase()}
                <UpdateGroupChatModal
                  fetchagain={fetchagain}
                  setfetchagain={setfetchagain}
                />
              </>
            )}
          </Text>
          <div className="op">
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <>message</>
            )}
            <FormControl onKeyDown={sendmessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="enter a message"
                onChange={typinghandler}
                value={newmessage}
              />
            </FormControl>
          </div>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;
