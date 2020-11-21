<template>
  <q-page class="flex flex-center">
    <q-card class="row shadow-8">
      <q-card-section>
        <div>
          <div style="font-size: 5vh">
            Dashboard
          </div>

          <q-btn
            class="q-mt-xl float-right"
            color="white"
            text-color="blue"
            unelevated
            to="/installations/1"
            :label="$t('Go Home')"
            no-caps
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'Dashboard'
};
</script>
