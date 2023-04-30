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
          <template v-slot:body-cell-actions="rowProps">
            <q-td>
              <q-btn class="float-right" flat icon="delete" />
              <q-btn
                class="float-right"
                flat
                icon="edit"
                @click="openEdit(rowProps)"
              />
              <q-btn class="float-right" flat icon="source" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
    <create-update-dialog
      @reset="reset()"
      @create="create()"
      @update="update()"
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
import Lesson from 'src/classes/lesson';
import { createLesson, getLessons } from 'src/composables/api/lessonApi';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
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

const lessons = ref([]);

const selectedLesson = ref(new Lesson());

export default {
  name: 'ManageLessons',
  components: {
    CreateUpdateDialog,
  },

  setup() {
    const route = useRoute();
    const cardSetId = route.params.cardSetId;

    const showCreateUpdateDialog = ref(false);

    getLessons(cardSetId)
      .retrieve()
      .then((retrievedLessons) => {
        lessons.value = retrievedLessons;
      })
      .catch((e) => {
        console.log(e);
        XenaduNotify.error('Could not retrieve lessons');
      });

    return {
      columns,
      lessons,
      selectedLesson,
      showCreateUpdateDialog,
      openEdit(rowProps) {},
      reset() {
        selectedLesson.value = new Lesson();
        showCreateUpdateDialog.value = false;
      },
      update() {
        console.log('do update');
      },
      create() {
        createLesson(cardSetId)
          .create(selectedLesson.value)
          .then((newLesson) => {
            lessons.value.push(newLesson);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => this.reset());
      },
    };
  },
};
</script>
