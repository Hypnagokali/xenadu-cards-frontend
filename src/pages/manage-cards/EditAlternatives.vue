<template>
  <q-page class="q-mt-lg">
    <div>
      <h4 class="title_subtitle">Alternatives for</h4>
      <h4 class="subtitle">... '{{ word }}'</h4>
    </div>
    <div class="row q-mb-xs">
      <div class="offset-8 col-4">
        <q-btn
          label="<< Back"
          color="warning"
          :to="{ name: 'editCard', params: { cardSetId, cardId } }"
        ></q-btn>
      </div>
    </div>
    <q-card style="max-width: 94vw; min-height: 60vh">
      <q-card-section>
        <div class="row">
          <q-list bordered separator>
            <q-item
              class="alternative-answer"
              v-for="alternative in alternatives"
              :key="alternative.id"
            >
              <q-item-section>
                <div class="row">
                  <div class="col-10">{{ alternative.answer }}</div>
                  <div class="col-2">
                    <q-btn
                      size="sm"
                      class="float-right"
                      icon-right="delete"
                      @click="remove(alternative.id)"
                    ></q-btn>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { api } from 'src/boot/api';
import { useRoute } from 'vue-router';
import { XenaduNotify } from 'src/composables/xenadu-notify';
import { getCardSet } from 'src/composables/api/cardApi';

const alternatives = ref([]);
const card = ref({
  front: '',
  back: '',
});

export default {
  name: 'EditAlternatives',

  setup() {
    const route = useRoute();
    const cardSetId = route.params.cardSetId;
    const cardId = route.params.cardId;
    const cardSide = route.params.cardSide;
    console.log('cardSide', cardSide);
    const word = ref('Example');

    const cardSetCall = getCardSet(cardSetId);

    const cardCall = cardSetCall.getCard(cardId);

    cardCall.retrieve().then((c) => {
      card.value = c;

      if (cardSide.toLowerCase() === 'back') {
        console.log('show back');
        word.value = card.value.back;
      } else {
        console.log('show front', cardSide);
        console.log('cardSide', cardSide);
        word.value = card.value.front;
      }
    });

    const alternativeCall = cardCall.getAlternatives(cardSide);

    alternativeCall
      .retrieve()
      .then((alts) => {
        alternatives.value = alts;
        console.log(alternatives.value);
      })
      .catch(() => {
        XenaduNotify.error('Could not retrieve alternatives');
      });

    return {
      cardSetId,
      cardId,
      word,
      alternatives,
      remove(altId) {
        alternativeCall.deleteById(altId).then(() => {
          const index = alternatives.value.findIndex((alt) => alt.id === altId);
          alternatives.value.splice(index, 1);
          XenaduNotify.info('Alternative answer removed');
        });
      },
    };
  },
};
</script>
