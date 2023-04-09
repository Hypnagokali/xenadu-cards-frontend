<template>
  <q-page>
    <div>
      <h4>Choose the card set you want to learn</h4>
    </div>
    <div>
      <div class="row q-mb-lg q-mr-sm">
        <div
          class="col-12 q-mb-xl"
          v-for="cardSet in cardSets"
          :key="cardSet.id"
        >
          <div class="row">
            <div class="col-12">
              <q-btn
                color="primary"
                glossy
                :label="cardSet.name"
                class="full-width"
                icon-right="send"
                @click="gotoLearnModeSelection(cardSet)"
              />
            </div>
          </div>
          <div class="row justify-center">
            <span>
              new:
              <strong>{{ cardSet.cardSetInfos.totalNumberOfNewCards }}</strong>
              , cards to repeat:
              <strong>
                {{ cardSet.cardSetInfos.totalNumberOfCardsForRepetition }}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { api } from 'src/boot/api';
import { XenaduNotify } from 'src/composables/xenadu-notify';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const cardSets = ref([]);

export default {
  name: 'SelectCardSet',

  setup() {
    const router = useRouter();
    api
      .get('/api/card-sets')
      .then((res) => {
        cardSets.value = res.data;
      })
      .catch((e) => {
        XenaduNotify.error('Fetching card set not working');
      });

    return {
      cardSets,
      gotoLearnModeSelection: function (cardSet) {
        if (cardSet.numberOfCards > 0) {
          router.push({
            name: 'configModes',
            params: { cardSetId: cardSet.id },
          });
        } else {
          XenaduNotify.warning('There are no cards in this card set.');
        }
      },
    };
  },
};
</script>
