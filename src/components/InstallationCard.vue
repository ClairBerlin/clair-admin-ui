<template>
  <q-card class="row">
    <q-card-section>
      <!-- TODO: let the links point to the respective site/room/installation-->
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-btn flat :label="siteName" /> / <q-btn flat :label="roomName" /> /
        <q-btn flat :label="installationName" />
      </q-toolbar>

      <q-tabs v-model="selectedTab" class="text-primary" align="justify">
        <q-tab name="day" icon="fa fa-calendar-day" label="Tag" />
        <q-tab name="week" icon="fa fa-calendar-week" label="Woche" />
        <q-tab name="month" icon="fa fa-calendar-alt" label="Monat" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" swipeable>
        <q-tab-panel class="q-pa-none" name="day">
          <SampleGraph
            :datacollection="daycollection"
            :width="sampleGraphWidth"
            :height="sampleGraphHeight"
            timeUnit="hour"
            :xTicks="displayedDayTicks"
          />
        </q-tab-panel>

        <q-tab-panel name="week">
          <SampleGraph
            :datacollection="weekcollection"
            :width="sampleGraphWidth"
            :height="sampleGraphHeight"
            timeUnit="day"
            :xTicks="displayedWeekTicks"
          />
        </q-tab-panel>

        <q-tab-panel name="month">
          <SampleGraph
            :datacollection="monthcollection"
            :width="sampleGraphWidth"
            :height="sampleGraphHeight"
            timeUnit="day"
            :xTicks="displayedMonthTicks"
          />
        </q-tab-panel>
      </q-tab-panels>
      <div class="row justify-between">
        <q-btn @click="displayedFromMoment = previousFromMoment">
          <q-icon name="arrow_left" />
        </q-btn>
        <div class="">{{ displayTimePeriod(displayedFromMoment) }}</div>
        <q-btn
          @click="displayedFromMoment = nextFromMoment"
          :disabled="displayedFromMomentIsCurrent"
        >
          <q-icon name="arrow_right" />
        </q-btn>
      </div>
    </q-card-section>

    <q-inner-loading :showing="loading > 0 || errorOccurred">
      <q-spinner-radio v-if="errorOccurred" size="75px" color="red" />
      <q-spinner-pie v-else size="75px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import dayjs from '../utils/time.js';
import SampleGraph from '../components/SampleGraph.vue';

