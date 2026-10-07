export const OPEN_CHATBOT_EVENT = "open-chatbot";

// Opens Yuva Assistant from anywhere in the app. If a prompt is given and the
// user is logged in, it is sent as the first message.
export const openChatbot = (prompt) => {
  window.dispatchEvent(new CustomEvent(OPEN_CHATBOT_EVENT, { detail: { prompt } }));
};
