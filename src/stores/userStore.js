import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: {
      id: 0,
      email: '',
      firstName: '',
      lastName: '',
    }
  }),

  getters: {
    getUser (state) {
      return state.user;
    }
  },

  actions: {
    getCurrentOrFetchUser() {
      return new Promise((resolve, reject) => {
        if (this.user.id > 0) {
          resolve(this.user);
        } else {
          this.retrieveUser()
            .then(() => {
              resolve(this.user);
            })
            .catch(() => {
              reject();
            });
        }
      });
    },
    retrieveUser() {
      return new Promise((resolve, reject) => {
        api.get('/api/user-info')
          .then(userInfo => {
            console.log('User fetched');
            resolve(this.user = userInfo.data);
          })
          .catch(e => {
            console.log('Could not retrieve user: ', e);
            reject(e);
        });
      });

    }
  }
})
