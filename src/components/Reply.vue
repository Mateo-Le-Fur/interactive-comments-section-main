<script setup lang="ts">
import type { RepliesInterface } from "@/interfaces/Comments.interface";
import type { CurrentUserInterface } from "@/interfaces/CurrentUser.interface";
import ReplyToResponse from "./ReplyToResponse.vue";
import { reactive, ref } from "vue";

defineProps<{
  reply: RepliesInterface[];
  currentUser: CurrentUserInterface;
}>();

const emit = defineEmits<{
  (e: "deleteReply", id: number): void;
  (e: "updateReply", obj: object): void;
  (e: "replyToComment", obj: object): void;
  (e: "replyToResponse", obj: object): void;
}>();

const state = reactive<{
  deletePopup: boolean;
  isReplyActive: boolean;
}>({
  deletePopup: false,
  isReplyActive: false,
});

const replyId = ref<number>();
const commentId = ref<number>();
const textAreaValue = ref<string>("");
</script>

<template>
  <div
    v-for="data of reply"
    :key="data.id"
    class="d-flex flex-column replies-container"
  >
    <div class="reply-container d-flex f p-20">
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
            <img v-bind:src="`./src/${data.user.image.png}`" alt="avatar" />
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
            @click="(state.isReplyActive = true), (replyId = data.id)"
            class="reply d-flex align-items-center"
          >
            <img src="../images/icon-reply.svg" alt="reply icon" />
            <span>Reply</span>
          </div>
          <div v-else class="edit-delete d-flex align-items-center">
            <div class="d-flex align-items-center">
              <img src="../images/icon-delete.svg" alt="delete icon" />
              <span @click="state.deletePopup = true" class="delete"
                >Delete</span
              >
              <div v-if="state.deletePopup">
                <Teleport to="body">
                  <div @click="state.deletePopup = false" class="calc"></div>
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
                    <button
                      @click="state.deletePopup = false"
                      class="no-cancel"
                    >
                      NO, CANCEL
                    </button>
                    <button
                      @click="
                        emit('deleteReply', data.id),
                          (state.deletePopup = false)
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
        <div class="comment">
          <p v-if="commentId !== data.id">
            <span class="replying-to">@{{ data.replyingTo }}</span>
            {{ data.content }}
          </p>
          <div class="update-comment d-flex flex-column" v-else>
            <textarea
              @input="textAreaValue = $event.target.value"
              :value="textAreaValue"
            ></textarea>
            <button
              @click="
                emit('updateReply', { id: data.id, text: textAreaValue }),
                  (commentId = null)
              "
            >
              UPDATE
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="reply-to-response d-flex"
      v-if="replyId === data.id && state.isReplyActive"
    >
      <ReplyToResponse
        @reply-to-response="emit('replyToResponse', $event)"
        @is-reply-active="state.isReplyActive = false"
        :id="data.id"
        :current-user="currentUser"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./src/assets/comment-container";

.replies-container {
  gap: 20px;
  align-items: flex-end;
}

.reply-container {
  background-color: white;
  width: 95%;
  border-radius: 10px;
}

.reply-to-response {
  width: 95%;
}
</style>
