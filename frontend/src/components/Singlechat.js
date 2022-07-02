import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import Lottie from "react-lottie";
import {
  FormControl,
  IconButton,
  Image,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import animationdata from "./typing.json";
import React, { useState, useEffect } from "react";
import { getSenderFull, getSender } from "../config/Chatlogics";
import { ChatState } from "../context/Chatprovider";
import ProfileModal from "./Profilemodel";
import UpdateGroupChatModal from "./Updategroupmodal";
import "./styles.css";
import axios from "axios";
import Scrollablechat from "./Scrollablechat";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ fetchagain, setfetchagain }) => {
  const Toast = useToast();
  const [message, setmessage] = useState([]);
  const [socketconnected, setsocketconnected] = useState(false);
  const [loading, setloading] = useState(false);
  const [newmessage, setnewmessage] = useState();
  const [typing, settying] = useState(false);
  const [istyping, setistyping] = useState(false);
  const { user, selectedChat, setSelectedChat, setNotification, notification } =
    ChatState();
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setsocketconnected(true));
    socket.on("typing", () => setistyping(true));
    socket.on("stop typing", () => setistyping(false));
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationdata,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
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

      setmessage(data);
      setloading(false);
      socket.emit("join chat", selectedChat._id);
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
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setfetchagain(!fetchagain);
        }
      } else {
        setmessage([...message, newMessageRecieved]);
      }
    });
  });
  const sendmessage = async (e) => {
    if (e.key === "Enter" && newmessage) {
      socket.emit("stop typing", selectedChat._id);
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
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data);
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

    if (!socketconnected) return;
    if (!typing) {
      settying(true);
      socket.emit("typing", selectedChat._id);
    }
    let lasttypingtime = new Date().getTime();
    var timerlenght = 4000;
    setTimeout(() => {
      var timenow = new Date().getTime();
      var timediff = timenow - lasttypingtime;
      if (timediff >= timerlenght && typing) {
        socket.emit("stop typing", selectedChat._id);
        settying(false);
      }
    }, timerlenght);
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
            {message &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchagain={fetchagain}
                    setfetchagain={setfetchagain}
                    fetchMessages={fetchmessages}
                  />
                </>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="90%"
            borderRadius="lg"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="m">
                <Scrollablechat messages={message} />
              </div>
            )}
            <FormControl onKeyDown={sendmessage} isRequired mt={3}>
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                  <div></div>
                </div>
              ) : (
                <div></div>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newmessage}
                onChange={typinghandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="2xl" pb={3} fontFamily="sans-serif">
            ← Click on a user to start chatting
          </Text>
          <Image src="https://assets.website-files.com/615648d3a398bf728fba89dd/61e73aa432f3436316889768_BSE-Top-10-Blogs-Webinars-of-2021-Thumbnail.jpg" />
        </Box>
      )}
    </>
  );
};
export default SingleChat;
