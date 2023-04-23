<template>
  <div>
    <h3>Manage Lessons</h3>

    <div class="row">
      <div class="col-md-12">
        <q-table
          :grid="$q.screen.lt.sm"
          title="Card-Sets"
          :columns="columns"
          :rows="lessons"
          row-key="id"
        >
          <template>
            <q-td>
              <q-btn class="float-right" flat icon="delete" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

const columns = [
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
    name: 'action',
    label: 'Action',
  },
];

const lessons = ref([
  {
    name: 'Lesson 1',
    cards: 50,
  },
  {
    name: 'Lessons 2',
    cards: 4,
  },
]);

export default {
  name: 'ManageLessons',

  setup() {
    return {
      columns,
      lessons,
    };
  },
};
</script>
