<template>
  <q-page>
    <div>
      <h3>Manage Card-Sets</h3>
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
              icon="edit"
              @click="showCards(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:item="props">
          <div class="q-mb-md" style="width: 90vw">
              <q-card @click="showCards(props.row)">
                <q-card-section>
                  <strong>{{ props.row.name }}</strong>
                </q-card-section>
                <q-card-section>
                  Cards: {{ props.row.numberOfCards }}
                </q-card-section>
              </q-card>
          </div>
        </template>
      </q-table>
    </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

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

export default defineComponent({
  name: "ManageCardSets",

  setup() {
    const router = useRouter();
    const showCards = function (cardSet) {
      router.push(`/manage-card-sets/${cardSet.id}`);
    };

    return {
      cardSets,
      columns,
      showCards,
    };
  },
});
</script>
