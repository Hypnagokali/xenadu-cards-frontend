<template>
  <div>
    <h3>Manage Lessons</h3>

    <div class="row q-mb-sm q-mr-sm">
      <div class="col-12">
        <q-btn
          class="float-right"
          label="New Lesson"
          @click="showCreateUpdateDialog = true"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <q-table
          :grid="$q.screen.lt.sm"
          title="Card-Sets"
          :columns="columns"
          :rows="lessons"
          row-key="id"
        >
          <template v-slot:body-cell-actions>
            <q-td>
              <q-btn class="float-right" flat icon="delete" />
              <q-btn class="float-right" flat icon="edit" />
              <q-btn class="float-right" flat icon="source" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
    <create-update-dialog
      @reset="reset()"
      resource="Lesson"
      :id="0"
      :show="showCreateUpdateDialog"
    >
      <template v-slot:inputElements>
        <q-input label="Lesson Name" v-model="selectedLesson.name" />
      </template>
    </create-update-dialog>
  </div>
</template>

<script>
import { api } from 'src/boot/api';
import CreateUpdateDialog from 'src/components/CreateUpdateDialog.vue';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { XenaduNotify } from 'src/composables/xenadu-notify';

const columns = [
  {
    name: 'id',
    field: 'id',
    label: 'ID',
    sortable: true,
  },
  {
    name: 'name',
    field: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    name: 'numberOfCards',
    field: 'cards',
    label: 'Number of Cards',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Action',
  },
];

const lessons = ref([
  {
    id: 23,
    name: 'Lesson 1',
    cards: 50,
  },
  {
    id: 89,
    name: 'Lessons 2',
    cards: 4,
  },
]);

const selectedLesson = ref({
  id: 0,
  name: '',
});

export default {
  name: 'ManageLessons',
  components: {
    CreateUpdateDialog,
  },

  setup() {
    const route = useRoute();
    const cardSetId = route.params.cardSetId;

    const showCreateUpdateDialog = ref(false);
    api
      .get(`/api/card-sets/${cardSetId}/lessons`)
      .then((res) => {
        lessons.value = res.data;
      })
      .catch((e) => {
        XenaduNotify.error('could not retrieve lessons');
      });

    return {
      columns,
      lessons,
      selectedLesson,
      showCreateUpdateDialog,
      reset() {
        showCreateUpdateDialog.value = false;
      },
    };
  },
};
</script>
