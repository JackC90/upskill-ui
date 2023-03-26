export const chatToMessage = (chat) => {
  return {
    _id: chat.id,
    content: chat.messageText,
    username: chat.creaetedBy,
    timestamp: chat.createdAt,
    saved: !!chat.id,
  };
};

export const chatSessionToRoom = (chatSession) => {
  return {
    roomId: chatSession.id,
    roomName: chatSession.name,
    lastMessage: chatSession.chats?.length
      ? chatToMessage(chatSession.chats[chatSession.chats.length - 1])
      : null,
  };
};

export const chatsToMessages = (chats) => {
  if (chats?.length) {
    return chats.map((chat) => chatToMessage(chat));
  }
  return null;
};

export const chatSessionsToRooms = (chatSessions) => {
  if (chatSessions?.length) {
    return chatSessions.map((chatSession) => chatSessionToRoom(chatSession));
  }
  return null;
};
