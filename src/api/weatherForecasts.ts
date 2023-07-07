import baseApi from "@/api/base";
export const addTagTypes = ["WeatherForecasts"] as const;

const enhanchedApi = baseApi
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getWeatherForecasts: build.query<
        GetWeatherForecastsResponse,
        GetWeatherForecastsRequest
      >({
        query: () => "/data/forecasts.json",
      }),
    }),
    overrideExisting: false,
  });

export type WeatherForecast = {
  id: number;
  date: string;
  summary: string;
  temperatureC: number;
  temperatureF: number;
};

export type GetWeatherForecastsRequest = void;
export type GetWeatherForecastsResponse = {
  forecasts: WeatherForecast[];
};

export const { useGetWeatherForecastsQuery } = enhanchedApi;
