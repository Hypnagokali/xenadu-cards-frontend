import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useLearnSessionStore = defineStore('learnSessionStore', {
  state: () => ({
    session: {
      learnSessionId: null,
      cardSetId: -1,
      currentCard: null,
      spellChecking: false,
      totalNumberOfCards: 0,
      numberOfCardsPassed: 0,
      answerResult: null,
    },
    showHint: false,
  }),

  getters: {
    currentCard(state) {
      return state.session.currentCard?.hint;
    },
    getCardSetId(state) {
      return state.session.cardSetId;
    },
    learnSessionId(state) {
      return state.session.learnSessionId;
    },
    spellChecking(state) {
      return state.session.spellChecking;
    },
    totalNumberOfCards(state) {
      return state.session.totalNumberOfCards;
    },
    getAnswerResult(state) {
      console.log('GET answerResult');
      return state.session.answerResult;
    },
    numberOfCardsPassed(state) {
      return state.session.numberOfCardsPassed;
    },
  },

  actions: {
    destroy() {
      if (this.session.learnSessionId != null) {
        api
          .post(
            `/api/learn-session/${this.session.learnSessionId}/finish?cancel=true`
          )
          .then(() => console.log('destroyed ...'));
      }
      this.reset();
    },
    reset() {
      sessionStorage.removeItem('learnSession');

      this.session = {
        learnSessionId: null,
        cardSetId: -1,
        currentCard: null,
        spellChecking: false,
        totalNumberOfCards: 0,
        numberOfCardsPassed: 0,
        answerResult: null,
      };
      this.showHint = false;
    },
    setShowHint(val) {
      this.showHint = val;
    },
    setSession(sessionObj) {
      this.session = sessionObj;
      this.showHint = false;
    },
    setSessionId(sessionId) {
      this.session.learnSessionId = sessionId;
      this.showHint = false;
    },
  },
});
