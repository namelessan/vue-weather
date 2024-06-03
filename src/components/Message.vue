<template>
  <div :class="['search__error', type]">
    {{ props.message }}
    <svg
      data-v-10aab74f=""
      width="16"
      height="16"
      viewBox="0 0 24 24"
      class="icon-close"
      @click="onCloseMessage"
    >
      <path
        fill="#ffffff"
        d="M 19,6.41L 17.59,5L 12,10.59L 6.41,5L 5,6.41L 10.59,12L 5,17.59L 6.41,19L 12,13.41L 17.59,19L 19,17.59L 13.41,12L 19,6.41 Z "
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { messageType } from '../configs/type.ts';

const props = defineProps<{ type: messageType; message: string }>();
const emit = defineEmits<{ (e: 'closed'): void }>();

const onCloseMessage = () => {
  emit('closed');
};
</script>

<style lang="scss" scoped>
.search__error {
  color: #fff;
  background-color: rgb(226, 56, 56);
  padding: 0.86em;
  padding-right: 1em;
  border-radius: 4pt;
  position: relative;

  &.info {
    background-color: rgba(120, 203, 191, 0.8);
  }
  .icon-close {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }
}
</style>
