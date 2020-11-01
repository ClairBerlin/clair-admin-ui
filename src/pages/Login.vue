<template>
  <q-page class="flex flex-center">
    <q-card class="row shadow-8">
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <h4>Login</h4>
          <q-input
            class="inset-shadow"
            filled
            v-model="username"
            label="Username"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'Please enter your username'
            ]"
          />

          <q-input
            class="inset-shadow"
            filled
            v-model="password"
            label="Password"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'Please enter your password'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div>
            <q-btn
              class="shadow-4"
              label="Submit"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Login',
  data() {
    return {
      isPwd: true,
      password: '',
      username: ''
    };
  },
  methods: {
    onSubmit() {
      console.log('a button was pressed!!!');
      // TODO: place axios magic here
      if (this.username !== 'admin') {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Login failed'
        });
      } else {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'TODO: Forward to Dashboard'
        });
      }
    }
  }
});
</script>

<style lang="scss" scoped></style>
