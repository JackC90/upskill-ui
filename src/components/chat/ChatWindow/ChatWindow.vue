<template>
  <section class="msger">
    <header class="msger-header">
      <div class="msger-header-title">
        <i class="fas fa-bug"></i> {{ get(chatSession, "name", "") }}
        <i class="fas fa-bug"></i>
      </div>
    </header>

    <main class="msger-chat" :ref="chatWindow">
      <ChatMessage
        v-for="msg in messages"
        :key="msg.id"
        v-bind="msg"
        :username="msg.createdBy === 'user' ? userInfo.id : 'Bot'"
        @select-option="onSelectOption"
      />
    </main>

    <form class="msger-inputarea" @submit="submitMessage">
      <input
        type="text"
        class="msger-input"
        id="textInput"
        placeholder="Enter your message..."
        :ref="messageInput"
      />
      <Button type="submit" class="msger-send-btn">Send</Button>
    </form>
  </section>
</template>

<script>
import { onMounted, ref, watch, onUpdated } from "vue";
import scrollIntoView from "scroll-into-view-if-needed";
import { Button } from "ant-design-vue";
import ChatMessage from "@/components/chat/ChatWindow/ChatMessage.vue";
import get from "lodash.get";

// API
import { getUser } from "@/services/user";
import {
  getChatSession,
  createChat,
  createChatSession,
  deleteChatSession,
} from "@/services/chats";

export default {
  components: {
    ChatMessage,
    Button,
  },
  setup() {
    // Template refs
    const chatWindow = ref(null);
    const messageInput = ref(null);

    const messages = ref([]);
    const userInfo = ref(null);
    const chatSession = ref(null);
    const selectedChatSessionId = ref(null);
    const chatSessionStatus = ref(null);

    onMounted(async () => {
      const _userInfo = await getUser();
      userInfo.value = _userInfo;

      if (userInfo.value?.lastChatSessionId) {
        selectedChatSessionId.value = userInfo.value?.lastChatSessionId;
      } else {
        selectedChatSessionId.value = get(
          await createChatSession({
            name: _userInfo.username,
          }),
          "id"
        );
      }
    });

    watch([selectedChatSessionId], async ([selectedChatSessionId]) => {
      if (chatSession.value?.id !== selectedChatSessionId) {
        const _chatSession = await getChatSession(selectedChatSessionId);
        chatSession.value = _chatSession;
        chatSessionStatus.value = _chatSession?.status;

        if (_chatSession) {
          messages.value = _chatSession.chats;
        }
      }
    });

    const handleCreateChatSession = async () => {
      const _chatSession = await createChatSession({
        name: userInfo.value.username,
      });
      chatSession.value = _chatSession;
      chatSessionStatus.value = _chatSession?.status;

      if (_chatSession) {
        messages.value = _chatSession.chats;
      }
    };

    const handleDeleteChatSession = async (id) => {
      await deleteChatSession(id);
      chatSession.value = null;
      messages.value = [];
    };

    const createMessage = async ({ messageText }) => {
      const res = await createChat({
        chat_session_id: selectedChatSessionId.value,
        message_text: messageText,
      });

      const _messages = [...(messages.value || []), res?.user, res?.bot];
      chatSessionStatus.value = res?.status;
      messages.value = _messages;
    };

    const submitMessage = async (e) => {
      e.preventDefault();
      const messageText = get(e, "target[0].value");
      await createMessage({ messageText });
      e.target[0].value = "";
    };

    const onSelectOption = async (option) => {
      if (option) {
        await createMessage({ messageText: option.label });

        if (messageInput.value) {
          messageInput.value.value = "";
        }
      }
    };

    onUpdated(() => {
      if (chatWindow.value) {
        scrollIntoView(chatWindow.value, {
          behavior: "smoooth",
          block: "end",
          scrollMode: "if-needed",
        });
      }
    });

    return {
      get,
      userInfo,
      messages,
      chatSession,
      handleCreateChatSession,
      handleDeleteChatSession,
      submitMessage,
      onSelectOption,
      chatWindow,
      messageInput,
    };
  },
};
</script>

<style scoped>
:root {
  --body-bg: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  --msger-bg: #fff;
  --border: 2px solid #ddd;
  --left-msg-bg: #ececec;
  --right-msg-bg: #579ffb;
}

html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: var(--body-bg);
}

.msger {
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border: var(--border);
  border-radius: 5px;
  background: var(--msger-bg);
  box-shadow: 0 15px 15px -5px rgba(0, 0, 0, 0.2);
}

.msger-header {
  /* display: flex; */
  font-size: medium;
  justify-content: space-between;
  padding: 10px;
  text-align: center;
  border-bottom: var(--border);
  /* background: #eee; */
  color: #666;
}

.msger-chat {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
.msger-chat::-webkit-scrollbar {
  width: 6px;
}
.msger-chat::-webkit-scrollbar-track {
  background: #ddd;
}
.msger-chat::-webkit-scrollbar-thumb {
  background: #bdbdbd;
}

.msger-inputarea {
  display: flex;
  padding: 10px;
  border-top: var(--border);
}
.msger-inputarea * {
  padding: 10px;
  border: none;
  border-radius: 3px;
  font-size: 1em;
}
.msger-input {
  flex: 1;
  background: #ddd;
}
.msger-send-btn {
  margin-left: 10px;
  background: rgb(0, 196, 65);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.23s;
}
.msger-send-btn:hover {
  background: rgb(0, 180, 50);
}

.msger-chat {
  background-color: #fcfcfe;
  background-image: url("@/assets/images/Job-Board-Header-Background.png");
}
</style>
