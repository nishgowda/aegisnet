import { Response, Request } from "express";
import { Event, Stats } from "../types/stats";
import { client } from "../utils/client";
import { returnDateFull, returnHour } from "../utils/times";
import { defaults } from "../utils/defaults";

export let expressState = {
  responseTime: 0 as number,
};

const expressFetchRoute = (req: Request) => {
  const route: string = req.route ? req.route.path : "";
  const baseUrl: string = req.baseUrl ? req.baseUrl : "";
  return route ? `${baseUrl === "/" ? "" : baseUrl}${route}` : "unknown route";
};

// Retrieve the stats from persistance storage and parse the JSON
const expressGetStats = async (key: string) => {
  let data = {};
  try {
    const value = await client.get(key);
    data = JSON.parse(value);
  } catch (error) {
    throw error;
  }
  return data;
};

// Reset the value of key with updated stats and endpoints
const expressDumpStats = async (stats: Event[], key: string) => {
  try {
    client.set(key, JSON.stringify(stats));
  } catch (error) {
    throw error;
  }
};

// Fetch the event and the the response time of each event.
export const expressFetchResponseTimes = async (
  req: Request,
  res: Response
) => {
  try {
    expressGetStats(
      defaults.responseKey ? defaults.responseKey : "response-times"
    )
      .then((response) => {
        let myStats: Stats[];
        myStats = (response as Stats[]) || []; // If repsonse is null create an empty object
        const event: Event = {
          method: req.method,
          route: expressFetchRoute(req),
          statusCode: res.statusCode,
          date: returnDateFull(),
          hour: returnHour(),
          responseTime: expressState.responseTime,
        };
        myStats.push(event);
        expressDumpStats(
          myStats,
          defaults.responseKey ? defaults.responseKey : "response-times"
        );
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    throw error;
  }
};

// Fetches the number of events hit per day
export const expressFetchDailyStats = async (req: Request, res: Response) => {
  try {
    expressGetStats(defaults.dailyKey ? defaults.dailyKey : "daily")
      .then((response) => {
        let myStats: Stats[];
        myStats = (response as Stats[]) || []; // If repsonse is null create an empty object
        const event: Event = {
          method: req.method,
          route: expressFetchRoute(req),
          statusCode: res.statusCode,
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
            myStats.map((item: Event) => {
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
        expressDumpStats(
          myStats,
          defaults.dailyKey ? defaults.dailyKey : "daily"
        );
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    throw error;
  }
};
// Fetch stats per hour
export const expressFetchHourlyStats = async (req: Request, res: Response) => {
  try {
    expressGetStats(defaults.hourlyKey ? defaults.hourlyKey : "hourly")
      .then((response) => {
        let myStats: Stats[];
        myStats = (response as Stats[]) || []; // If repsonse is null create an empty object
        const event: Event = {
          method: req.method,
          route: expressFetchRoute(req),
          statusCode: res.statusCode,
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
            myStats.map((item: Event) => {
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
        expressDumpStats(
          myStats,
          defaults.hourlyKey ? defaults.hourlyKey : "hourly"
        );
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    throw error;
  }
};

// Fethces the total number of requests for each event hit
export const expressFetchTotalStats = async (req: Request, res: Response) => {
  try {
    expressGetStats(defaults.totalKey ? defaults.totalKey : "total")
      .then((response) => {
        let myStats: Stats[];
        myStats = (response as Stats[]) || []; // If repsonse is null create an empty object
        const event: Event = {
          method: req.method,
          route: expressFetchRoute(req),
          statusCode: res.statusCode,
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
            myStats.map((item: Event) => {
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
        expressDumpStats(
          myStats,
          defaults.totalKey ? defaults.totalKey : "total"
        );
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    throw error;
  }
};
