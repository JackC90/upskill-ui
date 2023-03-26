<template>
  <vue-advanced-chat
    :current-user-id="userId"
    :rooms="rooms"
    :messages="messages"
    :room-actions="roomActions"
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
} from "@/plugins/chat";

register();

export default {
  components: {},
  name: "App",
  props: {},
  setup() {
    const userId = ref(null);
    const username = ref(null);
    const rooms = ref([]);
    const currentRoomId = ref(null);
    const currentRoom = ref(null);
    const messages = ref(null);

    onMounted(async () => {
      const _userInfo = await axios.get("/user");
      userId.value = _userInfo.id;
      currentRoomId.value = _userInfo?.lastChatSessionId;
      username.value = _userInfo?.username;

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
      rooms.value = chatSessionsToRooms(get(resp, "[0].data"));

      const _currentRoom = get(resp, "[1].data");
      currentRoom.value = chatSessionToRoom(_currentRoom);

      if (_currentRoom) {
        messages.value = chatsToMessages(_currentRoom.chats);
      }
    });

    return {
      get,
      rooms,
      currentRoom,
      messages,
      roomActions: [{ name: "newSession", title: "New session" }],
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
