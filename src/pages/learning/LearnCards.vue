<template>
  <q-page>
    <div>
      <h4>You are learning: Russisch</h4>
    </div>
    <div class="container">
      <div>
        <div class="row">
          <div class="col-12 text-center">
            <h6 class="light-header">New Card</h6>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-card class="question-card">
              <q-card-section class="bg-secondary text-center">
                <div class="text-h5">Muh sagt die Kuh</div>
              </q-card-section>

              <q-separator />

              <q-card-section v-if="false" class="bg-positive text-center">
                <q-banner class="">
                  <template v-slot:avatar>
                    <q-icon style="font-size: 4em" name="done" color="green" />
                  </template>
                  <p class="text-h6">Correct Answer</p>
                </q-banner>
              </q-card-section>

              <q-card-section v-if="true" class="bg-negative text-center">
                <q-banner class="">
                  <template v-slot:avatar>
                    <q-icon
                      style="font-size: 4em"
                      name="close"
                      color="negative"
                    />
                  </template>
                  <p class="text-h6">
                    Here comes the correct answer
                    <br />
                    Eventually with more lines
                  </p>
                </q-banner>
              </q-card-section>

              <q-separator />

              <q-card-section class="flex justify-center">
                <div class="container-90">
                  <q-input
                    input-class="text-center"
                    style="font-size: 1.5rem"
                    type="textarea"
                    outlined
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <div class="row q-mt-lg q-mb-sm q-mr-sm justify-center">
        <div class="q-mr-xl">
          <q-btn icon-right="fact_check" label="Check" color="primary" />
        </div>
        <div>
          <q-btn icon-right="help_outline" label="No Idea" color="orange-8" />
        </div>
        <q-btn v-if="false" class="float-right" label="Next" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script></script>
