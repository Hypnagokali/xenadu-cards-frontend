import { defineStore } from 'pinia';

export const useLearnSessionStore = defineStore('learnSessionStore', {
  state: () => ({
    session: {
      learnSessionId: null,
      currentCard: null,
      spellChecking: false,
      totalNumberOfCards: 0,
      numberOfCardsPassed: 0,
      answerResult: null,
    },
  }),

  getters: {
    learnSessionId(state) {
      return state.session.learnSessionId;
    },
    spellChecking(state) {
      return state.session.spellChecking;
    },
    totalNumberOfCards(state) {
      return state.session.totalNumberOfCards;
    },
    numberOfCardsPassed(state) {
      return state.session.numberOfCardsPassed;
    },
  },

  actions: {
    setSession(sessionObj) {
      this.session = sessionObj;
    },
    setSessionId(sessionId) {
      this.session.learnSessionId = sessionId;
    },
  },
});
