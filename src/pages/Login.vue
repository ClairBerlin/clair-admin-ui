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
  created() {
    if (this.$q.cookies.has('csrftoken')) {
      return this.$router.push({ name: 'dashboard' });
    }
  },
  methods: {
    onSubmit() {
      this.$q.loading.show();
      this.$store
        .dispatch('user/login', {
          username: this.username,
          password: this.password
        })
        .then(() => {
          return this.$router.push({ name: 'dashboard' });
        })
        .catch(error => {
          console.log(error);
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Login failed'
          });
        })
        .finally(() => this.$q.loading.hide());
    }
  }
});
</script>

<style lang="scss" scoped></style>
