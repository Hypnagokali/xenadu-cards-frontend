<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>xenadu - learning cards</q-toolbar-title>
        <q-tabs>
          <q-route-tab to="/manage-card-sets" label="Manage Cards" />
          <q-route-tab to="/start" label="Start learning" />
        </q-tabs>
        <q-space />
        <div>v0.0.1</div>
      </q-toolbar>
    </q-header>
    <q-page-container class="q-pl-md">
      <div class="row">
        <div class="col-md-3">
          <!-- space for container menu -->
        </div>
        <div class="col-md-6 col-xs-12">
          <router-view />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, watch, onUpdated } from "vue";
import { useRouter } from "vue-router";


const menuItems = [
  {
    label: 'Manage Cards',
    value: '/manage-card-sets'
  },
  {
    label: 'Start learning',
    value: '/start'
  },
];

export default defineComponent({
  name: "MainLayout",

  setup() {
    const selectedItem = ref({});
    const router = useRouter();

    watch(selectedItem, (newVal, oldVal) => {
      router.push(newVal);
    })


    return {
      selectedItem,
      menuItems,
    };
  },
});
</script>
