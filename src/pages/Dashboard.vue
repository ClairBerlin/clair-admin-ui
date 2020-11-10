<template>
  <q-page class="flex flex-center">
    <q-card class="row shadow-8">
      <q-card-section>
        <div>
          <div style="font-size: 15vh">
            Dashboard content
          </div>

          <q-btn
            class="q-mt-xl"
            color="white"
            text-color="blue"
            unelevated
            to="/"
            label="Go Home"
            no-caps
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Dashboard'
});
</script>
