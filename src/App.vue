<script setup lang="ts">
import { shallowRef, ref, onMounted, computed } from 'vue';
import httpService from './services/axios.ts';
import { IWeather, unitTypes } from './configs/type.ts';
import dayjs from './plugins/day.ts';
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
const speedUnits = computed(() => {
  const maps: { [key in unitTypes]: string } = {
    standard: 'm/s',
    metric: 'm/s',
    imperial: 'mph',
  };
  return maps[units.value];
});

const country = computed(() => {
  return weatherData.value?.sys?.country;
});
const currentWeather = computed(() => {
  return weatherData.value?.weather[0];
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

// const getCountryFlag = (code: string) => {
//   if (!code) return;
//   return `https://openweathermap.org/images/flags/${code.toLowerCase()}.png`;
// };

const getWeatherIcon = (icon: string) => {
  if (!icon) return;
  return `https://openweathermap.org/img/wn/${icon.toLowerCase()}@2x.png`;
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
    <div v-if="weatherData.id" class="weather">
      <div class="weather__time">{{ dayjs().format('LLLL') }}</div>
      <div class="weather__location">{{ weatherData.name }}, {{ country }}</div>
      <div class="weather__temp">
        <img
          :src="getWeatherIcon(currentWeather.icon)"
          alt=""
          style="height: 50px"
        />
        <span>{{ Math.round(weatherData.main.temp) }}{{ tempUnits }}</span>
      </div>
      <div class="weather__description">
        {{
          `Feel like ${Math.round(weatherData.main.feels_like)}${tempUnits}`
        }},
        <span :style="{ textTransform: 'capitalize' }">{{
          currentWeather.description
        }}</span>
      </div>
      <ul class="weather__detail">
        <li>
          <div class="wind-line">
            <svg
              data-v-47880d39=""
              viewBox="0 0 1000 1000"
              enable-background="new 0 0 1000 1000"
              xml:space="preserve"
              class="icon-wind-direction"
              :style="{ transform: `rotate(${weatherData.wind.deg}deg)` }"
            >
              <g data-v-47880d39="" fill="#48484a">
                <path
                  data-v-47880d39=""
                  d="M510.5,749.6c-14.9-9.9-38.1-9.9-53.1,1.7l-262,207.3c-14.9,11.6-21.6,6.6-14.9-11.6L474,48.1c5-16.6,14.9-18.2,21.6,0l325,898.7c6.6,16.6-1.7,23.2-14.9,11.6L510.5,749.6z"
                ></path>
                <path
                  data-v-47880d39=""
                  d="M817.2,990c-8.3,0-16.6-3.3-26.5-9.9L497.2,769.5c-5-3.3-18.2-3.3-23.2,0L210.3,976.7c-19.9,16.6-41.5,14.9-51.4,0c-6.6-9.9-8.3-21.6-3.3-38.1L449.1,39.8C459,13.3,477.3,10,483.9,10c6.6,0,24.9,3.3,34.8,29.8l325,898.7c5,14.9,5,28.2-1.7,38.1C837.1,985,827.2,990,817.2,990z M485.6,716.4c14.9,0,28.2,5,39.8,11.6l255.4,182.4L485.6,92.9l-267,814.2l223.9-177.4C454.1,721.4,469,716.4,485.6,716.4z"
                ></path>
              </g>
            </svg>
            {{ weatherData.wind.speed }}{{ speedUnits }}
          </div>
        </li>
        <li>
          <div class="pressure">
            <svg
              data-v-7bdd0738=""
              data-v-3208ab85=""
              width="96pt"
              height="96pt"
              viewBox="0 0 96 96"
              class="icon-pressure"
            >
              <g
                data-v-7bdd0738=""
                transform="translate(0,96) scale(0.100000,-0.100000)"
                fill="#48484a"
                stroke="none"
              >
                <path
                  data-v-7bdd0738=""
                  d="M351 854 c-98 -35 -179 -108 -227 -202 -27 -53 -29 -65 -29 -172 0
    -107 2 -119 29 -172 38 -75 104 -141 180 -181 58 -31 66 -32 176 -32 110 0
    118 1 175 32 77 40 138 101 178 178 31 57 32 65 32 175 0 110 -1 118 -32 176
    -40 76 -106 142 -181 179 -49 25 -71 29 -157 32 -73 2 -112 -1 -144 -13z m259
    -80 c73 -34 126 -86 161 -159 24 -50 29 -73 29 -135 0 -62 -5 -85 -29 -135
    -57 -119 -161 -185 -291 -185 -130 0 -234 66 -291 185 -24 50 -29 73 -29 135
    0 130 66 234 185 291 82 40 184 41 265 3z"
                ></path>
                <path
                  data-v-7bdd0738=""
                  d="M545 600 c-35 -35 -68 -60 -80 -60 -27 0 -45 -18 -45 -45 0 -33 -50
    -75 -89 -75 -18 0 -41 -5 -53 -11 -20 -11 -20 -11 3 -35 12 -13 33 -24 46 -24
    17 0 23 -6 23 -23 0 -13 10 -33 23 -45 30 -28 47 -13 47 43 0 32 6 47 28 68
    15 15 37 27 48 27 26 0 44 18 44 44 0 12 26 47 60 81 l60 61 -28 27 -28 27
    -59 -60z"
                ></path>
              </g>
            </svg>
            {{ `${weatherData.main.pressure}hPa` }}
          </div>
        </li>
        <li>
          <div class="humidity">Humidity: {{ weatherData.main.humidity }}%</div>
        </li>
        <!-- <li>
          <div class="dew-point"></div>
        </li> -->
        <li>
          <div class="visibility">
            Visibility: {{ weatherData.visibility / 1000 }}km
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './assets/scss/mixins.scss';

.weather-container {
  max-width: 600px;
  margin: 0 auto;
  font-size: 12px;
  padding: 1em;
  border-radius: 20px;
  background-color: #fff;
  @include tablet {
    font-size: 14px;
    padding: 3rem;
  }
  @include desktop {
    font-size: 14px;
    padding: 3rem;
  }
}

.weather {
  width: 100%;
  &__time {
    margin-top: 3em;
    color: #eb6e4b;
  }
  &__location {
    margin-top: 0.3em;
    font-size: 1.8em;
    font-weight: 700;
  }
  &__temp {
    margin-top: 0.2em;
    display: flex;
    align-items: center;
    font-size: 2.5em;
  }
  &__description {
    font-weight: 700;
  }
  &__detail {
    line-height: 20px;
    margin-top: 4px;
    margin-bottom: 0;
    display: flex;
    flex-wrap: wrap;
    border-left: 1px solid #eb6e4b;
    max-width: 400px;
    padding-left: 16px;
    padding-right: 16px;

    li {
      margin-right: 16px;
      padding: 3px 0;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
    }
  }

  .wind-line {
    display: flex;
    align-items: center;

    .icon-wind-direction {
      height: 8px;
      margin-right: 5px;
    }
  }

  .icon-pressure {
    height: 12px;
    width: auto;
  }
}
</style>
