import { defineStore } from 'pinia';

export const useLearnModeStore = defineStore('useLearnModeStore', {
  state: () => ({
    learnMode: {
      writeModus: true,
      repsOnly: false,
    },
  }),

  getters: {
    isWriteModus(state) {
      return state.learnMode.writeModus;
    },
    isRepsOnly(state) {
      return state.learnMode.repsOnly;
    },
  },

  actions: {
    setFastModeWithSelfControll() {
      this.learnMode.writeModus = false;
    },
    setRepsOnlyMode() {
      this.learnMode.repsOnly = true;
    },
  }
})
