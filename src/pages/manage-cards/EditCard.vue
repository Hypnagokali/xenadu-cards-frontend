<template>
  <q-page>
    <div>
      <h4 class="title_subtitle">{{ title }}</h4>
      <h4 class="subtitle">... Card set '{{ cardSet.name }}'</h4>
      <q-card style="max-width: 94vw" class="row" v-if="card.id > 0">
        <q-card-section>
          <strong>Card assigned to lessons:</strong>
          <p>
            {{ outputLessonNames }}
          </p>
        </q-card-section>
        <div class="row justify-end q-pr-sm q-pb-sm" style="width: 100%">
          <q-btn
            color="primary"
            outline
            size="sm"
            label="Manage lessons"
            @click="manageLessons()"
          />
        </div>
      </q-card>
    </div>
    <div>
      <q-card style="max-width: 94vw" class="q-mt-xl">
        <q-card-section>
          <div class="row">
            <div class="col-12" style="text-align: center">
              <span style="font-size: x-large">Front</span>
            </div>
          </div>
          <div class="row q-pb-sm">
            <div class="col-12">
              <q-input
                v-model="card.front"
                type="textarea"
                rows="3"
                input-class="text-center"
                style="background-color: white; font-size: large"
                outlined
              />
            </div>
          </div>
          <div class="row">
            <q-btn
              v-if="card.id > 0"
              outline
              size="sm"
              color="primary"
              label="Alternatives (Front)"
              @click="linkToAlternatives('front')"
            ></q-btn>
          </div>
          <div class="row">
            <div class="col-12" style="text-align: center">
              <span style="font-size: x-large">Back</span>
            </div>
          </div>
          <div class="row q-pb-sm">
            <div class="col-12">
              <q-input
                v-model="card.back"
                outlined
                type="textarea"
                rows="3"
                input-class="text-center"
                :class="getGenderClass(card)"
                style="font-size: large"
              />
            </div>
          </div>
          <div class="row q-pb-lg">
            <q-btn
              v-if="card.id > 0"
              size="sm"
              outline
              color="primary"
              label="Alternatives (Back)"
              @click="linkToAlternatives('back')"
            ></q-btn>
          </div>
          <div class="row">
            <div class="col-12 q-gutter-sm">
              <q-checkbox v-model="card.noun" label="noun" />
              <template v-if="card.noun">
                <q-radio v-model="card.gender" val="n" label="n" />
                <q-radio v-model="card.gender" val="f" label="f" />
                <q-radio v-model="card.gender" val="m" label="m" />
              </template>
            </div>
          </div>
          <div class="row">
            <div class="col-12 q-mb-sm">
              <q-input
                v-model="card.additionalInfos"
                label="additional info / declination / conjugation"
                outlined
                type="textarea"
              />
            </div>
          </div>
          <div class="q-mb-md row">
            <div class="col-12">
              <q-input
                v-model="card.hint"
                label="hint (can be displayed during learning)"
                outlined
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-card
            class="q-mb-md"
            v-for="(link, i) in card.helpfulLinks"
            :key="i"
          >
            <q-card-section>
              <div class="q-mb-xs row" style="justify-content: end">
                <q-btn
                  square
                  flat
                  size="sm"
                  @click="removeLink(i)"
                  icon="close"
                ></q-btn>
              </div>
              <q-input
                class="q-mb-sm"
                outlined
                label="name of link"
                type="text"
                v-model="link.name"
              />
              <q-input outlined label="link" type="text" v-model="link.value" />
            </q-card-section>
          </q-card>

          <!-- Input new helpful link -->
          <hr />
          <div>
            <strong>Add a new helpful link to this card</strong>
            <q-input
              class="q-mb-sm"
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
              class="bg-primary text-white float-right q-mt-sm"
              label="Add link"
            />
          </div>
        </q-card-section>
        <q-card-section class="q-mt-lg">
          <div class="row">
            <div class="col-md-6">
              <q-btn @click="saveCard" class="bg-positive">Save</q-btn>
              <q-btn @click="back()">Cancel</q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, watch, computed } from 'vue';
import { api } from 'src/boot/api';
import { useUserStore } from 'stores/userStore';
import { XenaduNotify } from 'src/composables/xenadu-notify';

class Card {
  constructor() {
    this.id = 0;
    this.front = '';
    this.back = '';
    this.noun = false;
    this.repetitionState = 0;
    this.gender = null; // m, f, n
    this.additionalInfos = '';
    this.helpfulLinks = [];
    this.cardSetId = 0;
  }
}

class HelpfulLink {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.id = 0;
  }

  get empty() {
    return (
      this.name.trim().length === 0 ||
      this.value.trim().length === 0 ||
      this.value.replace(/http(s)?:\/\//, '').trim().length === 0
    );
  }
}

