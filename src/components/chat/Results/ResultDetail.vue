<template>
  <div class="resultDetail__container">
    <div class="resultDetail__head">
      <div class="resultDetail__head-title">{{ result.occupation.title }}</div>
      <div class="resultDetail__head-btns">
        <Button
          type="ghost"
          html-type="button"
          class="close-btn"
          @click="() => $emit('close')"
          >Close</Button
        >
      </div>
    </div>
    <div class="resultDetail__body">
      <div class="resultDetail__item-content">
        <div class="resultDetail__item-code">
          O*Net SOC {{ result.occupation.id }}
        </div>
        <div class="resultDetail__item-description">
          {{ result.occupation.description }}
        </div>

        <div class="resultDetail__item-description">
          <ol>
            <li v-for="task in splitTasks" :key="task">
              {{ task }}
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";
import { Button } from "ant-design-vue";

const props = defineProps({
  result: {
    type: Object,
    default: () => {
      return null;
    },
  },
});

// const emit = defineEmits(["close"]);

const splitText = (text) => {
  if (text) {
    return text.split("\n");
  }
  return [];
};

const splitTasks = computed(() => splitText(props.result.occupation.tasks));
</script>

<style scoped>
.resultDetail__container {
  display: block;
  width: 100%;
  height: 100%;
  background: white;
}

.resultDetail__head {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 3rem;
  padding: 0.5rem 0.5rem;
  font-weight: bold;
}

.resultDetail__head-btns {
  padding: 0.25rem 0.25rem;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row;
}

.resultDetail__head-title {
  width: 100%;
  padding: 0.25rem;
}

.resultDetail__body {
  width: 100%;
}

.resultDetail__body-content {
  width: 100%;
}

.resultDetail__item-content {
  width: 100%;
  padding: 0.5rem 0.5rem;
}

.resultDetail__item-title {
  width: 100%;
  display: flex;
  font-weight: bold;
}
.resultDetail__item-code {
  width: 100%;
  font-size: 70%;
  font-weight: light;
}

.resultDetail__item-description {
  width: 100%;
}
</style>
