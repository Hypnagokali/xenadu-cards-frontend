<template>
  <q-dialog v-model="isShow" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="report_problem" color="primary" text-color="white" />
        <span class="q-ml-sm">
          {{ confirmMessage }}
        </span>
        <br />
        <p class="q-ml-sm">
          {{ warning }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="cancelLabel" color="secondary" @click="cancel()" />
        <q-btn flat :label="confirmLabel" color="negative" @click="confirm()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'ConfirmDialog',
  props: {
    confirmMessage: String,
    confirmLabel: String,
    cancelLabel: String,
    warning: String,
    show: Boolean,
  },
  emits: ['onConfirm', 'onCancel'],
  setup(props, { emit }) {
    const isShow = computed(() => props.show);

    return {
      isShow,
      confirm() {
        emit('onConfirm');
      },
      cancel() {
        emit('onCancel');
      },
    };
  },
});
</script>
