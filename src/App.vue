<script setup lang="ts">
import data from "@/data/data.json";
import { reactive } from "vue";
import type { CommentsInterface } from "@/interfaces/Comments.interface";
import Comments from "./components/Comments.vue";
import type { CurrentUserInterface } from "@/interfaces/CurrentUser.interface";
import SendComment from "@/components/SendComment.vue";
import type { ReplyObj } from "@/interfaces/Reply.interface";

const state = reactive<{
  comments: CommentsInterface[];
  currentUser: CurrentUserInterface;
}>({
  comments: data.comments,
  currentUser: data.currentUser,
});

function addComment(text: string): void {
  state.comments.push({
    id: Date.now(),
    content: text,
    score: 0,
    user: state.currentUser,
    replies: [],
  });
}

function replyToComment(obj: ReplyObj): void {
  state.comments.forEach((comment) => {
    if (comment.id === obj.id) {
      comment.replies?.push({
        id: Date.now(),
        content: obj.text,
        replyingTo: comment.user.username,
        score: 0,
        user: state.currentUser,
      });
    }
  });
}

function replyToResponse(obj: ReplyObj): void {
  state.comments.forEach((comment) => {
    comment.replies?.forEach((element) => {
      if (element.id === obj.id) {
        comment.replies?.push({
          id: Date.now(),
          content: obj.text,
          replyingTo: element.user.username,
          score: 0,
          user: state.currentUser,
        });
      }
    });
  });
}

function updateComment(id: number, text: string): void {
  state.comments.forEach((comment) => {
    if (comment.id === id) {
      comment.content = text;
    }
  });
}

function deleteComment(id: number): void {
  state.comments = state.comments.filter((comment) => comment.id !== id);
}

function updateReply(obj: ReplyObj): void {
  state.comments.forEach((comment) => {
    comment.replies?.forEach((element) => {
      if (element.id === obj.id) {
        element.content = obj.text;
      }
    });
  });
}

function deleteReply(id: number): void {
  state.comments.forEach((comment) => {
    comment.replies = comment.replies?.filter((element) => element.id !== id);
  });
}
</script>

<template>
  <main class="app-container d-flex flex-column align-items-center p-30">
    <Comments
      @delete-comment="deleteComment"
      @delete-reply="deleteReply"
      @update-comment="updateComment"
      @update-reply="updateReply"
      @reply-to-comment="replyToComment"
      @reply-to-response="replyToResponse"
      :comments="state.comments"
      :current-user="state.currentUser"
    />
    <SendComment @add-comment="addComment" :current-user="state.currentUser" />
  </main>
</template>

<style lang="scss">
@use "@/assets/mixins" as m;
@import "./assets/base";

.app-container {
  height: 100vh;
  width: 100%;
  gap: 20px;

  @include m.xs {
    height: auto;
  }
}
</style>
