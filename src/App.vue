<template>
  <div id="app">
    <change-history entity-id="asdfasdf"
                    entity-type="control"
                    base-url="https://" />
  </div>
</template>

<script>
import ChangeHistory from './components/change-history/ChangeHistory.vue'
export default {
  name: 'App',
  components: {
    ChangeHistory
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
