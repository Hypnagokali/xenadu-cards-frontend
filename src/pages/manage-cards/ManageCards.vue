<template>
  <q-page>
    <div>
      <h5>
        Manage Cards: {{ cardSet.name }}
        <p v-if="isLesson && lesson != null" class="subtitle">
          Lesson:
          <strong>{{ lesson.name }}</strong>
        </p>
      </h5>
    </div>
    <div>
      <div class="row q-mb-sm q-mr-sm">
        <div class="row-12">
          <q-btn label="<<" color="warning" @click="back()"></q-btn>
        </div>
      </div>
      <div class="row q-mb-sm q-mr-sm">
        <div class="col-12">
          <q-btn
            v-if="!isLesson"
            label="Manage Lessons"
            icon="view_list"
            color="primary"
            :to="{ name: 'manageLessons', params: { cardSetId } }"
          />
          <q-btn
            class="float-right"
            label="New Card"
            @click="loadCard(newCard)"
          />
        </div>
      </div>
      <q-table
        :grid="$q.screen.lt.sm"
        title="Cards"
        :columns="columns"
        :rows="cards"
        :filter="filter"
        row-key="id"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Suche"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td>
            <q-btn
              class="float-right"
              flat
              icon="delete"
              @click="confirmDeleteCard(props.row)"
            />
            <q-btn
              class="float-right"
              flat
              icon="edit"
              @click="loadCard(props.row)"
            />
            <q-btn
              v-if="isLesson"
              class="float-right"
              flat
              icon="logout"
              @click="removeCardFromLesson(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:item="props">
          <div class="q-mb-md" style="width: 90vw">
            <q-card>
              <q-card-section>{{ props.row.front }}</q-card-section>
              <q-card-actions>
                <div class="row" style="width: 90vw">
                  <div class="col-3">
                    <q-btn flat icon="edit" @click="loadCard(props.row)" />
                  </div>
                  <div class="offset-8 col-1">
                    <q-btn
                      flat
                      icon="delete"
                      @click="confirmDeleteCard(props.row)"
                    />
                  </div>
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>

      <q-dialog v-model="confirmRemove" persistent>
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col-12">
                <p>Do want to remove the card from this lesson?</p>
                <p v-if="selectedCard != null">
                  <strong>
                    {{ selectedCard.front }} / {{ selectedCard.back }}
                  </strong>
                </p>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="secondary" v-close-popup />
            <q-btn
              flat
              label="Remove"
              color="orange-10"
              @click="removeSelectedCard()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="confirmDelete" persistent>
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col-3">
                <q-avatar
                  icon="report_problem"
                  color="primary"
                  text-color="white"
                />
              </div>
              <div class="col-9">
                <p class="q-mr-sm">
                  Delete the following card permanently?
                  <br />
                  <strong>
                    {{ selectedCard.front }} / {{ selectedCard.back }}
                  </strong>
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-3"></div>
              <div class="col-9">
                <p class="q-mr-sm text-red">
                  Warning: deletes card from all lessons and from card set
                </p>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="secondary" v-close-popup />
            <q-btn
              flat
              label="Delete"
              color="negative"
              @click="deleteSelectedCard()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from 'stores/userStore';
import { useRouter, useRoute } from 'vue-router';
import { api } from 'boot/api';
import { getCardSet } from 'src/composables/api/cardApi';
import { XenaduNotify } from 'src/composables/xenadu-notify';

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    sortable: true,
  },
  {
    name: 'front',
    label: 'Front',
    field: 'front',
    sortable: true,
  },
  {
    name: 'back',
    label: 'Back',
    field: (row) => printField(row),
    sortable: true,
  },
  {
    name: 'repState',
    label: 'Rep-State',
    field: 'repetitionState',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    sortable: true,
  },
];

// Refs and constants

const cardActions = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
};

const cards = ref([]);

const newCard = ref({
  id: 0,
});

const selectedCard = ref({
  name: '',
});

const user = ref({
  id: 0,
});

const confirmDelete = ref(false);
const confirmRemove = ref(false);

