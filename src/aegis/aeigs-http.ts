import { Event, Stats } from '../types/stats';
import { client } from '../utils/client';
import { returnDateFull, returnHour} from '../utils/times'
import {defaults} from '../utils/defaults'
export let httpState = {
    responseTime: 0 as number
} 

const httpFetchRoute = (req: Request) => {
    const route: string = req.url ? req.url : 'unkown';
    // const baseUrl: string = req. ? req.url : '';
    if (!route) {
      return 'unkown route';
    }
      return route
  };

  // Retrieve the stats from persistance storage and parse the JSON
  const httpGetStats = async (key: string) => {
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
  const httpDumpStats = async (stats: Event[], key: string) => {
    try {
      client.set(key, JSON.stringify(stats))
    } catch (error) {
      throw error;
    }
  };

  // Helper to return date in MM/DD/YYYY format



  // Fetch the event and the the response time of each event.
 export const httpFetchResponseTimes = async (req: Request, res: Response) => {
    try {
      httpGetStats(defaults.responseKey ? defaults.responseKey : 'response-times')
        .then((response) => {
          let myStats: Stats[];
          myStats = (response as Stats[]) || []; // If repsonse is null create an empty object
          const event: Event = {
            method: req.method,
            route: httpFetchRoute(req),
            statusCode: res.status,
            date: returnDateFull(),
            hour: returnHour(),
            responseTime: httpState.responseTime,
          };
          myStats.push(event);
          httpDumpStats(myStats, defaults.responseKey ? defaults.responseKey : 'response-times');
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      throw error;
    }
  };

  // Fetches the number of events hit per day
 export const httpFetchDailyStats = async (req: Request, res: Response) => {
   try {

      httpGetStats(defaults.dailyKey ? defaults.dailyKey : 'daily')
        .then((response) => {
          let myStats: Stats[];
          myStats = (response as Stats[]) || []; // If repsonse is null create an empty object
          const event: Event = {
            method: req.method,
            route: httpFetchRoute(req),
            statusCode: res.status,
            date: returnDateFull(),
          };
          if (response) {
            if (
              myStats.some(
                (
                  item: Event, // Check if the event already exists
                ) =>
                  item.date === event.date &&
                  item.method === event.method &&
                  item.route === event.route &&
                  item.statusCode === event.statusCode,
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
          httpDumpStats(myStats, defaults.dailyKey ? defaults.dailyKey : 'daily');
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      throw error;
    }
  };
  export const httpFetchHourlyStats = async (req: Request, res: Response) => {
    try {
      httpGetStats(defaults.hourlyKey ? defaults.hourlyKey : 'hourly')
        .then((response) => {
          let myStats: Stats[];
          myStats = (response as Stats[]) || []; // If repsonse is null create an empty object
          const event: Event = {
            method: req.method,
            route: httpFetchRoute(req),
            statusCode: res.status,
            date: returnDateFull(),
            hour: returnHour(),
          };
          if (response) {
            if (
              myStats.some(
                (
                  item: Event, // Check if the event already exists
                ) =>
                  item.date === event.date &&
                  item.hour === event.hour &&
                  item.method === event.method &&
                  item.route === event.route &&
                  item.statusCode === event.statusCode,
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
          httpDumpStats(myStats, defaults.hourlyKey ? defaults.hourlyKey : 'hourly');
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      throw error;
    }
  };

  // Fethces the total number of requests for each event hit
  export const httpFetchTotalStats = async (req: Request, res: Response) => {
    try {
      httpGetStats(defaults.totalKey ? defaults.totalKey : 'total')
        .then((response) => {
          let myStats: Stats[];
          myStats = (response as Stats[]) || []; // If repsonse is null create an empty object
          const event: Event = {
            method: req.method,
            route: httpFetchRoute(req),
            statusCode: res.status,
          };
          if (response) {
            // Check if the event already exists
            if (
              myStats.some(
                (item: Event) =>
                  item.method === event.method && item.route === event.route && item.statusCode === event.statusCode,
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
          httpDumpStats(myStats, defaults.totalKey?  defaults.totalKey: 'total');
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      throw error;
    }
  };


