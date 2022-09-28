<script setup lang="ts">
import type { CurrentUserInterface } from "@/interfaces/CurrentUser.interface";
import { ref } from "vue";
import type { ReplyObj } from "@/interfaces/Reply.interface";

defineProps<{
  id: number;
  currentUser: CurrentUserInterface;
}>();

const emit = defineEmits<{
  (e: "replyToComment", obj: ReplyObj): void;
  (e: "isReplyActive"): void;
}>();

const valueTextArea = ref("");
</script>

<template>
  <div class="send-reply-container d-flex p-20">
    <img :src="`./src/${currentUser.image.png}`" alt="avatar current user" />
    <textarea
      @input="valueTextArea = ($event.target as HTMLInputElement).value"
      class="flex-fill"
    ></textarea>
    <button
      class="p-10"
      @click="
        emit('replyToComment', { id, text: valueTextArea }),
          emit('isReplyActive'),
          (valueTextArea = '')
      "
    >
      REPLY
    </button>
  </div>
</template>

<style scoped lang="scss">
@import "./src/assets/sendComment";
</style>
