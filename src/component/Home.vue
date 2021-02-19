<template>
  <div class="wrapper">
    Home
    <img src="../assets/img.jpg">
    <audio
      :src="audio"
      controls
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import music from '../assets/audio.mp3'

export default defineComponent({
  setup: () => {
    const audio = ref(music)
    return {
      audio
    }
  }
})
</script>

<style lang="less">
.wrapper {
  margin: 10px;
}
</style>