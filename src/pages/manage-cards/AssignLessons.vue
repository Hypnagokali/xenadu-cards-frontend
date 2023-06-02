<template>
  <q-page class="q-mt-lg">
    <div>
      <h4 class="title_subtitle">Lessons of</h4>
      <div class="subtitle">
        Front: '{{ card.front }}'
        <br />
        Back: '{{ card.back }}''
      </div>
    </div>
    <div class="row q-mb-xs">
      <div class="offset-8 col-4">
        <q-btn label="<< Back" color="warning" @click="back()"></q-btn>
      </div>
    </div>
    <q-card style="max-width: 94vw; min-height: 60vh">
      <q-card-section>
        <q-table
          label="Assignements"
          :columns="cols"
          :rows="allLessonsOfCardSet"
          :filter="filter"
          :rows-per-page-options="[0]"
          no-data-label="No lessons in this card sets"
        >
          <template v-slot:body-cell-assigned="props">
            <q-td style="text-align: center">
              <q-icon name="done" v-if="isAssigned(props.row)" />
            </q-td>
          </template>
          <template v-slot:body-cell-action="props">
            <q-td style="text-align: center">
              <q-btn
                label="take out"
                size="sm"
                outline
                color="orange-10"
                @click="removeFromLesson(props.row)"
                v-if="isAssigned(props.row)"
              />
              <q-btn
                @click="assignToLesson(props.row)"
                label="assign"
                outline
                color="green-10"
                size="sm"
                v-else
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue';
import { api } from 'src/boot/api';
import { useRoute, useRouter } from 'vue-router';
import { XenaduNotify } from 'src/composables/xenadu-notify';
import { getCardSet } from 'src/composables/api/cardApi';

const cols = ref([
  {
    label: 'Lesson',
    field: 'name',
    name: 'name',
    align: 'center',
  },
  {
    label: 'Assigned?',
    name: 'assigned',
    align: 'center',
  },
  {
    label: 'Action',
    name: 'action',
    align: 'center',
  },
]);

const allLessonsOfCardSet = ref([
  {
    id: 1,
    name: 'Lesson 1',
  },
  {
    id: 2,
    name: 'Lesson 2',
  },
  {
    id: 3,
    name: 'Lesson 3',
  },
]);

const assignedToLessons = ref([
  {
    id: 1,
  },
  {
    id: 3,
  },
]);

const card = ref({
  front: 'Front',
  back: 'Back',
});

export default {
  name: 'EditAlternatives',

  setup() {
    const route = useRoute();
    const router = useRouter();
    const cardSetId = route.params.cardSetId;
    const cardId = route.params.cardId;
    const lessonId = route.params.lessonId;
    const isLesson = !!lessonId;

    if (isLesson) {
      console.log('--- Lesson View ---');
    }

    const cardSetCall = getCardSet(cardSetId);

    onMounted(() => {
      // load init state
      cardSetCall
        .getCard(cardId)
        .retrieve()
        .then((c) => {
          card.value = c;
        });

      cardSetCall
        .getLessons()
        .retrieve()
        .then((fetchedLessons) => (allLessonsOfCardSet.value = fetchedLessons))
        .catch(() => {
          XenaduNotify.error('Could not fetch lessons');
        });

      cardSetCall
        .getCard(cardId)
        .getLessons()
        .retrieve()
        .then((fetchedLessons) => (assignedToLessons.value = fetchedLessons))
        .catch(() =>
          XenaduNotify.error('Could not fetch lessons the card is assigned to')
        );
    });

    return {
      cols,
      allLessonsOfCardSet,
      assignedToLessons,
      filter: ref(''),
      card,
      cardId,
      assignToLesson(lessonRow) {
        cardSetCall
          .getLesson(lessonRow.id)
          .assignCard(cardId)
          .then(() => {
            const lesson = allLessonsOfCardSet.value.find(
              (l) => l.id === lessonRow.id
            );
            assignedToLessons.value.push(lesson);
          });
      },
      removeFromLesson(lessonRow) {
        cardSetCall
          .getLesson(lessonRow.id)
          .removeCard(cardId)
          .then(() => {
            const index = assignedToLessons.value.findIndex(
              (l) => l.id === lessonRow.id
            );
            assignedToLessons.value.splice(index, 1);
          });
      },
      back() {
        if (isLesson) {
          router.push({
            name: 'editCardInLesson',
            params: {
              cardId,
              cardSetId,
              lessonId,
            },
          });
        } else {
          router.push({
            name: 'editCard',
            params: {
              cardId,
              cardSetId,
            },
          });
        }
      },
      isAssigned(row) {
        return assignedToLessons.value.findIndex((l) => l.id === row.id) > -1;
      },
    };
  },
};
</script>
