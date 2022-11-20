<template>
  <q-page>
    <div>
      <h4>Edit Card Set</h4>
    </div>
    <div>
      <q-card style="max-width:94vw;">
        <q-card-section>
          <div class="row">
            <div class="col-12" style="text-align: center">
              <span style="font-size: x-large">Name of CardSet</span>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-input
                v-model="cardSet.name"
                outlined
                type="text"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-6 q-gutter-sm">
              <q-checkbox v-model="card.isNoun" label="noun"/>
              <template v-if="card.isNoun">
                <q-radio v-model="card.gender" val="n" label="n" />
                <q-radio v-model="card.gender" val="f" label="f" />
                <q-radio v-model="card.gender" val="m" label="m" />
              </template>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-input
                v-model="card.additionalInfos"
                label="additional info / sentences"
                rows="2"
                outlined
                type="textarea"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-mt-lg">
          <div class="row">
            <div class="col-md-6">
              <q-btn @click="saveCardSet" class="bg-positive">Save</q-btn>
              <q-btn v-close-popup>Cancel</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { api } from 'src/boot/axios';


const cardSet = ref({
  id: 0,
  userId: 0,
  name: '',
  cards: [],
  createdAt: null,
  updatedAt: null,
});

export default {
  name: "EditCardSet",


  setup() {
    const newLink = ref(new HelpfulLink('', 'https://'));
    const route = useRoute();
    const cardSetId = route.params.cardSetId;

    return {
      card,
      newLink,
      saveCardSet() {
        if (card.value.front.trim().length === 0 || card.value.back.trim().length === 0) {
          return;
        }
      },
    };
  },
};
</script>
