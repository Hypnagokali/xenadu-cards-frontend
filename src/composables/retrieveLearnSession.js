import { api } from 'src/boot/axios';

export const retrieveLearnSession = function (sessionId, learnSessionStore) {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/learn-session/${sessionId}/current`)
      .then((res) => {
        learnSessionStore.setSession(res.data);
        resolve(learnSessionStore.session);
      })
      .catch((e) => {
        reject();
      });
  });
};
