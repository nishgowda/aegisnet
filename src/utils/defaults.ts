import { Options } from "../types/options";

export let defaults: Options = {
  totalKey: "total",
  dailyKey: "daily",
  hourlyKey: "hourly",
  responseKey: "response-times",
};

export const setOptions = (options: Options) => {
  defaults = options;
};
