<template>
  <q-page>
    <div>
      <h5>Manage Cards: {{ cardSet.name }}</h5>
    </div>
    <div>
      <div class="row q-mb-sm q-mr-sm">
        <div class="col-12">
          <q-btn
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
                  Do you want to delete the Card
                  <br />
                  <strong>
                    {{ selectedCard.front }} / {{ selectedCard.back }}?
                  </strong>
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-3"></div>
              <div class="col-9">
                <p class="q-mr-sm">Warning: cannot undo deletion</p>
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
import { ref, onMounted } from 'vue';
import { useUserStore } from 'stores/userStore';
import { useRouter, useRoute } from 'vue-router';
import { api } from 'boot/api';

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
    const showEditDialog = ref(false);

    // TODO: GET /card-sets/{cardSetId}
    const cardSet = ref({
      name: '',
    });

    onMounted(() => {
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

          api
            .get(`/api/card-sets/${cardSetId}/cards`)
            .then((res) => {
              console.log(res.data);
              cards.value = res.data;
            })
            .catch((err) => console.log(err));
        })
        .catch((e) => {
          console.error(e);
          console.error('Fehler beim Laden des Users');
        });
    });

    const loadCard = function (card) {
      router.push(`/manage-card-sets/${cardSetId}/${card.id}`);
    };

    return {
      cardSetId,
      selectedCard,
      confirmDelete,
      filter: ref(''),
      newCard,
      cardSet,
      cards,
      columns,
      printField,
      loadCard,
      showEditDialog,
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
