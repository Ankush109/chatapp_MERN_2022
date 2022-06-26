import { useNavigate } from "react-router-dom";

const { createContext, useState, useEffect, useContext } = require("react");

const chatcontext = createContext();
const Chatprovider = ({ children }) => {
  const [user, setuser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    setuser(userinfo);
    if (!userinfo) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <chatcontext.Provider value={{ user, setuser }}>
      {children}
    </chatcontext.Provider>
  );
};
export const Chatstate = () => {
  return useContext(chatcontext);
};

export default Chatprovider;
