<script>
import { Bar } from 'vue-chartjs'
import { stats } from '@/api/researches'

export default {
  extends: Bar,
  data() {
    return {
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    }
  },
  mounted() {
    stats().then(response => {
      this.renderChart(response.data, this.options)
    })
  }
}
</script>
