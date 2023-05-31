const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'manage-card-sets',
        children: [
          {
            path: '',
            component: () => import('pages/manage-cards/ManageCardSets'),
          },
          {
            path: ':cardSetId/cards',
            name: 'manageCards',
            component: () => import('pages/manage-cards/ManageCards'),
          },
          {
            path: ':cardSetId/lessons',
            name: 'manageLessons',
            component: () => import('pages/manage-cards/ManageLessons'),
          },
          {
            path: ':cardSetId/lessons/:lessonId/cards',
            name: 'manageCardsInLesson',
            component: () => import('pages/manage-cards/ManageCards'),
          },
          {
            path: ':cardSetId/cards/:cardId',
            name: 'editCard',
            component: () => import('pages/manage-cards/EditCard'),
          },
          {
            path: ':cardSetId/lessons/:lessonId/cards/:cardId',
            name: 'editCardInLesson',
            component: () => import('pages/manage-cards/EditCard'),
          },
          {
            path: ':cardSetId/:cardId/alternatives/:cardSide',
            name: 'alternatives',
            component: () => import('pages/manage-cards/EditAlternatives'),
          },
        ],
      },
      {
        path: 'start',
        children: [
          {
            path: '',
            name: 'selectCardSet',
            component: () => import('pages/learning/SelectCardSet'),
          },
          {
            path: 'card-set/:cardSetId/modes',
            name: 'configModes',
            component: () => import('pages/learning/SelectLearnMode'),
          },
          {
            path: 'card-set/:cardSetId/go',
            name: 'startLearning',
            component: () => import('pages/learning/LearnCards'),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
