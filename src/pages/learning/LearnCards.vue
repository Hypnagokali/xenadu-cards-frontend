<template>
  <q-page>
    <div>
      <h4>You are learning: {{ cardSetName }}</h4>
    </div>
    <div class="container">
      <div v-if="state !== states.DONE && state !== states.NOTHING_TO_REPEAT">
        <div class="row">
          <div class="col-12">
            <div class="q-pa-md">
              <q-linear-progress
                rounded
                size="20px"
                :value="cardsLearned / totalCards"
                color="blue-8"
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
                  <p>{{ additionalInfos() }}</p>
                  <q-list bordered separator>
                    <q-item
                      clickable
                      @click="openLink(hl.value)"
                      v-for="(hl, index) in helpfulLinks()"
                      :key="index"
                    >
                      <q-item-section>
                        {{ hl.name }}
                      </q-item-section>
                    </q-item>
                  </q-list>
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
                  <p>{{ additionalInfos() }}</p>
                  <q-list bordered separator>
                    <q-item
                      clickable
                      @click="openLink(hl.value)"
                      v-for="(hl, index) in helpfulLinks()"
                      :key="index"
                    >
                      <q-item-section>
                        {{ hl.name }}
                      </q-item-section>
                    </q-item>
                  </q-list>
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
      <div v-if="state === states.DONE">
        <div class="row">
          <div class="col-12">
            <q-card class="question-card">
              <q-card-section class="bg-secondary text-center">
                <div class="text-h5">Your statistics</div>
                <div>
                  <p>
                    <strong>{{ statistics.correctAnswers }}</strong>
                    correctly answered.
                  </p>
                  <p>
                    <strong>{{ statistics.wrongAnswers }}</strong>
                    answered incorrectly.
                  </p>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div v-if="state === states.NOTHING_TO_REPEAT">
        <div class="row">
          <div class="col-12">
            <q-card class="question-card">
              <q-card-section class="bg-secondary text-center">
                <div class="text-h5">
                  There are currently no cards to repeat
                </div>
                <p>Please come back later or learn new cards</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <div class="row q-mt-lg q-mb-sm q-mr-sm justify-center">
        <div
          class="row"
          v-if="state === states.WAIT_FOR_ANSWER && state !== states.DONE"
        >
          <div class="q-mr-xl">
            <q-btn
              icon-right="fact_check"
              label="Check"
              color="primary"
              @click="checkAnswer()"
            />
          </div>
          <div>
            <q-btn
              icon-right="help_outline"
              label="No Idea (give me a hint)"
              color="orange-8"
            />
          </div>
        </div>
        <q-btn
          v-if="state === states.NOTHING_TO_REPEAT"
          class="float-right"
          icon="chevron_left"
          label="Close learn session"
          color="primary"
          @click="close()"
        />
        <q-btn
          v-if="
            state !== states.WAIT_FOR_ANSWER &&
            totalCards === cardsLearned &&
            state !== states.DONE &&
            state !== states.NOTHING_TO_REPEAT
          "
          class="float-right"
          icon-right="stars"
          label="Finish"
          color="primary"
          @click="finish()"
        />
        <q-btn
          v-if="
            state !== states.WAIT_FOR_ANSWER &&
            state !== states.DONE &&
            totalCards > cardsLearned
          "
          class="float-right"
          icon-right="fast_forward"
          label="Next"
          color="primary"
          @click="next()"
        />
        <q-btn
          v-if="state === states.DONE"
          class="float-right"
          icon-right="change_circle"
          label="One more round, please"
          color="primary"
          @click="restart()"
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
import { useRoute, useRouter } from 'vue-router';
import { openURL } from 'quasar';

const cardsLearned = ref(0);
const totalCards = ref(100);
const cardSetName = ref('');
const answer = ref('');
const expectedAnswer = ref('');
const statistics = ref({
  correctAnswers: 0,
  wrongAnswers: 0,
});

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
  DONE: 'DONE',
  NOTHING_TO_REPEAT: 'NOTHING_TO_REPEAT',
};

