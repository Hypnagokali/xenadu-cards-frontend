import { defineStore } from 'pinia';

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
  }),

  getters: {
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