export default {
  components: {
    SampleGraph
  },
  props: {
    siteName: String,
    roomName: String,
    installationName: String,
    installationId: String
  },
  data() {
    return {
      errorOccurred: false,
      site: {},
      loading: 0,
      displayedFromMoment: dayjs().startOf('day'),
      oldestSampleMoment: dayjs()
        .subtract(4, 'w')
        .startOf('month'),
      samplePool: [],
      sampleGraphWidth: '75vw',
      sampleGraphHeight: '50vh',
      refreshTimerId: -1,
      selectedTab: 'day'
    };
  },
  computed: {
    ...mapGetters({
      getInstallationById: 'installations/byId'
    }),
    previousFromMoment: function() {
      return [
        this.displayedFromMoment.clone().subtract(1, 'd'),
        this.displayedFromMoment.clone().subtract(1, 'w'),
        this.displayedFromMoment.clone().subtract(1, 'M')
      ][this.getTabIndex()];
    },
    currentFromMoment: function() {
      return dayjs().startOf('day');
    },
    nextFromMoment: function() {
      return [
        this.displayedFromMoment.clone().add(1, 'd'),
        dayjs.min(
          this.currentFromMoment,
          this.displayedFromMoment.clone().add(1, 'w')
        ),
        dayjs.min(
          this.currentFromMoment,
          this.displayedFromMoment.clone().add(1, 'M')
        )
      ][this.getTabIndex()];
    },
    displayedFromMomentIsCurrent: function() {
      const displayedMoments = [
        this.displayedDayMoments,
        this.displayedWeekMoments,
        this.displayedMonthMoments
      ][this.getTabIndex()];
      const currentValue = this.currentFromMoment.valueOf();
      return currentValue < displayedMoments.to.valueOf();
    },

    displayedDayMoments: function() {
      // if this is not a different reference then displayFromMoment the site updates like crazy...
      const displayedFromMoment = this.displayedFromMoment.clone();
      const displayedDayToMoment = displayedFromMoment.add(1, 'd');
      return {
        from: displayedFromMoment,
        to: displayedDayToMoment
      };
    },
    daycollection: function() {
      return this.samplesToCollection(this.displayedDayMoments);
    },
    displayedDayTicks: function() {
      return this.momentsToTicks(this.displayedDayMoments);
    },

    displayedWeekMoments: function() {
      const displayedWeekFromMoment = dayjs(this.displayedFromMoment).startOf(
        'isoWeek'
      );
      const displayedWeekToMoment = displayedWeekFromMoment.clone().add(1, 'w');
      return {
        from: displayedWeekFromMoment,
        to: displayedWeekToMoment
      };
    },
    weekcollection: function() {
      return this.samplesToCollection(this.displayedWeekMoments);
    },
    displayedWeekTicks: function() {
      return this.momentsToTicks(this.displayedWeekMoments);
    },

    displayedMonthMoments: function() {
      const displayedMonthFromMoment = dayjs(this.displayedFromMoment).startOf(
        'month'
      );
      const displayedMonthToMoment = displayedMonthFromMoment
        .clone()
        .add(1, 'M');
      return {
        from: displayedMonthFromMoment,
        to: displayedMonthToMoment
      };
    },
    monthcollection: function() {
      return this.samplesToCollection(this.displayedMonthMoments);
    },
    displayedMonthTicks: function() {
      return this.momentsToTicks(this.displayedMonthMoments);
    }
  },
  methods: {
    ...mapActions({
      loadInstallationById: 'installations/loadById'
    }),
    getTabIndex() {
      const tab = this.selectedTab;
      return tab === 'day' ? 0 : tab === 'week' ? 1 : 2;
    },
    momentsToTicks: function(moments) {
      return {
        min: moments.from,
        max: moments.to
      };
    },
    displayTimePeriod: function(fromMoment) {
      const displayedTimePeriods = [
        fromMoment.format('dddd, D.M.YYYY'),
        `Kalenderwoche ${fromMoment.week()} ${fromMoment.year()}`,
        fromMoment.format('MMMM YYYY')
      ];
      return displayedTimePeriods[this.getTabIndex()];
    },
    samplesToCollection: function(moments) {
      const samples = this.samplePool.filter(
        s =>
          s.timestamp_s >= moments.from.unix() &&
          s.timestamp_s < moments.to.unix()
      );
      return {
        datasets: [
          {
            label: 'CO2',
            fill: false,
            pointRadius: 0,
            lineTension: 0,
            borderWidth: 2,
            yAxisID: 'co2Axis',
            borderColor: '#007cb0',
            data: samples.map(s => {
              return { t: dayjs(1000 * s.timestamp_s), y: s.co2_ppm };
            })
          }
        ]
      };
    },
    loadSamples: function(moments) {
      console.log(
        `loading samples from ${moments.from.unix()} to ${moments.to.unix()}`
      );
      const promise = new Promise((resolve, reject) => {
        this.loadInstallationById({
          id: this.installationId,
          options: {
            include_timeseries: 1,
            'filter[from]': moments.from.unix(),
            'filter[to]': moments.to.unix()
          }
        })
          .then(() => {
            const samples = this.getInstallationById({
              id: this.installationId
            }).attributes.timeseries.slice();
            resolve(samples);
          })
          .catch(error => reject(error));
      });
      return promise;
    },
    loadPastSamples: async function() {
      // assuming we're only missing samples from the past and samples are sorted chronologically
      this.loading += 1;
      try {
        const toMoment = this.samplePool.length
          ? dayjs(1000 * this.samplePool[0].timestamp_s)
          : dayjs();
        const samples = await this.loadSamples({
          from: this.oldestSampleMoment,
          to: toMoment
        });
        for (const sample of samples.reverse()) {
          this.samplePool.unshift(sample);
        }
      } catch (error) {
        console.log('an error occured while loading missing samples:');
        console.log(error);
        this.errorOccurred = true;
      } finally {
        this.loading -= 1;
      }
    },
    loadRecentSamples: async function() {
      if (this.samplePool.length === 0) return;
      try {
        const newestSample = this.samplePool[this.samplePool.length - 1];
        const samples = await this.loadSamples({
          from: dayjs(1000 * newestSample.timestamp_s),
          to: dayjs()
        });
        for (const sample of samples) {
          this.samplePool.push(sample);
        }
      } catch (error) {
        console.log('an error occured while loading recent samples:');
        console.log(error);
        this.errorOccurred = true;
      }
    },
    loadInstallation: async function() {
      this.loading += 1;
      try {
        await this.loadPastSamples();
      } catch (error) {
        console.log('an error occured while loading the site data:');
        console.log(error);
        this.errorOccurred = true;
      }
      this.loading -= 1;
    }
  },
  mounted() {
    this.loadInstallation();
    // refresh once every two minutes
    this.refreshTimerId = setInterval(this.loadRecentSamples, 120000);
  },
  beforeDestroy() {
    clearInterval(this.refreshTimerId);
  },
  watch: {
    displayedFromMoment: function(newVal) {
      if (
        this.displayedFromMoment.valueOf() < this.oldestSampleMoment.valueOf()
      ) {
        this.oldestSampleMoment = this.displayedFromMoment
          .clone()
          .startOf('month');
        this.loadPastSamples();
      }
    }
  }
};
</script>

<style lang="scss"></style>
