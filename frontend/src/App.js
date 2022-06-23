import logo from "./logo.svg";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Chats from "./components/Chats";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;
