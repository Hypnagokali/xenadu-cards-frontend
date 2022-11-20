<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>xenadu - learning cards - v0.0.3</q-toolbar-title>
        <q-tabs>
          <q-route-tab to="/manage-card-sets" label="Manage Cards" />
          <q-route-tab to="/start" label="Start learning" />
        </q-tabs>
        <q-space />
        <div>You are: {{ userInfo.userName }}</div>
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
import { useUserStore } from "stores/userStore";


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

const userInfo = ref({
  userName: 'unknown',
});

export default defineComponent({
  name: "MainLayout",

  setup() {
    const selectedItem = ref({});
    const router = useRouter();

    const userStore = useUserStore();

    setInterval(() => {
      userStore.retrieveUser()
        .then(() => {
          userInfo.value.userName = userStore.user.firstName + ' ' + userStore.user.lastName;
        })
    }, 2000);

    watch(selectedItem, (newVal, oldVal) => {
      router.push(newVal);
    })


    return {
      userInfo,
      selectedItem,
      menuItems,
    };
  },
});
</script>
