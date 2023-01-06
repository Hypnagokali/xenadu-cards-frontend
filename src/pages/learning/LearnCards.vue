<template>
  <q-page>
    <div>
      <h4>You are learning: Russisch</h4>
    </div>
    <div class="container">
      <div>
        <div class="row">
          <div class="col-12">
            <div class="q-pa-md">
              <q-linear-progress
                rounded
                size="20px"
                :value="cardsLearned / totalCards"
                color="green-8"
                class="q-mt-sm"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-center">
            <h6 class="light-header">{{ getCardRepetition() }}</h6>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-card class="question-card">
              <q-card-section class="bg-secondary text-center">
                <div class="text-h5">{{ currentCard.front }}</div>
              </q-card-section>

              <q-separator />

              <q-card-section
                v-if="isCorrect()"
                class="bg-positive text-center"
              >
                <q-banner class="">
                  <template v-slot:avatar>
                    <q-icon style="font-size: 4em" name="done" color="green" />
                  </template>
                  <p class="text-h6">Correct Answer</p>
                </q-banner>
              </q-card-section>

              <q-card-section v-if="isWrong()" class="bg-negative text-center">
                <q-banner class="">
                  <template v-slot:avatar>
                    <q-icon
                      style="font-size: 4em"
                      name="close"
                      color="negative"
                    />
                  </template>
                  <p class="text-h6">
                    {{ expectedAnswer }}
                  </p>
                </q-banner>
              </q-card-section>

              <q-separator />

              <q-card-section class="flex justify-center">
                <div class="container-90">
                  <q-input
                    input-class="text-center"
                    v-model="answer"
                    style="font-size: 1.5rem"
                    type="textarea"
                    outlined
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <div class="row q-mt-lg q-mb-sm q-mr-sm justify-center">
        <div class="q-mr-xl">
          <q-btn
            icon-right="fact_check"
            label="Check"
            color="primary"
            @click="checkAnswer()"
          />
        </div>
        <div>
          <q-btn icon-right="help_outline" label="No Idea" color="orange-8" />
        </div>
        <q-btn
          v-if="answered"
          class="float-right"
          label="Next"
          color="primary"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useLearnSessionStore } from 'stores/learnSessionStore';
import { XenaduNotify } from 'src/composables/xenadu-notify';
import { api } from 'src/boot/axios';

const cardsLearned = ref(0);
const totalCards = ref(100);
const answered = ref(false);
const answer = ref('');
const expectedAnswer = ref('');
const currentCard = ref({
  front: '',
  repetitionState: 0,
  helpfulLinks: [],
  addiitionalInfos: '',
});

const states = {
  WAIT_FOR_ANSWER: 'WAIT_FOR_ANSWER',
  WRONG_ANSWER: 'WRONG_ANSWER',
  CORRECT_ANSWER: 'CORRECT_ANSWER',
};

const state = ref(states.WAIT_FOR_ANSWER);

function init() {
  cardsLearned.value = 0;
  totalCards.value = 100;
  answered.value = false;
  answer.value = '';
  expectedAnswer.value = '';
}

function setValues(learnSession) {
  cardsLearned.value = learnSession.numberOfCardsPassed;
  totalCards.value = learnSession.totalNumberOfCards;
}

export default {
  name: 'LearnCards',

  setup() {
    const learnSessionStore = useLearnSessionStore();
    let sessionId = learnSessionStore.session.learnSessionId;

    if (sessionId == null) {
      let savedSession = sessionStorage.getItem('learnSession');
      if (savedSession) {
        sessionId = savedSession;
      }
    }

    if (sessionId != null) {
      sessionStorage.setItem('learnSession', sessionId);
    } else {
      XenaduNotify.error('No session available');
    }

    onMounted(() => {
      init();
      api
        .get(`/api/learn-session/${sessionId}/current`)
        .then((res) => {
          learnSessionStore.setSession(res.data);
          currentCard.value = res.data.currentCard;
          setValues(learnSessionStore.session);
        })
        .catch();
    });

    console.table(learnSessionStore.session);

    return {
      cardsLearned,
      totalCards,
      currentCard,
      answered,
      answer,
      expectedAnswer,
      isWrong: function () {
        return state.value === states.WRONG_ANSWER;
      },
      isCorrect: function () {
        return state.value === states.CORRECT_ANSWER;
      },
      getCardRepetition() {
        if (currentCard.value.repetitionState === 0) {
          return 'New Card';
        } else {
          return `Card correct answered for ${currentCard.value.repetitionState} times`;
        }
      },
      checkAnswer() {
        api
          .post(`/api/learn-session/${sessionId}/check`, {
            answer: answer.value,
          })
          .then((res) => {
            console.table(res.data.answerResult);
            learnSessionStore.setSession(res.data);
            if (res.data.answerResult.isCorrect) {
              state.value = states.CORRECT_ANSWER;
            } else {
              state.value = states.WRONG_ANSWER;
            }

            expectedAnswer.value = res.data.answerResult.expectedAnswer;
          })
          .catch((e) => {
            XenaduNotify.error('Sorry, but the answer could not be checked.');
          });
      },
    };
  },
};
</script>
