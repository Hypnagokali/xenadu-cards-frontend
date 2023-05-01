<template>
  <q-dialog v-model="isShow" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ resource }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <!-- SLOT: input elements-->
        <slot name="inputElements"></slot>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" @click="reset()" />

        <q-btn
          v-if="resourceAction === actions.CREATE"
          flat
          :label="`Add ${resource}`"
          @click="create()"
        />
        <q-btn
          v-if="resourceAction === actions.UPDATE"
          flat
          :label="`Update ${resource}`"
          @click="update()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { XenaduNotify } from 'src/composables/xenadu-notify';

// TODO: give the whole object to the dialog.
const props = defineProps({
  resource: String,
  id: Number,
  show: Boolean,
});

const emit = defineEmits(['reset', 'create', 'update']);

const isShow = computed(() => {
  return props.show;
});

const actions = {
  CREATE: 'create',
  UPDATE: 'update',
};

const resourceAction = computed(() => {
  console.log(props.id);
  if (props.id == null) {
    XenaduNotify.error('Something is wrong with the resource');
  } else if (props.id > 0) {
    return actions.UPDATE;
  }

  return actions.CREATE;
});

const reset = function () {
  emit('reset');
};

const create = function () {
  emit('create');
};

const update = function () {
  emit('update');
};

const getAction = function () {
  if (actions.CREATE) {
    return create;
  } else {
    return update;
  }
};
</script>
