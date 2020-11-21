import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    options: async function(newVal) {
      console.log('rerendering');
      this._data._chart.destroy();
      this.renderChart(this.chartData, this.options);
      await sleep(5000);
    }
  }
};
