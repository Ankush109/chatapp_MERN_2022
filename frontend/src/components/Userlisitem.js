import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../context/Chatprovider";

const UserListItem = ({ user, handleFunction }) => {
  //   const { user } = ChatState();

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="twitter.300"
      _hover={{
        background: "orange",
        color: "black",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJnhhZOY_IxRfBAjpON6-TQZRSHejRjLzLqc36imvL7St9E1KhwaU3ohazuUH77QkDdmk&usqp=CAU"
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
