import { api } from 'src/boot/axios';

const extractResponse = function (axiosReq) {
  return new Promise((resolve, reject) => {
    axiosReq
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => reject(e));
  });
};

const getCardSet = function (cardSetId) {
  return {
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
