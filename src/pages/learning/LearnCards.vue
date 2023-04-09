<template>
  <q-page>
    <div class="text-center q-mt-md">
      <strong>{{ cardSetName }}</strong>
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
                <div class="text-h5">
                  {{ currentCard.front }}
                </div>
                <div v-if="isShowHint">
                  {{ showHint() }}
                </div>
              </q-card-section>

              <template
                v-if="
                  state === states.CORRECT_ANSWER ||
                  state === states.WRONG_ANSWER
                "
              >
                <q-separator />

                <q-card-section
                  :class="
                    cardAttributes.getGenderClass(currentCard) + ' text-center'
                  "
                >
                  <div class="text-h5">
                    {{ currentCard.back }}
                    {{ cardAttributes.getGenderChar(currentCard) }}
                  </div>
                  <p>{{ additionalInfos() }}</p>
                  <q-list bordered separator v-if="helpfulLinks().length > 0">
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
                </q-card-section>
              </template>

              <q-separator />

              <q-card-section
                v-if="isCorrect()"
                class="bg-positive text-center"
              >
                <q-banner class="">
                  <template v-slot:avatar>
                    <q-icon style="font-size: 4em" name="done" color="green" />
                  </template>
                  <p class="text-h6">Your answer was correct :)</p>
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
                  <p class="text-h6" sytle="word-wrap: break-word;">
                    "{{ answer }}" is not correct
                  </p>
                </q-banner>
              </q-card-section>

              <q-separator />

              <q-card-section
                class="flex justify-center"
                v-if="state === states.WAIT_FOR_ANSWER"
              >
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
                    Dauer:
                    <strong>
                      {{ humanTime(statistics.durationInSeconds) }}
                    </strong>
                  </p>
                  <p>
                    <strong>{{ statistics.correctAnswers }}</strong>
                    {{ getCardGrammar(statistics.correctAnswers) }} correctly
                    answered.
                  </p>
                  <p>
                    <strong>{{ statistics.wrongAnswers }}</strong>
                    {{ getCardGrammar(statistics.wrongAnswers) }} incorrectly
                    answered.
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
              label="Hint"
              color="orange-8"
              @click="isShowHint = true"
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

        <div class="row justify-center">
          <div class="q-pr-sm" v-if="state === states.WRONG_ANSWER">
            <q-btn
              class="float-right"
              icon-right="spellcheck"
              label="Also correct"
              color="red-8"
              @click="addAlternativeAnswer()"
            />
          </div>
          <div>
            <q-btn
              v-if="
                noMoreCardsLeft &&
                state !== states.DONE &&
                state !== states.NOTHING_TO_REPEAT
              "
              class="float-right"
              icon-right="stars"
              label="Finish"
              color="primary"
              @click="finish()"
            />
          </div>
          <div>
            <q-btn
              v-if="
                (state === states.CORRECT_ANSWER ||
                  state === states.WRONG_ANSWER) &&
                totalCards > cardsLearned
              "
              class="float-right"
              icon-right="fast_forward"
              label="Next"
              color="primary"
              @click="next()"
            />
          </div>
        </div>
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
import { ref, onMounted, computed } from 'vue';
import { useLearnSessionStore } from 'stores/learnSessionStore';
import { XenaduNotify } from 'src/composables/xenadu-notify';
import { api } from 'src/boot/api';
import { useRoute, useRouter } from 'vue-router';
import { openURL } from 'quasar';
import cardAttributes from 'src/composables/cardAttributes';

const cardsLearned = ref(0);
const totalCards = ref(100);
const cardSetName = ref('');
/* single card */
const answer = ref('');
const checkBackSide = ref(true);
const isShowHint = ref(false);
const expectedAnswer = ref('');
const answerCommitted = ref(true);

