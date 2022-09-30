<script setup lang="ts">
import type { CurrentUserInterface } from "@/interfaces/CurrentUser.interface";
import { ref } from "vue";

defineProps<{
  currentUser: CurrentUserInterface;
}>();

const emit = defineEmits<{
  (e: "addComment", text: string): void;
}>();

const valueTextArea = ref<string>("");
</script>

<template>
  <div class="send-container d-flex p-20">
    <img :src="`./src/${currentUser.image.png}`" alt="avatar current user" />

    <textarea
      :value="valueTextArea"
      @input="valueTextArea = ($event.target as HTMLInputElement).value"
      class="flex-fill"
      placeholder="Add a comment..."
    ></textarea>

    <button
      class="p-10"
      @click="emit('addComment', valueTextArea), (valueTextArea = '')"
    >
      SEND
    </button>
  </div>
</template>

<style scoped lang="scss">
@import "./src/assets/send-comment";
</style>
