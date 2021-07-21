<template>
  <div class="dashboard-container">
    Проведено исследований
    <bar-chart />
  </div>
</template>

<script>
import BarChart from '@/views/dashboard/components/BarChart.vue'

export default {
  name: 'Dashboard',
  components: { BarChart }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
