import { Context } from "koa";
import { Event, Stats } from "../types/stats";
import { client } from "../utils/client";
import { returnDateFull, returnHour } from "../utils/times";
import { defaults } from "../utils/defaults";

export let koaState = {
  responseTime: 0 as number,
};

// Helper to format the route
const koaFetchRoute = (ctx: Context) => {
  const route: string = ctx.req.url ? ctx.req.url : "unkown";
  if (!route) {
    return "unkown route";
  }
  return route;
};

// Retrieve the stats from persistance storage and parse the JSON
const koaGetStats = async (key: string) => {
  let data: Stats[];
  try {
    const value = await client.get(key);
    data = JSON.parse(value);
  } catch (error) {
    return error;
  }
  return data;
};

// Reset the value of key with updated stats and endpoints
const koaDumpStats = async (stats: Event[], key: string) => {
  try {
    client.set(key, JSON.stringify(stats));
  } catch (error) {
    return error;
  }
};

// Fetch the event and the the response time of each event.
export const koaFetchResponseTimes = async (ctx: Context) => {
  try {
    const response = await koaGetStats(defaults.responseKey ? defaults.responseKey : "response-times");
    let myStats: Stats[] = response || []; // If repsonse is null create an empty object
        const event: Event = {
          method: ctx.req.method,
          route: koaFetchRoute(ctx),
          statusCode: ctx.res.statusCode,
          date: returnDateFull(),
          hour: returnHour(),
          responseTime: koaState.responseTime,
        };
        myStats.push(event);
        koaDumpStats(
          myStats,
          defaults.responseKey ? defaults.responseKey : "response-times"
        );
  } catch (error) {
    return error;
  }
};

// Fetches the number of events hit per day
export const koaFetchDailyStats = async (ctx: Context) => {
  try {
    const response = await koaGetStats(defaults.dailyKey ? defaults.dailyKey : "daily");
    let myStats: Stats[] = response  || []; // If repsonse is null create an empty object
    const event: Event = {
      method: ctx.req.method,
      route: koaFetchRoute(ctx),
      statusCode: ctx.res.statusCode,
      date: returnDateFull(),
    };
    if (response) {
      if (
        myStats.some(
          (
            item: Event // Check if the event already exists
          ) =>
            item.date === event.date &&
            item.method === event.method &&
            item.route === event.route &&
            item.statusCode === event.statusCode
        )
      ) {
        myStats.forEach((item: Event) => {
          // Check if events are equivalent
          if (
            item.date === event.date &&
            item.method === event.method &&
            item.route === event.route &&
            item.statusCode === event.statusCode
          ) {
            item.requests ? (item.requests += 1) : (item.requests = 1); // If the found event already exists then increment the number of requests
          }
        });
      } else {
        event.requests = 1; // If the event is not found then it's added the object
        myStats.push(event);
      }
    } else {
      // If the object is empty then push event to object
      event.requests = 1;
      myStats.push(event);
    }
    koaDumpStats(myStats, defaults.dailyKey ? defaults.dailyKey : "daily");
  } catch (error) {
    return error;
  }
};

// Fetches the number of events hit per hour
export const koaFetchHourlyStats = async (ctx: Context) => {
  try {
    const response:Stats[] = await koaGetStats(defaults.hourlyKey ? defaults.hourlyKey : "hourly");
    let myStats: Stats[];
    myStats = (response as Stats[]) || []; // If repsonse is null create an empty object
    const event: Event = {
      method: ctx.req.method,
      route: koaFetchRoute(ctx),
      statusCode: ctx.res.statusCode,
      date: returnDateFull(),
      hour: returnHour(),
    };
    if (response) {
      if (
        myStats.some(
          (
            item: Event // Check if the event already exists
          ) =>
            item.date === event.date &&
            item.hour === event.hour &&
            item.method === event.method &&
            item.route === event.route &&
            item.statusCode === event.statusCode
        )
      ) {
        myStats.forEach((item: Event) => {
          // Check if events are equivalent
          if (
            item.date === event.date &&
            item.hour === event.hour &&
            item.method === event.method &&
            item.route === event.route &&
            item.statusCode === event.statusCode
          ) {
            item.requests ? (item.requests += 1) : (item.requests = 1); // If the found event already exists then increment the number of requests
          }
        });
      } else {
        event.requests = 1; // If the event is not found then it's added the object
        myStats.push(event);
      }
    } else {
      // If the object is empty then push event to object
      event.requests = 1;
      myStats.push(event);
    }
    koaDumpStats(
      myStats,
      defaults.hourlyKey ? defaults.hourlyKey : "hourly"
    );
  } catch (error) {
    return error;
  }
};

// Fethces the total number of requests for each event hit
export const koaFetchTotalStats = async (ctx: Context) => {
  try {
    const response:Stats[] = await koaGetStats(defaults.totalKey ? defaults.totalKey : "total");
    let myStats: Stats[] = response || []; // If repsonse is null create an empty object
    const event: Event = {
      method: ctx.req.method,
      route: koaFetchRoute(ctx),
      statusCode: ctx.res.statusCode,
    };
    if (response) {
      // Check if the event already exists
      if (
        myStats.some(
          (item: Event) =>
            item.method === event.method &&
            item.route === event.route &&
            item.statusCode === event.statusCode
        )
      ) {
        myStats.forEach((item: Event) => {
          // check if events are equivalent
          if (
            item.method === event.method &&
            item.route === event.route &&
            item.statusCode === event.statusCode
          ) {
            item.requests ? (item.requests += 1) : (item.requests = 1); // If the found event already exists then increment the number of requests
          }
        });
      } else {
        event.requests = 1;
        myStats.push(event); // If the event is not found then add it to the object
      }
    } else {
      event.requests = 1;
      myStats.push(event); // If the object is empty then push event to object
    }
    koaDumpStats(myStats, defaults.totalKey ? defaults.totalKey : "total");
  } catch (error) {
    return error;
  }
};
