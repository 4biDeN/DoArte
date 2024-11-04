<template>
  <q-page class="dashboard-page">
    <div class="dashboard-container">
      <div class="card" v-for="card in cards" :key="card.title">
        <div class="card-header">{{ card.title }}</div>
        <div class="card-content">
          <!-- Aqui você pode adicionar conteúdos futuros -->
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        { title: "AGENDA DO DIA" },
        { title: "TOP CLIENTES" },
        { title: "FINANCEIRO" },
        { title: "TOP SERVIÇOS" },
      ],
    };
  },
};
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  max-width: 1000px;
  padding: 20px;
}

.card {
  background-color: #3d3d3d;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.card-content {
  margin-top: 10px;
}
</style>
