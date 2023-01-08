<template>
  <q-page>
    <div>
      <h3>{{ languageName }}</h3>
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
                    label="Cards to repeat"
                    type="number"
                    min="0"
                    max="100"
                    v-model="numberOfCardsForRepetition"
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
                :disable="true"
                label="Fast mode (check yourself)"
                v-model="checkMode"
                val="fast"
              />
            </q-card-section>

            <q-separator inset />

            <q-card-section>
              <div class="text-h6">Set your learn mode</div>
              <q-checkbox
                :disable="true"
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
            @click="startLearnSession()"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { XenaduNotify } from 'src/composables/xenadu-notify';
import { useRoute, useRouter } from 'vue-router';
import { useLearnSessionStore } from 'stores/learnSessionStore';

const checkMode = ref('write');
const isRepsOnlyMode = ref(false);
const numberOfNewCards = ref(4);
const numberOfCardsForRepetition = ref(20);

export default {
  name: 'SelectLearnMode',

  setup() {
    const route = useRoute();
    const router = useRouter();
    const cardSetId = route.params.cardSetId;
    const languageName = ref('');

    const learnSessionStore = useLearnSessionStore();

    api
      .get(`/api/card-sets/${cardSetId}`)
      .then((res) => {
        languageName.value = res.data.name;
      })
      .catch((e) => {
        XenaduNotify.error('Could not fetch the CardSet');
      });

    return {
      checkMode,
      isRepsOnlyMode,
      numberOfNewCards,
      numberOfCardsForRepetition,
      languageName,
      startLearnSession: function () {
        api
          .post(`/api/learn-session/card-set/${cardSetId}`, {
            numberOfNewCards: numberOfNewCards.value,
            numberOfCardsForRepetition: numberOfCardsForRepetition.value,
            spellChecking: checkMode.value === 'write',
            onlyRepetition: isRepsOnlyMode.value,
          })
          .then((res) => {
            console.log('success');
            console.table(res.data);

            learnSessionStore.setSession(res.data);

            router.push({ name: 'startLearning', params: { cardSetId } });
          })
          .catch((e) => XenaduNotify.error('Could not create LearnSession'));
      },
    };
  },
};
</script>