const cardSet = ref({
  name: '',
});

const card = ref(new Card());
const lessonNames = ref([]);

const user = ref({
  id: 0,
});

const setCardAttributes = (cardSetId, cardId) => {
  if (cardId == 0) {
    console.log('new card');
    card.value = new Card();
    return;
  }
  api
    .get(`/api/card-sets/${cardSetId}/cards/${cardId}`)
    .then((res) => {
      console.log(res.data);
      card.value = res.data;
    })
    .then(() => {
      if (cardId > 0) {
        api
          .get(`/api/card-sets/${cardSetId}/cards/${cardId}/lessons`)
          .then((res) => {
            lessonNames.value = res.data.map((l) => l.name);
          })
          .catch(() => {
            XenaduNotify.error('Could not retrieve lessons for this card.');
          });
      }
    })
    .catch((err) => console.log(err));
};

export default {
  name: 'EditCard',

  setup() {
    const userStore = useUserStore();
    const newLink = ref(new HelpfulLink('', 'https://'));
    const route = useRoute();
    const router = useRouter();
    const cardSetId = parseInt(route.params.cardSetId);
    const cardId = parseInt(route.params.cardId);

    const lessonId = route.params.lessonId;
    const isLesson = !!lessonId;

    const title = cardId === 0 ? 'Add Card' : 'Edit Card';
    console.log(cardId === 0);

    const outputLessonNames = computed(() => lessonNames.value.join(', '));

    onMounted(() => {
      if (isLesson) {
        console.log('--- Lesson View ---');
      }

      userStore
        .getCurrentOrFetchUser()
        .then((fetchedUser) => {
          user.value = fetchedUser;
          console.log('Lese User: ', user.value);

          api
            .get(`/api/card-sets/${cardSetId}`)
            .then((res) => {
              cardSet.value = res.data;
            })
            .catch((err) => console.log(err));

          setCardAttributes(cardSetId, cardId);
        })
        .catch((e) => {
          console.error(e);
          console.error('Fehler beim Laden des Users');
        });
    });

    watch(
      () => card.value.noun,
      function (newVal) {
        console.log('changed: ', newVal);
        if (newVal && card.value.gender == null) {
          card.value.gender = 'n';
        } else if (!newVal) {
          card.value.gender = null;
        }
      }
    );

    const loadCard = function (card) {
      showEditDialog.value = true;
    };

    return {
      card,
      cardSet,
      title,
      newLink,
      outputLessonNames,
      linkToAlternatives(cardSide = 'back') {
        router.push({
          name: 'alternatives',
          params: {
            cardSetId,
            cardId,
            cardSide,
          },
        });
      },
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
        if (
          card.value.front.trim().length === 0 ||
          card.value.back.trim().length === 0
        ) {
          XenaduNotify.warning(
            'Cannot save empty Card. Back and Front must be filled'
          );
          return;
        }

        const routeAfterSafe = isLesson ? 'manageCardsInLesson' : 'manageCards';

        if (cardId > 0) {
          // PUT
          api
            .post(`/api/card-sets/${cardSetId}/cards/${cardId}}`, card.value)
            .then((res) => {
              router.push({ name: routeAfterSafe, params: { cardSetId } });
            })
            .catch(() => {
              XenaduNotify.error('Could not update card :(');
            });
        } else {
          api
            .post(`/api/card-sets/${cardSetId}/cards`, card.value)
            .then((res) => {
              if (isLesson) {
                api
                  .post(
                    `/api/card-sets/${cardSetId}/lessons/${lessonId}/assign/${res.data.id}`
                  )
                  .then(() => {
                    router.push({
                      name: routeAfterSafe,
                      params: { cardSetId },
                    });
                  })
                  .catch(() => {
                    XenaduNotify.error('Could not assign card to lesson.');
                  });
              } else {
                router.push({ name: routeAfterSafe, params: { cardSetId } });
              }
            })
            .catch((e) => {
              console.log(e);
              XenaduNotify.error('Could not create card :(');
            });
        }
      },
      manageLessons() {
        if (isLesson) {
          router.push({ name: 'assignToLessonsInLesson', cardSetId });
        } else {
          router.push({ name: 'assignToLessons', cardSetId });
        }
      },
      back() {
        if (isLesson) {
          router.push({ name: 'manageCardsInLesson', cardSetId });
        } else {
          router.push({ name: 'manageCards', cardSetId });
        }
      },
      getGenderClass(card) {
        if (!card.noun) return '';
        if (card.gender === 'm') return 'masculine';
        if (card.gender === 'f') return 'feminine';
        if (card.gender === 'n') return 'neuter';
      },
    };
  },
};
</script>
