<template>
  <q-page>
    <div>
      <h3>Manage Cards: English</h3>
    </div>
    <div>
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
                    <q-btn
                      flat
                      icon="edit"
                      @click="loadCard(props.row)"
                    />
                  </div>
                  <div class="offset-8 col-1">
                    <q-btn
                      flat
                      icon="delete"
                      @click="delete(props.row)"
                    />
                  </div>
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const columns = [
  {
    name: "id",
    label: "ID",
    field: "id",
    sortable: true,
  },
  {
    name: "front",
    label: "Front",
    field: "front",
    sortable: true,
  },
  {
    name: "back",
    label: "Back",
    field: (row) => printField(row),
    sortable: true,
  },
  {
    name: "repState",
    label: "Rep-State",
    field: "repState",
    sortable: true,
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    sortable: true,
  },
];

const cards = ref([
  {
    id: 1,
    front: "Hase",
    back: "rabbit",
    repState: 3,
  },
  {
    id: 2,
    front: "Stadt",
    back: "city",
    repState: 4,
  },
  {
    id: 3,
    front: "setzen/stellen/legen (konjugieren)",
    back: `to put
    I put
    you put
    he/she/it puts
    we put
    you put
    they put`,
    repState: 3,
  },
]);

const printField = function (card) {
  const lf = card.back.indexOf("\n");
  if (lf > -1) {
    return `${card.back.substring(0, lf)}...`;
  }

  return card.back;
};

export default {
  name: "ManageCards",

  setup() {
    const router = useRouter();
    const route = useRoute();
    const cardSetId = route.params.cardSetId;
    const showEditDialog = ref(false);

    // TODO: GET /card-sets/{cardSetId}
    const cardSetName = ref("English");

    const loadCard = function (card) {
      router.push(`/manage-card-sets/${cardSetId}/${card.id}`);
    };

    return {
      filter: ref(""),
      cardSetName,
      cards,
      columns,
      printField,
      loadCard,
      showEditDialog,
    };
  },
};
</script>
