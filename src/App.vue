<script setup lang="ts">
import { shallowRef, ref, onMounted, computed } from 'vue';
import httpService from './services/axios.ts';
import { IWeather, unitTypes } from './configs/type.ts';
import WSelect from './components/WSelect.vue';

const location: any = shallowRef({});
const weatherData: any = shallowRef({});
const units = ref<unitTypes>('standard');
const tempUnits = computed(() => {
  const maps: { [key in unitTypes]: string } = {
    standard: '°K',
    metric: '°C',
    imperial: '°F',
  };
  return maps[units.value];
});

const getCurrentWeather = async () => {
  const params = {
    lat: location.value.coord.lat,
    lon: location.value.coord.lon,
    units: units.value,
  };
  weatherData.value = await httpService.getCurrentWeather(params);
};

const onSelectLocation = (option: any) => {
  location.value = option;
  getCurrentWeather();
};

const getUnitSystemByCountryCode = (countryCode: string) => {
  const imperialCountries = ['US', 'LR', 'MM']; // United States, Liberia, Myanmar
  return imperialCountries.includes(countryCode) ? 'imperial' : 'metric';
};

onMounted(() => {
  // get Geo location and fetch weather data
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const coord = pos.coords;
    const params = {
      lat: coord.latitude.toString(),
      lon: coord.longitude.toString(),
    };
    const data = await httpService.reverseGeoCode(params);
    units.value = getUnitSystemByCountryCode(data[0].country);
    const weatherParams: IWeather = {
      ...params,
      units: units.value,
    };

    weatherData.value = await httpService.getCurrentWeather(weatherParams);
  });
});
</script>

<template>
  <div class="weather-container">
    <WSelect
      :units="units"
      :tempUnits="tempUnits"
      @input="onSelectLocation"
    ></WSelect>
    <div class="weather-info"></div>
  </div>
</template>

<style scoped lang="scss">
@import './assets/scss/mixins.scss';

.weather-container {
  max-width: 1280px;
  margin: 0 auto;
  font-size: 12px;
  @include tablet {
    font-size: 14px;
    padding: 2rem;
  }
}
.weather-info {
  height: 1000px;
  width: 100%;
}
</style>
