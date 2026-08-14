import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GeoLocation } from "../types";

export const geocodingApi = createApi({
  reducerPath: "geocodingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://geocoding-api.open-meteo.com/v1" }),
  endpoints: (builder) => ({
    searchCities: builder.query<GeoLocation[], string>({
      query: (name) => `/search?name=${encodeURIComponent(name)}&count=8&language=en&format=json`,
      transformResponse: (response: any): GeoLocation[] =>
        (response.results ?? []).map((r: any) => ({
          id: r.id,
          name: r.name,
          country: r.country ?? "",
          admin1: r.admin1,
          latitude: r.latitude,
          longitude: r.longitude,
          timezone: r.timezone ?? "auto",
        })),
    }),
  }),
});

export const { useLazySearchCitiesQuery } = geocodingApi;