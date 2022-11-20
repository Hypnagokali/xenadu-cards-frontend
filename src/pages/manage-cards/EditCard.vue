<template>
  <q-page>
    <div>
      <h4>Edit Card</h4>
    </div>
    <div>
      <q-card style="max-width:94vw;">
        <q-card-section>
          <div class="row">
            <div class="col-12" style="text-align: center">
              <span style="font-size: x-large">Front</span>
            </div>
          </div>
          <div class="row q-pb-lg">
            <div class="col-12">
              <q-input
                v-model="card.front"
                type="textarea"
                input-class="text-center"
                style="background-color: white; font-size: large"
                outlined
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12" style="text-align: center">
              <span style="font-size: x-large">Back</span>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-input
                v-model="card.back"
                outlined
                type="textarea"
                input-class="text-center"
                :class="getGenderClass(card)"
                style="font-size: large"
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
        <q-card-section>
          <div
          class="q-mb-md"
            v-for="(link, i) in card.helpfulLinks"
            :key="i"
          >
            <div class="q-mb-xs row" style="justify-content: end;">
              <q-btn
                @click="removeLink(i)"
                label="x"
              >
              </q-btn>
            </div>
            <q-input
              outlined
              label="name of link"
              type="text"
              v-model="link.name"
            />
            <q-input
              outlined
              label="link"
              type="text"
              v-model="link.value"
            />
          </div>

          <!-- Input new helpful link -->
          <hr>
          <div>
            <strong>Add a new helpful link to this card</strong>
            <q-input
              outlined
              label="name of the new link"
              type="text"
              v-model="newLink.name"
            />
            <q-input
              outlined
              label="link"
              type="text"
              v-model="newLink.value"
            />
            <q-btn
              @click="addHelpfulLink()"
              class="bg-primary text-white float-right"
              label="Add link"
            />
          </div>
        </q-card-section>
        <q-card-section class="q-mt-lg">
          <div class="row">
            <div class="col-md-6">
              <q-btn @click="saveCard" class="bg-positive">Save</q-btn>
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

class HelpfulLink {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.id = 0;
  }

  get empty() {
    return this.name.trim().length === 0
      || (this.value.trim().length === 0
          || this.value.replace(/http(s)?:\/\//, '').trim().length === 0);
  }
}

const card = ref({
  id: 234,
  front: 'trinken',
  back: 'пить',
  isNoun: false,
  repState: 0,
  gender: 'n', // m, f, n
  additionalInfos: 'e-Konjugation mit ё. Regelmäßig\nты пёшь молоко',
  helpfulLinks: [
    {
      id: 1,
      name: 'Weiches Zeichen (Aussprache)',
      value: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Ru-30-%D0%B1%D1%83%D0%BA%D0%B2%D0%B0-%D0%AC.ogg',
    },
    {
      id: 2,
      name: 'Hartes Zeichen (Wikipedia)',
      value: 'https://de.wikipedia.org/wiki/%D0%AA'
    }
  ],
});

export default {
  name: "EditCard",


  setup() {
    const newLink = ref(new HelpfulLink('', 'https://'));
    const route = useRoute();
    const cardSetId = route.params.cardSetId;

    const loadCard = function (card) {
      showEditDialog.value = true;
    };

    return {
      card,
      newLink,
      addHelpfulLink() {
        if (newLink.value.empty) {
          return;
        }
        card.value.helpfulLinks.push(
          new HelpfulLink(newLink.value.name, newLink.value.value)
        );
        newLink.value.name = '';
        newLink.value.value = 'https://';
      },
      removeLink(index = -1) {
        if (index > -1) {
          card.value.helpfulLinks.splice(index, 1);
        }
      },
      saveCard() {
        if (card.value.front.trim().length === 0 || card.value.back.trim().length === 0) {
          return;
        }

        api.get('/some/api/call/1')
          .then(() => console.log('success'))
          .catch(() => console.error('error'));
      },
      getGenderClass(card) {
        if (!card.isNoun) return '';
        if (card.gender === 'm') return 'masculine';
        if (card.gender === 'f') return 'feminine';
        if (card.gender === 'n') return 'neuter';
      },
    };
  },
};
</script>
