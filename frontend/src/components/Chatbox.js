import React from "react";
import { ChatState } from "../context/Chatprovider";

function Chatbos() {
  const { user } = ChatState();
  return (
    <div>
      {user.name}
      {user.email}
    </div>
  );
}

export default Chatbos;