/* statistics */
const statistics = ref({
  correctAnswers: 0,
  wrongAnswers: 0,
  durationInSeconds: 0,
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
  WAIT_FOR_FINISH: 'WAIT_FOR_FINISH',
  DONE: 'DONE',
  NOTHING_TO_REPEAT: 'NOTHING_TO_REPEAT',
};

const state = ref(states.WAIT_FOR_ANSWER);

function init() {
  isShowHint.value = false;
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

    const noMoreCardsLeft = computed(
      () => totalCards.value === cardsLearned.value
    );

    const getLearnSessionFromServer = function (sessionId, onFailure) {
      console.log('SessionId: ', sessionId);
      api
        .get(`/api/learn-session/${sessionId}/current`)
        .then((res) => {
          learnSessionStore.setSession(res.data);
          currentCard.value = res.data.currentCard;
          setValues(learnSessionStore.session);
          if (res.data.currentCard == null) {
            state.value = states.NOTHING_TO_REPEAT;
            learnSessionStore.destroy();
          }
        })
        .catch((e) => {
          if (typeof onFailure === 'function') {
            onFailure();
          } else {
            console.error(e);
          }
        });
    };

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

      if (learnSessionStore.session.cardSetId < 1) {
        if (sessionId) {
          getLearnSessionFromServer(sessionId, function () {
            // onFailure
            redirectToSelectLearnMode();
          });
        } else {
          redirectToSelectLearnMode();
        }
      } else {
        api
          .get(`/api/card-sets/${learnSessionStore.session.cardSetId}`)
          .then((res) => {
            cardSetName.value = res.data.name;
          })
          .catch((e) => XenaduNotify.error('Card set could not be loaded'));

        getLearnSessionFromServer(
          learnSessionStore.learnSessionId,
          function () {
            XenaduNotify.error(
              'Could not retrieve learn session from server :('
            );
          }
        );
        // api
        //   .get(`/api/learn-session/${sessionId}/current`)
        //   .then((res) => {
        //     learnSessionStore.setSession(res.data);
        //     currentCard.value = res.data.currentCard;
        //     setValues(learnSessionStore.session);
        //     if (res.data.currentCard == null) {
        //       state.value = states.NOTHING_TO_REPEAT;
        //     }
        //   })
        //   .catch();
      }
    });

    // console.table(learnSessionStore.session);

    return {
      noMoreCardsLeft,
      isShowHint,
      cardsLearned,
      totalCards,
      currentCard,
      state,
      states,
      answer,
      cardSetName,
      expectedAnswer,
      statistics,
      cardAttributes,
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
          return `Card has repetition state ${currentCard.value.repetitionState}.`;
        }
      },
      addAlternativeAnswer() {
        if (answer.value == null || answer.value.trim().length === 0) {
          XenaduNotify.warning(
            'Cannot add an empty answer to acceptable answers'
          );
          return;
        }
        console.log('------------------- ADD ALTERNATIVE ANSWER');
        // add answer to list of alternatives
        const answerResult = learnSessionStore.getAnswerResult;
        console.log('Answer is also correct: ', answerResult);
        api
          .post(`/api/learn-session/${sessionId}/add-alternative`, answerResult)
          .then((res) => {
            learnSessionStore.setSession(res.data);
            currentCard.value = res.data.currentCard;
            // setValues(learnSessionStore.session);

            XenaduNotify.info('Your answer was added as an alternative answer');
            // cardLearned.value + 1 because the answer was not committed yet
            if (cardsLearned.value + 1 < totalCards.value) {
              console.log('do next');
              this.next();
            } else {
              console.log('do finish');
              this.finish();
            }
          });
      },
      commitAndNext() {
        const answerResult = learnSessionStore.getAnswerResult;
        api
          .post(`/api/learn-session/${sessionId}/commit`, answerResult)
          .then((res) => {
            learnSessionStore.setSession(res.data);
            setValues(learnSessionStore.session);
            if (cardsLearned.value < totalCards.value) {
              this.next();
            } else {
              this.finish();
            }
          });
      },
      // named intern because vue gives a warning when using underscore
      internRetrieveCurrentCard() {
        api
          .get(`/api/learn-session/${sessionId}/current`)
          .then((res) => {
            state.value = states.WAIT_FOR_ANSWER;
            learnSessionStore.setSession(res.data);
            currentCard.value = res.data.currentCard;
            setValues(learnSessionStore.session);
          })
          .catch(() => {
            XenaduNotify.error('Could not retrieve current card');
          });
      },
      commitAnswer(actionAfterCommit = () => {}) {
        answerCommitted.value = true;
        const answerResult = learnSessionStore.getAnswerResult;
        console.log('do API call /commit');
        api
          .post(`/api/learn-session/${sessionId}/commit`, answerResult)
          .then((res) => {
            learnSessionStore.setSession(res.data);
            setValues(learnSessionStore.session);
            console.log('execute action after commit');
            actionAfterCommit();
          });
      },
      next() {
        isShowHint.value = false;
        answer.value = '';
        console.log('state: ' + state.value);
        console.log('learned: ' + cardsLearned.value);
        console.log('total: ' + totalCards.value);
        if (cardsLearned.value < totalCards.value) {
          if (!answerCommitted.value) {
            this.commitAnswer(this.internRetrieveCurrentCard);
          } else {
            this.internRetrieveCurrentCard();
          }
        }
      },
      // named intern because vue gives a warning when using underscore
      internFinishLearnSession() {
        console.log('internFinishLearnSession');
        api
          .post(`/api/learn-session/${sessionId}/finish`)
          .then((res) => {
            console.log('FINISH STATISTICS');
            console.log(res.data);
            learnSessionStore.setSession(res.data);
            console.log('session set again ...');
            statistics.value = learnSessionStore.session.statistics;
            state.value = states.DONE;
            XenaduNotify.info('finished');
          })
          .catch((e) => {
            XenaduNotify.error('Error: Could not finish the session');
          })
          .finally(() => {
            console.log('RESET learnSessionStore');
            learnSessionStore.reset();
          });
      },
      finish() {
        console.log('onFinish');
        if (!answerCommitted.value) {
          console.log('do commit');
          this.commitAnswer(this.internFinishLearnSession);
        } else {
          this.internFinishLearnSession();
        }
      },
      showHint() {
        const hint = learnSessionStore.session.currentCard?.hint;
        return hint ? hint : 'No hint available';
      },
      getCardGrammar(numberOfCards) {
        if (numberOfCards < 2) {
          return 'card was';
        }
        return 'cards were';
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
        answerCommitted.value = false;
        api
          .post(`/api/learn-session/${sessionId}/check`, {
            answer: answer.value,
            checkBackSide: checkBackSide.value,
          })
          .then((res) => {
            cardsLearned.value++;
            // console.table(res.data.answerResult);
            learnSessionStore.setSession(res.data);
            if (res.data.answerResult.isCorrect) {
              state.value = states.CORRECT_ANSWER;
              answerCommitted.value = true;
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
      humanTime(sec) {
        if (sec > 60) {
          const minutes = sec / 60;
          return `${Math.round(minutes)} minutes`;
        } else {
          return `${sec} seconds`;
        }
      },
    };
  },
};
</script>
