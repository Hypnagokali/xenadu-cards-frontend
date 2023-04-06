<template>
  <q-page class="q-mt-lg">
    <div class="row">
      <h4>Alternatives to "{{ word }}"</h4>
    </div>
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
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { api } from 'src/boot/axios';
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
      word,
      alternatives,
      remove(altId) {
        alternativeCall.deleteById(altId).then(() => {
          XenaduNotify.info('removed');
        });
      },
    };
  },
};
</script>
