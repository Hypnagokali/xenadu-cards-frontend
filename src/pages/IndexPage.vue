<template>
  <q-page>
    <div class="row">
      <div class="col-12">
        <h3>Xenadu Learning Cards (x-cards)</h3>
      </div>
    </div>
    <div>
      <div v-for="change in changes" :key="change.changeDate">
        <h5>{{ change.changeDate }}</h5>
        <ul>
          <li v-for="(changeLog, index) in change.changeLogs" :key="index">
            {{ changeLog }}
          </li>
        </ul>
      </div>
    </div>
    <hr />
    <div>
      <div v-for="change in oldChanges" :key="change.changeDate">
        <h5>{{ change.changeDate }}</h5>
        <ul>
          <li v-for="(changeLog, index) in change.changeLogs" :key="index">
            {{ changeLog }}
          </li>
        </ul>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';

const oldChanges = ref({});
const changes = ref([
  {
    changeDate: '2023-01-22',
    changeLogs: [
      'Dialog for resuming or closing an open learn session',
      'Show hint while learning',
      'Show back of card when answered',
    ],
  },
  {
    changeDate: '2023-01-08',
    changeLogs: [
      'First version of Manage-Card-Sets',
      'Learning setup',
      'User can learn in one direction (front -> back)',
      'Simple statistics when finished learning',
      'LearnMode: with spell checking',
    ],
  },
]);

export default defineComponent({
  name: 'IndexPage',

  setup() {
    console.log(changes.value);
    return {
      oldChanges,
      changes,
    };
  },
});
</script>
