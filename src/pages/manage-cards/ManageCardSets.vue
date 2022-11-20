<template>
  <q-page>
    <div>
      <h3>Manage Card Sets</h3>
    </div>
    <div class="row q-mb-sm">
      <div class="col-md-12">
        <q-btn
          class="float-right"
          label="New Card Set"
          @click="confirmAddOrUpdateCardSet(cardSetActions.ADD, null)"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
      <q-table
        :grid="$q.screen.lt.sm"
        title="Card-Sets"
        :columns="columns"
        :rows="cardSets"
        row-key="id"
      >
        <template v-slot:body-cell-actions="props">
          <q-td>
            <q-btn
              class="float-right"
              flat
              icon="delete"
              @click="confirmDeleteCardSet(props.row)"
            />
            <q-btn
              class="float-right"
              flat
              icon="edit"
              @click="confirmAddOrUpdateCardSet(cardSetActions.UPDATE, props.row)"
            />
            <q-btn
              class="float-right"
              flat
              icon="visibility"
              @click="showCards(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:item="props">
          <div class="q-mb-md" style="width: 90vw">
              <q-card>
                <div class="row">
                  <div class="col-8" @click="showCards(props.row)">
                    <q-card-section>
                      <strong>{{ props.row.name }}</strong>
                    </q-card-section>
                    <q-card-section>
                      Cards: {{ props.row.numberOfCards }}
                    </q-card-section>
                  </div>
                  <div class="col-2">
                    <q-card-section>
                      <q-btn
                        class="float-right"
                        flat
                        icon="edit"
                        @click="editCardSet(props.row)"
                      />
                    </q-card-section>
                  </div>
                  <div class="col-2">
                    <q-card-section>
                      <q-btn
                        class="float-right"
                        flat
                        icon="delete"
                        @click="confirmDeleteCardSet(props.row)"
                      />
                    </q-card-section>
                  </div>
                </div>

              </q-card>
          </div>
        </template>
      </q-table>
    </div>
    </div>
    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="report_problem" color="primary" text-color="white" />
          <span class="q-ml-sm">Do you want to delete the CardSet <strong>{{ selectedCardSet.name }}</strong>?</span>
          <br />
          <p class="q-ml-sm">Warning: all cards will be lost after action "delete"!</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="secondary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteSelectedCardSet()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addOrUpdateCardSetModal" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Name of card set</div>
        </q-card-section>

        <q-card-section class="q-pt-none" v-if="cardSetAction === cardSetActions.ADD">
          <q-input dense v-model="newCardSet.name" autofocus @keyup.enter="addNewCardSet()" />
        </q-card-section>
        <q-card-section class="q-pt-none" v-else>
          <q-input dense v-model="selectedCardSet.name" autofocus @keyup.enter="updateCardSet()" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup @click="resetNewCardSet()"/>
          <q-btn flat label="Add CardSet" @click="addNewCardSet()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { XenaduNotify } from "src/composables/xenadu-notify";
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { useUserStore } from "stores/userStore";

const columns = [
  {
    name: "id",
    label: "ID",
    field: "id",
    sortable: true,
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    sortable: true,
  },
  {
    name: "numberOfCards",
    label: "Number of cards",
    field: "numberOfCards",
    sortable: true,
  },
  {
    name: "actions",
    label: "actions",
  },
];

const cardSets = ref([
  {
    id: 4,
    numberOfCards: 5009,
    name: "Russisch",
  },
  {
    id: 75,
    numberOfCards: 423,
    name: "Englisch",
  },
]);

const cardSetAction = ref("ADD");
const cardSetActions = {
  ADD: "ADD",
  UPDATE: "Update"
};

const confirmDelete = ref(false);

const selectedCardSet = ref({
  name: 'None',
});

const newCardSet = ref({
  id: 0,
  userId: 0,
  name: '',
});

const addOrUpdateCardSetModal = ref(false);

const user = ref({
  id: -1,
});

const handleNew = (user) => {
  newCardSet.value = {
    id: user.id,
    userId: 0,
    name: '',
  };
};

const handleUpdate = (currentCardSet) => {
  if (currentCardSet == null) {
    throw new Error("selectedCardSet may not be null, if action is UPDATE");
  }

  selectedCardSet.value = currentCardSet;
};

const handleUserAndCardErrors = () => {
  if (newCardSet.value.userId === 0) {
    XenaduNotify.error('Benutzer konnte nicht gelesen werden.');
    return;
  }
  // Do axios call
  if (newCardSet.value.name.trim().length === 0) {
    XenaduNotify.warning("CardSet without name cannot be added");
    return;
  }
}


export default defineComponent({
  name: "ManageCardSets",

  setup() {
    const userStore = useUserStore();

    onMounted(() => {
      userStore.getCurrentOrFetchUser()
      .then(fetchedUser => {
        user.value = fetchedUser;
      })
      .catch(() => {
        console.error('Fehler beim Laden des Users');
      });
      console.log('Lese User: ', user.value);
    });

    const router = useRouter();

    const showCards = function (cardSet) {
      router.push(`/manage-card-sets/${cardSet.id}`);
    };

    api.get('/api/card-sets')
    .then(res => {
      console.log(res);
      cardSets.value = res.data;
    }).catch(err => console.log(err));


    return {
      confirmDelete,
      selectedCardSet,
      cardSets,
      columns,
      cardSetActions,
      cardSetAction,
      newCardSet,
      addOrUpdateCardSetModal,
      confirmAddOrUpdateCardSet(action, selectedCardSet = null) {
        addOrUpdateCardSetModal.value = true;
        cardSetAction.value = action;

        if (action === cardSetActions.UPDATE) {
          handleUpdate(selectedCardSet);
        } else {
          handleNew(user);
        }

      },
      resetNewCardSet() {
        newCardSet.value.name = '';
      },
      confirmDeleteCardSet(cardSet) {
        selectedCardSet.value = cardSet;
        confirmDelete.value = true;
      },
      deleteSelectedCardSet() {
        api.delete(`/api/card-sets/${selectedCardSet.value.id}`)
        .then(() => {
          XenaduNotify.info(`CardSet '${selectedCardSet.value.name}' deleted`);
          const index = cardSets.value.findIndex(c => c.id === selectedCardSet.value.id);
          if (index > -1) {
            cardSets.value.splice(index, 1);
          }
        })
        .catch((e) => {
          console.log(e);
          XenaduNotify.error('Action "delete" could not be executed');
        }).finally(() => {
          confirmDelete.value = false;
        });
      },
      editCardSet() {
        addOrUpdateCardSetModal.value = true;
        console.log('do edit');
      },
      addNewCardSet() {
        handleUserAndCardErrors();

        api.post('/api/card-sets', newCardSet.value)
          .then(res => {
            cardSets.value.push(res.data);
          })
          .catch(err => {
            console.log(err);
            XenaduNotify.error('Card set could not be added');
          });

        this.addOrUpdateCardSetModal = false;
        this.resetNewCardSet();
      },
      updateCardSet() {

      },
      showCards,
    };
  },
});
</script>
