<template>
  <div>
    <h5>Manage Lessons</h5>

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
          title="Lessons"
          :columns="columns"
          :rows="lessons"
          row-key="id"
        >
          <template v-slot:body-cell-actions="rowProps">
            <q-td>
              <q-btn
                class="float-right"
                flat
                icon="delete"
                @click="openConfirmDelete(rowProps)"
              />
              <q-btn
                class="float-right"
                flat
                icon="edit"
                @click="openEdit(rowProps)"
              />
              <q-btn
                class="float-right"
                flat
                icon="source"
                @click="editCardsInLesson(rowProps)"
              >
                <q-tooltip>
                  Creates a new card and assignes it to this lesson
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
          <template v-slot:item="props">
            <div class="q-mb-md" style="width: 90vw">
              <q-card @click="editCardsInLesson(props)">
                <div class="row">
                  <div class="col-8">
                    <q-card-section>
                      <strong>{{ props.row.name }}</strong>
                    </q-card-section>
                    <q-card-section>
                      Cards: {{ props.row.cards }}
                    </q-card-section>
                  </div>
                  <div class="col-2">
                    <q-card-section>
                      <q-btn
                        class="float-right"
                        flat
                        icon="edit"
                        @click.stop="openEdit(props)"
                      />
                    </q-card-section>
                  </div>
                  <div class="col-2">
                    <q-card-section>
                      <q-btn
                        class="float-right"
                        flat
                        icon="delete"
                        @click.stop="openConfirmDelete(props)"
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
    <confirm-dialog
      :show="showConfirmDelete"
      :confirm-message="`Do you want to delete the lesson with name: ${selectedLesson.name}`"
      warning="This will NOT delete the cards inside this lesson."
      confirm-label="Delete"
      cancel-label="Cancel"
      @on-cancel="reset()"
      @on-confirm="doDelete()"
    ></confirm-dialog>
    <create-update-dialog
      @reset="reset()"
      @create="create()"
      @update="update()"
      resource="Lesson"
      :id="selectedLesson.id"
      :show="showCreateUpdateDialog"
    >
      <template v-slot:inputElements>
        <q-input label="Lesson Name" v-model="selectedLesson.name" />
      </template>
    </create-update-dialog>
  </div>
</template>

<script>
import ConfirmDialog from 'src/components/ConfirmDialog.vue';
import CreateUpdateDialog from 'src/components/CreateUpdateDialog.vue';
import Lesson from 'src/classes/lesson';
import {
  createLesson,
  getLessons,
  updateLesson,
  deleteLesson,
} from 'src/composables/api/lessonApi';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
    ConfirmDialog,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const cardSetId = route.params.cardSetId;

    const showCreateUpdateDialog = ref(false);
    const showConfirmDelete = ref(false);

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
      showConfirmDelete,
      columns,
      lessons,
      selectedLesson,
      showCreateUpdateDialog,
      editCardsInLesson(rowProps) {
        router.push({
          name: 'manageCardsInLesson',
          params: { cardSetId, lessonId: rowProps.row.id },
        });
      },
      openEdit(rowProps) {
        selectedLesson.value = rowProps.row;
        showCreateUpdateDialog.value = true;
      },
      doDelete() {
        console.log('do delete');
        deleteLesson(cardSetId)
          .delete(selectedLesson.value)
          .then(() => {
            XenaduNotify.info('Lesson deleted');
            const lessonIndex = lessons.value.findIndex(
              (l) => l.id === selectedLesson.value.id
            );

            if (lessonIndex >= 0) {
              lessons.value.splice(lessonIndex, 1);
            }
          })
          .catch(() => {
            XenaduNotify.error('Could not delete Lesson');
          })
          .finally(() => {
            this.reset();
          });
      },
      reset() {
        selectedLesson.value = new Lesson();
        showCreateUpdateDialog.value = false;
        showConfirmDelete.value = false;
      },
      openConfirmDelete(rowProps) {
        selectedLesson.value = rowProps.row;
        showConfirmDelete.value = true;
      },
      update() {
        console.log('do update');
        updateLesson(cardSetId)
          .update(selectedLesson.value)
          .then((updatedLesson) => {
            const index = lessons.value.findIndex(
              (l) => l.id === updatedLesson.id
            );

            if (index >= 0) {
              lessons.value.splice(index, 1, updatedLesson);
            }
            XenaduNotify.info('Updated');
          })
          .catch((e) => {
            XenaduNotify.error('Could not update lesson :(');
          })
          .finally(() => {
            this.reset();
          });
        // then and catch
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
