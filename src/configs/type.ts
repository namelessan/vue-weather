export type unitTypes = 'standard' | 'metric' | 'imperial';

export interface IWeather {
  lat: string;
  lon: string;
  units?: unitTypes;
}

export type IGeoCode = Omit<IWeather, 'units'>;

export interface ISearchLocation {
  q: string;
  limit?: number;
  units?: unitTypes;
}

export type messageType = 'error' | 'info' | 'warning';
