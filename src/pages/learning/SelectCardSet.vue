<template>
  <q-page>
    <div>
      <h4>Choose the card set you want to learn</h4>
    </div>
    <div>
      <div class="row q-mb-lg q-mr-sm">
        <div class="col-12">
          <div class="row">
            <div class="col-12">
              <q-btn
                color="primary"
                glossy
                label="Russisch"
                class="full-width"
                icon-right="send"
                :to="{ name: 'configModes', params: { cardSetId: 1 } }"
              />
            </div>
          </div>
          <div class="row justify-center">
            <span>correct: 37, new: 8, reps: 102, wrong: 17</span>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script></script>