const printField = function (card) {
  const lf = card.back.indexOf('\n');
  if (lf > -1) {
    return `${card.back.substring(0, lf)}...`;
  }

  return card.back;
};

export default {
  name: 'ManageCards',

  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const route = useRoute();
    const cardSetId = route.params.cardSetId;
    // if managing cards of card set in a lesson:
    const lessonId = route.params.lessonId;
    const isLesson = !!lessonId;

    const lesson = ref(null);

    // const lesson = computed(() => {
    //   if (isLesson) {
    //     return getCardSet(cardSetId).getLesson(lessonId).retrieve;
    //   } else {
    //     return null;
    //   }
    // });

    const showEditDialog = ref(false);

    // TODO: GET /card-sets/{cardSetId}
    const cardSet = ref({
      name: '',
    });

    onMounted(() => {
      if (isLesson) {
        console.log('--- Lesson View ---');
      }
      userStore
        .getCurrentOrFetchUser()
        .then((fetchedUser) => {
          user.value = fetchedUser;
          console.log('Lese User: ', user.value);
        })
        .catch((e) => {
          console.error(e);
          console.error('Fehler beim Laden des Users');
        });

      api
        .get(`/api/card-sets/${cardSetId}`)
        .then((res) => {
          cardSet.value = res.data;
        })
        .catch((err) => console.log(err));

      const cardSetCall = getCardSet(cardSetId);

      console.log('MUH');
      if (isLesson) {
        const lessonCall = cardSetCall.getLesson(lessonId);

        lessonCall
          .getCards()
          .retrieve()
          .then((fetchedCards) => (cards.value = fetchedCards))
          .catch(() => XenaduNotify.error('Cannot fetch cards from lesson'));

        lessonCall
          .retrieve()
          .then((fetchedLesson) => (lesson.value = fetchedLesson));
      } else {
        cardSetCall.getCards();
      }

      const lessonEndpoint = isLesson ? `lessons/${lessonId}/` : '';

      api
        .get(`/api/card-sets/${cardSetId}/${lessonEndpoint}cards`)
        .then((res) => {
          console.log(res.data);
          cards.value = res.data;
        })
        .catch((err) => console.log(err));
    });

    const loadCard = function (card) {
      const routeName = isLesson ? 'editCardInLesson' : 'editCard';
      router.push({
        name: routeName,
        params: {
          cardSetId,
          cardId: card.id,
        },
      });
    };

    return {
      isLesson,
      lesson,
      cardSetId,
      selectedCard,
      confirmDelete,
      filter: ref(''),
      newCard,
      cardSet,
      cards,
      columns,
      confirmRemove,
      printField,
      loadCard,
      showEditDialog,
      removeSelectedCard() {
        const cardSetCall = getCardSet(cardSetId);
        cardSetCall
          .getLesson(lessonId)
          .removeCard(selectedCard.value.id)
          .then(() => {
            const i = cards.value.findIndex(
              (c) => c.id === selectedCard.value.id
            );
            cards.value.splice(i, 1);

            confirmRemove.value = false;
            selectedCard.value = null;
            XenaduNotify.info('Card removed');
          })
          .catch(() => XenaduNotify.error('Could not remove card from lessen'));
      },
      removeCardFromLesson(card) {
        selectedCard.value = card;
        confirmRemove.value = true;
      },
      back() {
        if (isLesson) {
          router.push({ name: 'manageLessons', params: { cardSetId } });
        } else {
          router.push({ name: 'manageCardSets' });
        }
      },
      confirmDeleteCard(card) {
        selectedCard.value = card;
        confirmDelete.value = true;
      },
      deleteSelectedCard() {
        api
          .delete(`/api/card-sets/${cardSetId}/cards/${selectedCard.value.id}`)
          .then(() => {
            const index = cards.value.findIndex(
              (c) => c.id === selectedCard.value.id
            );
            if (index > -1) {
              cards.value.splice(index, 1);
            }
          })
          .catch((e) => {
            console.error(e);
          });
        confirmDelete.value = false;
      },
    };
  },
};
</script>
