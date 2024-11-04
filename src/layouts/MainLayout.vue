<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer v-model="drawer" show-if-above side="left" bordered>
      <q-list>
        <q-item>
          <q-item-section>
            <q-img
              src="../assets/menu.png"
              alt="Logo"
              width="110%"
              height="auto"
            />
          </q-item-section>
        </q-item>
        <q-item-label header>Menu</q-item-label>

        <q-item clickable v-ripple tag="router-link" to="/dashboard">
          <q-item-section>
            <q-btn flat label="DASHBOARD" class="q-mb-md" />
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple tag="router-link" to="/agenda">
          <q-item-section>
            <q-btn flat label="AGENDA" class="q-mb-md" />
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple tag="router-link" to="/clientes">
          <q-item-section>
            <q-btn flat label="CLIENTES" class="q-mb-md" />
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple tag="router-link" to="/financeiro">
          <q-item-section>
            <q-btn flat label="FINANCEIRO" class="q-mb-md" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <!-- Para renderizar as páginas conforme a navegação -->
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(true);
</script>

<style scoped>
.q-btn {
  width: 100%;
  text-align: left;
  color: white;
  font-size: 1.2rem;
  background-color: #3b3734;
}
</style>
