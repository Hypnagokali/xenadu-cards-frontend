import { api } from 'boot/api';
import { extractResponse } from 'src/composables/api/extractResponse';

const getCardSet = function (cardSetId) {
  return {
    retrieve: function () {
      return extractResponse(api.get(`/api/card-sets/${cardSetId}`));
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
