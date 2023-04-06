<template>
  <div>Alternatives to "{{ word }}"</div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'EditAlternatives',

  setup() {
    const word = ref('Example');

    return {
      word,
    };
  },
};
</script>
