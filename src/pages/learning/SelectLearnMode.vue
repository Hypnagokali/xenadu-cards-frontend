<template>
  <q-page>
    <div>
      <h4>Configure learn mode</h4>
    </div>
    <div>
      <div class="row q-mb-lg q-mr-sm">
        <div class="col-12">
          <q-card bordered class="bg-grey-2 text-black">
            <q-card-section>
              <div class="text-h6">How many cards do you want to learn</div>
              <div class="row">
                <div class="col-md-4 col-12">
                  <q-input
                    label="New cards (if any)"
                    v-model="numberOfNewCards"
                    type="number"
                    min="0"
                    max="100"
                  />
                </div>
                <div class="offset-md-2 col-md-4 col-12">
                  <q-input
                    label="Total cards"
                    type="number"
                    min="0"
                    max="100"
                    v-model="numberOfTotalCards"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row q-mb-lg q-mr-sm">
        <div class="col-12">
          <q-card bordered class="bg-grey-2 text-black">
            <q-card-section>
              <div class="text-h6">Set your check mode</div>
              <q-radio
                label="Write mode (spelling check)"
                v-model="checkMode"
                val="write"
              />
              <q-radio
                disabled
                label="Fast mode (check yourself)"
                v-model="checkMode"
                val="fast"
              />
            </q-card-section>

            <q-separator inset />

            <q-card-section>
              <div class="text-h6">Set your learn mode</div>
              <q-checkbox
                disabled
                label="Repetions only"
                v-model="isRepsOnlyMode"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <div class="row q-mb-lg q-mr-sm">
      <div class="col-12">
        <div class="row justify-center">
          <q-btn
            label="Let me start learning"
            color="primary"
            :to="{ name: 'startLearning', params: { cardSetId: 1 } }"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';

const checkMode = ref('write');
const isRepsOnlyMode = ref(false);
const numberOfNewCards = ref(4);
const numberOfTotalCards = ref(20);

export default {
  name: 'SelectLearnMode',

  setup() {
    return {
      checkMode,
      isRepsOnlyMode,
      numberOfNewCards,
      numberOfTotalCards,
    };
  },
};
</script>
