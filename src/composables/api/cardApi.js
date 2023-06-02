import { api } from 'boot/api';
import { extractResponse } from 'src/composables/api/extractResponse';
import Lesson from 'src/classes/lesson';

const getCardSet = function (cardSetId) {
  return {
    retrieve: function () {
      return extractResponse(api.get(`/api/card-sets/${cardSetId}`));
    },

    getLesson: function (lessonId) {
      return {
        retrieve: function () {
          return extractResponse(
            api.get(`/api/card-sets/${cardSetId}/lessons/${lessonId}`),
            Lesson
          );
        },
        assignCard: function (cardId) {
          return api.post(
            `/api/card-sets/${cardSetId}/lessons/${lessonId}/assign/${cardId}`
          );
        },
        removeCard: function (cardId) {
          return api.post(
            `/api/card-sets/${cardSetId}/lessons/${lessonId}/remove/${cardId}`
          );
        },
        getCards: function () {
          return {
            retrieve: function () {
              return extractResponse(
                api.get(`/api/card-sets/${cardSetId}/lessons/${lessonId}/cards`)
              );
            },
          };
        },
      };
    },

    getLessons: function () {
      return {
        retrieve: function () {
          return extractResponse(
            api.get(`/api/card-sets/${cardSetId}/lessons`),
            Lesson
          );
        },
      };
    },

    getCards: function () {
      return {
        retrieve: function () {
          return extractResponse(api.get(`/api/card-sets/${cardSetId}/cards`));
        },
      };
    },

    getCard: function (cardId) {
      return {
        retrieve: function () {
          return extractResponse(
            api.get(`/api/card-sets/${cardSetId}/cards/${cardId}`)
          );
        },
        getAlternatives: function (cardSide) {
          return {
            retrieve: function () {
              return extractResponse(
                api.get(
                  `/api/card-sets/${cardSetId}/cards/${cardId}/${cardSide}`
                )
              );
            },
            deleteById: function (altId) {
              return extractResponse(
                api.delete(
                  `/api/card-sets/${cardSetId}/cards/${cardId}/alternative/${altId}`
                )
              );
            },
          };
        },
        getLessons: function () {
          return {
            retrieve: function () {
              return extractResponse(
                api.get(`/api/card-sets/${cardSetId}/cards/${cardId}/lessons`),
                Lesson
              );
            },
          };
        },
      };
    },
  };
};

// const getCard = function (cardSetId, cardId) {
//   return api.get(`/api/card-sets/${cardSetId}/cards/${cardId}`);
// };

// const getAlternatives = function (cardId, cardSide) {
//   return api.get(`/api/card-sets/${cardSetId}/cards/${cardId}/${cardSide}`);
// };

export { getCardSet };
