<template>
  <div>
    <q-card>
      <q-card-section>
        <div>There is still a learn session open</div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          size="0.8em"
          flat
          class="bg-secondary"
          icon="forward"
          label="Resume"
          @click="resume"
        />
        <q-btn
          size="0.8em"
          flat
          class="bg-negative"
          icon="delete"
          label="Close session"
          @click="closeLearnSession"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'BackToLearnSession',
  emits: ['resume', 'close-learn-session'],
  setup(_, { emit }) {
    const router = useRouter();
    return {
      resume() {
        emit('resume');
      },
      closeLearnSession() {
        emit('close-learn-session');
      },
    };
  },
});
</script>
