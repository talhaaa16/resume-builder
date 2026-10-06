import axios from "axios";

const API = `${process.env.REACT_APP_API_URL || ""}/api/chat`;

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getChatStatus = () => axios.get(`${API}/status`, authHeaders()).then(r => r.data);

export const sendChatMessage = (message, conversationId) =>
  axios.post(`${API}/message`, { message, conversationId }, authHeaders()).then(r => r.data);

export const getConversations = () => axios.get(`${API}/conversations`, authHeaders()).then(r => r.data);

export const getConversation = (id) => axios.get(`${API}/conversations/${id}`, authHeaders()).then(r => r.data);

export const deleteConversation = (id) => axios.delete(`${API}/conversations/${id}`, authHeaders()).then(r => r.data);

export const setMessageFeedback = (id, feedback) =>
  axios.patch(`${API}/messages/${id}/feedback`, { feedback }, authHeaders()).then(r => r.data);
