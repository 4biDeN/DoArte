<template>
    <q-card class="my-card text-while" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);">
    <q-card-section>
        <div class="text-h6">Card Teste Clique</div>
        <div class="tesxt-sobtitulo2">Qunatos cliques tu deu</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
        {{ qtdeClicks }}
    </q-card-section>

    <q-card-section class="q-pt-none">
        <!-- <q-btn> Clica ni mim</q-btn> -->
        <!-- <q-btn @click="qtdeClicks++"> Clica ni mim</q-btn> -->
        <q-btn @click="$emit('update:qtdeClicks', qtdeClicks + 1)"> Clica ni mim</q-btn>
    </q-card-section>
    </q-card>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent ({
    name: 'cardInicial',
    props: {
        qtdeClicks: {
            type: Number,
            default: 0
        },
        texto: {
            type: String,
            default: ''
        }
    }
  })

</script>