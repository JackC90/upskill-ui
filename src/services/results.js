import axios from "axios";

export const generateResults = async (chatSessionId) => {
  const res = await axios.post("/chat_sessions/" + chatSessionId);
  return res?.data;
};
