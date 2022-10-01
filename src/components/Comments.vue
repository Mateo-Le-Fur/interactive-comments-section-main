<script setup lang="ts">
import type { CommentsInterface } from "@/interfaces/Comments.interface";
import Reply from "./Reply.vue";
import ReplyToComment from "./ReplyToComment.vue";

import type { CurrentUserInterface } from "@/interfaces/CurrentUser.interface";
import { ref } from "vue";
import type { ReplyObj } from "@/interfaces/Reply.interface";

defineProps<{
  comments: CommentsInterface[];
  currentUser: CurrentUserInterface;
}>();

const emit = defineEmits<{
  (e: "deleteComment", id: number): void;
  (e: "deleteReply", id: number): void;
  (e: "updateComment", id: number, text: string): void;
  (e: "updateReply", obj: ReplyObj): void;
  (e: "replyToComment", obj: ReplyObj): void;
  (e: "replyToResponse", obj: ReplyObj): void;
}>();

const deletePopup = ref<boolean>(false);
const isReplyActive = ref<boolean>(false);
const replyId = ref<number | null>();
const commentId = ref<number | null>();
const textAreaValue = ref<string>("");
</script>

<template>
  <div class="comments-container d-flex flex-column align-items-center">
    <div
      class="comment-container d-flex flex-column"
      v-for="data of comments"
      :key="data.id"
      :class="{ isReplyActive: isReplyActive && data.id === replyId }"
    >
      <div class="comment d-flex p-20">
        <div
          class="vote d-flex flex-column align-items-center justify-content-center p-10 mr-20"
        >
          <button @click="data.score++" class="mb-10">+</button>
          <p class="count mb-10">{{ data.score }}</p>
          <button @click="data.score--">-</button>
        </div>
        <div class="d-flex flex-column width-100">
          <div class="info-container d-flex mb-20">
            <div class="info d-flex align-items-center">
              <img v-bind:src="`src/${data.user.image.png}`" alt="avatar" />
              <span class="username">{{ data.user.username }}</span>
              <span
                class="my-messages"
                v-if="currentUser.username === data.user.username"
                >you</span
              >
              <span class="created-at">{{ data.createdAt }}</span>
            </div>
            <div
              v-if="currentUser.username !== data.user.username"
              @click="(isReplyActive = !isReplyActive), (replyId = data.id)"
              class="reply d-flex align-items-center"
            >
              <img src="../images/icon-reply.svg" alt="reply icon" />
              <span>Reply</span>
            </div>
            <div v-else class="edit-delete d-flex align-items-center">
              <div class="d-flex align-items-center">
                <img src="../images/icon-delete.svg" alt="delete icon" />
                <span @click="deletePopup = true" class="delete">Delete</span>
                <div v-if="deletePopup">
                  <Teleport to="body">
                    <div @click="deletePopup = false" class="calc"></div>
                  </Teleport>
                  <div
                    class="delete-popup d-flex flex-column justify-content-center p-30"
                  >
                    <h2 class="mb-20">Delete comment</h2>
                    <p class="mb-20">
                      Are you sure you want to delete this comment ? This will
                      remove the comment and can't be undone.
                    </p>
                    <div class="confirm-button d-flex">
                      <button @click="deletePopup = false" class="no-cancel">
                        NO, CANCEL
                      </button>
                      <button
                        @click="
                          emit('deleteComment', data.id), (deletePopup = false)
                        "
                        class="yes-delete"
                      >
                        YES, DELETE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex align-items-center">
                <img src="../images/icon-edit.svg" alt="edit icon" />
                <span
                  @click="(commentId = data.id), (textAreaValue = data.content)"
                  class="edit"
                  >Edit</span
                >
              </div>
            </div>
          </div>
          <div class="text-comment">
            <p v-if="commentId !== data.id">
              {{ data.content }}
            </p>
            <div class="update-comment d-flex flex-column" v-else>
              <textarea
                @input="
                  textAreaValue = ($event.target as HTMLInputElement).value
                "
                :value="textAreaValue"
              ></textarea>
              <button
                @click="
                  emit('updateComment', data.id, textAreaValue),
                    (commentId = null)
                "
              >
                UPDATE
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="replyId === data.id && isReplyActive" class="d-flex">
        <ReplyToComment
          @reply-to-comment="emit('replyToComment', $event)"
          @is-reply-active="isReplyActive = false"
          :id="data.id"
          :current-user="currentUser"
        />
      </div>
      <Reply
        @delete-reply="emit('deleteReply', $event)"
        @update-reply="emit('updateReply', $event)"
        @reply-to-comment="emit('replyToComment', $event)"
        @reply-to-response="emit('replyToResponse', $event)"
        v-if="data.replies?.length"
        :reply="data.replies"
        :current-user="currentUser"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/mixins" as m;
@import "./src/assets/comment-container";

.comments-container {
  height: 90%;
  width: 40%;
  gap: 20px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--Moderate-blue);
    border-radius: 10px;
  }

  @include m.xs {
    overflow-y: unset;
    width: 100%;
  }
}

.comment-container {
  width: 100%;
  gap: 20px;

  @include m.xs {
    width: 100%;
  }

  .comment {
    background-color: white;
    border-radius: 10px;

    @include m.xs {
      position: relative;
      flex-direction: column-reverse;
      gap: 10px;
    }
  }
}

.isReplyActive {
  gap: 5px;
}
</style>
