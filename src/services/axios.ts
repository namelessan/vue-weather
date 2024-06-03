import axios from 'axios';
import { IWeather, ISearchLocation, IGeoCode } from '../configs/type';

const apiKey = import.meta.env.VITE_API_KEY;
const baseURL = import.meta.env.VITE_API_URL;

export default {
  getBaseUrl() {
    return baseURL;
  },

  async searchLocation(params: ISearchLocation) {
    const url = `${this.getBaseUrl()}/data/2.5/find`;
    const { data } = await axios.get(url, {
      params: {
        ...params,
        appid: apiKey,
      },
    });
    return data;
  },

  async getCurrentWeather(params: IWeather) {
    const url = `${this.getBaseUrl()}/data/2.5/weather`;
    const { data } = await axios.get(url, {
      params: {
        ...params,
        appid: apiKey,
      },
    });
    return data;
  },

  async reverseGeoCode(params: IGeoCode) {
    const url = `${this.getBaseUrl()}/geo/1.0/reverse`;
    const { data } = await axios.get(url, {
      params: {
        ...params,
        appid: apiKey,
      },
    });
    return data;
  },
};
