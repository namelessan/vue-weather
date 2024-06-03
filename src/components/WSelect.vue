<template>
  <div class="search">
    <div class="search-container">
      <div id="searchBar" :class="['search-bar', { expanded }]">
        <input
          v-model="queryString"
          type="text"
          class="search__input"
          @focus="onInputFocus"
          @keypress="onEnter"
        />
        <ul v-show="expanded" class="search__option">
          <li
            v-for="opt in locationOptions"
            :key="opt.id"
            class="search__option__item"
            @click="() => onSelect(opt)"
          >
            <span class="item-name">
              <span>{{ opt.name }}, {{ opt.sys.country }} </span>
              <img
                :src="getCountryFlag(opt.sys.country)"
                class="search__option__icon"
                :style="{ height: '15px', marginLeft: '7px' }"
              />
            </span>
            <span class="item-temp"
              >{{ Math.round(opt.main.temp) }} {{ props.tempUnits }}</span
            >
            <img
              :src="getWeatherIcon(opt.weather[0].icon)"
              alt=""
              class="search__option__icon"
            />
          </li>
        </ul>
      </div>
      <div class="search-button-container">
        <button class="search__button" @click="onSearch">Search</button>
        <div v-show="loading" class="button-overlay">
          <Loading></Loading>
        </div>
      </div>
    </div>

    <div class="search__error" v-if="errorMessages">{{ errorMessages }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, defineEmits, defineProps, onMounted } from 'vue';
import httpService from '../services/axios.ts';
import { unitTypes } from '../configs/type';
import Loading from './Loading.vue';

const props = defineProps<{ units: unitTypes; tempUnits: string }>();
const emit = defineEmits<{ (e: 'input', value: any): void }>();

const queryString = ref('');
const locationOptions: any = shallowRef([]);
const errorMessages = ref('');
const expanded = ref(false);
const loading = ref(false);

const onEnter = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    onSearch();
  }
};
const onSearch = async () => {
  loading.value = true;
  try {
    const params = {
      q: queryString.value,
      limit: 5,
      units: props.units,
    };
    const data = await httpService.searchLocation(params);
    console.log(data);
    if (data.cod !== '200') {
      errorMessages.value = data.message;
      loading.value = false;
      return;
    }
    locationOptions.value = data.list || [];
    if (!locationOptions.value.length) {
      errorMessages.value = `No result for \"${queryString.value}\"`;
      loading.value = false;
      return;
    }
    expanded.value = true;
    errorMessages.value = '';
  } catch (error: any) {
    console.log('error', error);
    errorMessages.value = error.message;
  }
  loading.value = false;
};
const onSelect = (option: any) => {
  emit('input', option);
  expanded.value = false;
};
const onInputFocus = () => {
  if (locationOptions.value.length) {
    expanded.value = true;
  }
};

const getCountryFlag = (code: string) => {
  return `https://openweathermap.org/images/flags/${code.toLowerCase()}.png`;
};

const getWeatherIcon = (icon: string) => {
  return `https://openweathermap.org/img/wn/${icon.toLowerCase()}@2x.png`;
};

onMounted(() => {
  document.body.addEventListener('click', function (e) {
    console.log('body clicked');
    const searchBar = document.getElementById('searchBar');
    if (searchBar && !searchBar.contains(e.target as any)) {
      expanded.value = false;
    }
  });
});
</script>

<style lang="scss" scoped>
.search {
  .search-container {
    display: flex;
    align-items: center;
  }
  &__input {
    width: 100%;
    padding: 0.86em;
    margin-left: 0;
    margin-right: 0;
    border-radius: 4pt 0 0 4pt;
    border: 1px solid #888;
    box-sizing: border-box;
    font-size: 1em;
    &:focus {
      outline: none;
    }
  }

  &__button {
    background-color: #078edc;
    border-color: #078edc;
    width: 90px;
    color: #fff;
    border-radius: 0 4px 4px 0;
    font-size: 1.2em;
    &:hover {
      color: #333;
      background-color: #8ec7e9;
    }
  }

  &__error {
    margin-top: 1em;
    color: #fff;
    background-color: rgba(120, 203, 191, 0.8);
    padding: 0.86em;
    border-radius: 4pt;
  }

  .search-bar {
    display: block;
    position: relative;
    width: 100%;
    &.expanded {
      .search__input {
        border-bottom: none;
        border-radius: 4px 0 0 0;
      }
    }
  }

  &__option {
    position: absolute;
    width: 100%;
    border-radius: 0 0 4px 4px;
    border: 1px solid #888;
    border-top: none;
    background-color: #fff;
    &__item {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      padding-left: 1em;
      padding-right: 1em;
      cursor: pointer;
      height: 45px;
      &:hover {
        background-color: hsla(0, 0%, 94.9%, 0.5);
      }
      .item-name {
        display: flex;
        align-items: center;
        width: 300px;
      }
      .item-temp {
        width: 80px;
      }
    }
    &__icon {
      height: 50px;
    }
  }

  .search-button-container {
    position: relative;
    .button-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba($color: #fff, $alpha: 0.2);
    }
  }
}
</style>
