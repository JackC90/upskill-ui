<template>
  <vue-advanced-chat
    :current-user-id="userId"
    :rooms="rooms"
    :room-id="currentRoomId"
    :room-info-enabled="true"
    :messages="messages"
    :show-audio="false"
    :show-files="false"
    :height="'calc(100vh - 80px)'"
    :styles="``"
    @fetch-room="fetchRoom"
    @send-message="sendMessage"
  />
</template>

<script>
import { ref, onMounted } from "vue";
import { register } from "vue-advanced-chat";
import axios from "axios";
import get from "lodash.get";
import {
  chatsToMessages,
  chatSessionsToRooms,
  chatSessionToRoom,
  chatToMessage,
} from "@/plugins/chat";

register();

export default {
  components: {},
  name: "App",
  props: {},
  setup() {
    const userId = ref(null);
    const username = ref(null);
    const users = ref([]);
    const rooms = ref([]);
    const currentRoomId = ref(null);
    const currentRoom = ref(null);
    const messages = ref(null);

    onMounted(async () => {
      const _userInfo = await axios.get("/user");
      userId.value = _userInfo?.data?.id;
      currentRoomId.value = _userInfo?.data?.lastChatSessionId;
      username.value = _userInfo?.data?.username;

      const _users = [
        {
          _id: _userInfo?.data?.id,
          username: _userInfo?.data?.username,
          avatar: null,
          status: { state: "online" },
        },
        {
          _id: 0,
          username: "Bot",
          avatar: null,
          status: { state: "online" },
        },
      ];
      users.value = _users;

      // Fetch chats
      // - get all chat sessions
      const promises = [axios.get("/chat_sessions")];
      // - get all messages in last chat session
      if (_userInfo.data?.lastChatSessionId) {
        promises.push(
          axios.get("/chat_sessions/" + _userInfo.data?.lastChatSessionId)
        );
      }
      const resp = await Promise.all(promises);
      rooms.value = chatSessionsToRooms(get(resp, "[0].data"), _users);

      const _currentRoom = get(resp, "[1].data");
      currentRoom.value = chatSessionToRoom(_currentRoom);

      if (_currentRoom) {
        messages.value = chatsToMessages(_currentRoom.chats);
      }
    });

    const fetchRoom = async (e) => {
      console.log(e);
      debugger;
    };

    const sendMessage = async (e) => {
      const messageText = get(e, "detail[0].content");
      const res = await axios.post("/chats", {
        chat_session_id: currentRoomId.value?.id,
        message_text: messageText,
      });
      const _messages = [
        ...(messages.value || []),
        chatToMessage(res?.data?.user),
        chatToMessage(res?.data?.bot),
      ];
      messages.value = _messages;
    };

    return {
      get,
      userId,
      username,
      users,
      rooms,
      currentRoomId,
      currentRoom,
      messages,
      fetchRoom,
      sendMessage,
      // roomActions: [{ name: "newSession", title: "New session" }],
    };
  },
};
</script>

<style>
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #1976d2;
}
</style>
