<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>x-cards</q-toolbar-title>
        <q-space />
        <div class="q-pa-md">
          <q-btn-dropdown
            size="sm"
            v-if="
              userInfo.userName != null && userInfo.userName.trim().length > 0
            "
            color="primary"
            :label="userInfo.userName"
          >
            <q-list>
              <q-item clickable v-close-popup @click="logout()">
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
      <q-tabs>
        <q-route-tab to="/manage-card-sets" label="Manage Cards" />
        <q-route-tab to="/start" label="Start learning" />
      </q-tabs>
    </q-header>
    <q-page-container class="q-pl-md">
      <div class="row" v-if="learnSessionStillOpen()">
        <div class="col-md-3">
          <back-to-learn-session
            @resume="doResume()"
            @closeLearnSession="doCloseSession()"
          ></back-to-learn-session>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3">
          <!-- space for container menu -->
        </div>
        <div class="col-md-6 col-xs-12">
          <router-view />
        </div>
      </div>

      <q-dialog v-model="sessionExpired">
        <q-card>
          <q-card-section>
            <div class="text-h6">Alert</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Your session has expired. Please login again.
          </q-card-section>

          <q-card-actions>
            <q-btn
              flat
              label="Login / Refresh"
              color="primary"
              @click="reloadLocation()"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import BackToLearnSession from 'src/components/BackToLearnSession.vue';
import { defineComponent, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from 'stores/userStore';
import { useLearnSessionStore } from 'stores/learnSessionStore';
import { retrieveLearnSession } from 'src/composables/retrieveLearnSession';
import keycloakApi from 'boot/keycloak-boot';

const menuItems = [
  {
    label: 'Manage Cards',
    value: '/manage-card-sets',
  },
  {
    label: 'Start learning',
    value: '/start',
  },
];

const userInfo = ref({
  userName: '',
});

let pingRequestInterval = null;

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const sessionExpired = ref(false);
    const selectedItem = ref({});
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();
    const learnSessionStore = useLearnSessionStore();

    // doAuth().then((token) => {
    userStore.retrieveUser().then(() => {
      userInfo.value.userName =
        userStore.user.firstName + ' ' + userStore.user.lastName;
    });
    // });

    watch(selectedItem, (newVal, oldVal) => {
      router.push(newVal);
    });
    return {
      userInfo,
      sessionExpired,
      selectedItem,
      menuItems,
      learnSessionStore,
      reloadLocation() {
        window.location.reload();
      },
      logout() {
        if (keycloakApi.keycloak != null) {
          keycloakApi.keycloak.logout().then(() => {
            keycloakApi.removeToken();
            location.reload();
          });
        } else {
          console.log('keycloak is null');
        }
        // location.href = '/logout';
      },
      learnSessionStillOpen() {
        const sessionId = sessionStorage.getItem('learnSession');
        console.log('learnSessionStore', learnSessionStore.getCardSetId);
        return (
          (learnSessionStore.getCardSetId > 0 || sessionId) &&
          route.name !== 'startLearning'
        );
      },
      doResume() {
        const sessionId = sessionStorage.getItem('learnSession');

        if (learnSessionStore.getCardSetId > 0) {
          router.push({
            name: 'startLearning',
            params: { cardSetId: learnSessionStore.getCardSetId },
          });
        } else if (sessionId) {
          retrieveLearnSession(sessionId, learnSessionStore).then((session) => {
            router.push({
              name: 'startLearning',
              params: { cardSetId: session.cardSetId },
            });
          });
        }
      },
      doCloseSession() {
        const sessionId = sessionStorage.getItem('learnSession');
        // TODO: implement learnSessionApi
        learnSessionStore.destroy();
      },
    };
  },
  components: { BackToLearnSession },
});
</script>