const state = ref(states.WAIT_FOR_ANSWER);

function init() {
  cardsLearned.value = 0;
  totalCards.value = 100;
  answer.value = '';
  expectedAnswer.value = '';
  state.value = states.WAIT_FOR_ANSWER;
}

function setValues(learnSession) {
  cardsLearned.value = learnSession.numberOfCardsPassed;
  totalCards.value = learnSession.totalNumberOfCards;
}

export default {
  name: 'LearnCards',

  setup() {
    const router = useRouter();
    const route = useRoute();
    const cardSetId = route.params.cardSetId;

    const learnSessionStore = useLearnSessionStore();

    const redirectToSelectLearnMode = function () {
      router.push({
        name: 'configModes',
        params: { cardSetId },
      });
    };

    console.table(learnSessionStore.session);

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
      redirectToSelectLearnMode();
    }

    onMounted(() => {
      init();

      // todo: check, why learnSessionStore.getCardSetId is not working :,(
      if (learnSessionStore.session.cardSetId < 1) {
        redirectToSelectLearnMode();
      } else {
        api
          .get(`/api/card-sets/${learnSessionStore.session.cardSetId}`)
          .then((res) => {
            cardSetName.value = res.data.name;
          })
          .catch((e) => XenaduNotify.error('Card set could not be loaded'));

        api
          .get(`/api/learn-session/${sessionId}/current`)
          .then((res) => {
            learnSessionStore.setSession(res.data);
            currentCard.value = res.data.currentCard;
            setValues(learnSessionStore.session);
            if (res.data.currentCard == null) {
              state.value = states.NOTHING_TO_REPEAT;
            }
          })
          .catch();
      }
    });

    // console.table(learnSessionStore.session);

    return {
      cardsLearned,
      totalCards,
      currentCard,
      state,
      states,
      answer,
      cardSetName,
      expectedAnswer,
      statistics,
      openLink(link) {
        if (link) {
          openURL(link);
        }
      },
      close() {
        router.push({ name: 'selectCardSet' });
      },
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
      next() {
        answer.value = '';
        console.log('state: ' + state.value);
        console.log('learned: ' + cardsLearned.value);
        console.log('total: ' + totalCards.value);
        if (cardsLearned.value < totalCards.value) {
          api
            .get(`/api/learn-session/${sessionId}/current`)
            .then((res) => {
              state.value = states.WAIT_FOR_ANSWER;
              learnSessionStore.setSession(res.data);
              currentCard.value = res.data.currentCard;
              setValues(learnSessionStore.session);
            })
            .catch();
        }
      },
      finish() {
        statistics.value = learnSessionStore.session.statistics;
        sessionStorage.removeItem('learnSession');
        api
          .post(`/api/learn-session/${sessionId}/finish`)
          .then(() => {
            state.value = states.DONE;
            XenaduNotify.info('finished');
          })
          .catch((e) => {
            XenaduNotify.error('Error: Could not finish the session');
          });
      },
      showHint() {
        const hint = learnSessionStore.currentCard?.hint;
        return hint ? hint : 'No hint available';
      },
      additionalInfos() {
        const infos = learnSessionStore.session.currentCard?.additionalInfos;
        console.table(learnSessionStore.session.currentCard);
        console.log(infos);
        return infos ? infos : '';
      },
      helpfulLinks() {
        const links = learnSessionStore.session.currentCard?.helpfulLinks;

        return links ? links : [];
      },
      checkAnswer() {
        api
          .post(`/api/learn-session/${sessionId}/check`, {
            answer: answer.value,
          })
          .then((res) => {
            cardsLearned.value++;
            // console.table(res.data.answerResult);
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
      restart() {
        redirectToSelectLearnMode();
      },
    };
  },
};
</script>
