<template>
  <div class="msg" :class="`${side}-msg`">
    <div class="msg-img" :style="`background-image: url('${image}')`"></div>

    <div class="msg-bubble">
      <div class="msg-info">
        <div class="msg-info-name" :key="userId">{{ username }}</div>
        <div class="msg-info-time">{{ displayTime(dateTime) }}</div>
      </div>

      <div class="msg-text">
        {{ messageText }}
      </div>
    </div>
  </div>
</template>

<script>
import { displayTime } from "@/plugins/display";

export default {
  props: {
    id: {
      type: Number,
    },
    userId: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
    },
    messageText: {
      type: String,
    },
    dateTime: {
      type: String,
    },
  },
  setup(props) {
    const isUser = props.createdBy === "user";
    const username = isUser ? "You" : "Bot";
    const side = isUser ? "right" : "left";
    const image = require(`@/assets/images/${
      isUser ? "people" : "robot"
    }-dialog.png`);

    return { isUser, side, image, username, displayTime };
  },
};
</script>

<style scoped>
.msg {
  --left-msg-bg: #ececec;
  --right-msg-bg: #579ffb;

  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
}

.msg-img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  background: #ddd;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
}
.msg-bubble {
  max-width: 450px;
  padding: 15px;
  border-radius: 15px;
  background: var(--left-msg-bg);
}
.msg-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.msg-info-name {
  margin-right: 10px;
  font-weight: bold;
}
.msg-info-time {
  font-size: 0.85em;
}

.left-msg .msg-bubble {
  border-bottom-left-radius: 0;
}

.right-msg {
  flex-direction: row-reverse;
}
.right-msg .msg-bubble {
  background: var(--right-msg-bg);
  color: #fff;
  border-bottom-right-radius: 0;
}
.right-msg .msg-img {
  margin: 0 0 0 10px;
}
</style>
