import { defineStore } from 'pinia';

export const useLearnSessionStore = defineStore('learnSessionStore', {
  state: () => ({
    session: {
      sessionId: null,
      spellChecking: false,
      totalNumberOfCards: 0,
      numberOfCardsPassed: 0,
    },
  }),

  getters: {
    sessionId(state) {
      return state.session.sessionId;
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
  },
});
