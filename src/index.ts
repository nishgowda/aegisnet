import redis from 'async-redis';
import { Event, Stats } from './types/stats';
import { NextFunction, Response, Request } from 'express';

export class AegisNet {
  private connectionString;
  protected client: any;
  constructor(connectionString: string) {
    this.connectionString = connectionString;
    this.client = redis.createClient(this.connectionString);
  }

  /* 
    Fetches the endpoint of url in custom form of:
    /{endpoint}/
  */
  private fetchRoute = (req: Request) => {
    const route: string = req.route ? req.route.path : '';
    const baseUrl: string = req.baseUrl ? req.baseUrl : '';
    return route ? `${baseUrl === '/' ? '' : baseUrl}${route}` : 'unknown route';
  };

  // Retrieve the stats from persistance storage and parse the JSON
  private getStats = async (key: string) => {
    let data = {};
    try {
      const value = await this.client.get(key);
      data = JSON.parse(value);
    } catch (error) {
      throw error;
    }
    return data;
  };

  // Reset the value of key with updated stats and endpoints
  private dumpStats = async (stats: Event[], key: string) => {
    try {
      switch (key) {
        case 'daily':
          this.client.set(key, JSON.stringify(stats));
          break;
        case 'total':
          this.client.set(key, JSON.stringify(stats));
          break;
        case 'hourly':
          this.client.set(key, JSON.stringify(stats));
          break;
        default:
          break;
      }
    } catch (error) {
      throw error;
    }
  };

  // Helper to return date in MM/DD/YYYY format
  private returnDateFull = () => {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; // Months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const newDate = month + '/' + day + '/' + year;
    return newDate;
  };

  private returnHour = () => {
    const dateObj = new Date();
    const hour = dateObj.getHours();
    return `${hour}`;
  }
  /* 
    Active listener to be used as middleware with express
    every time an endpoint is hit we update the key with called endpoints and stats
  */
  listen = async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      this.fetchDailyStats(req, res);
      this.fetchHourlyStats(req, res);
      this.fetchTotalStats(req, res);
    });
    next();
  };

  // Fetches the number of events hit per day
  private fetchDailyStats = async (req: Request, res: Response) => {
    try {
      this.getStats('daily')
        .then((response) => {
          let myStats: Stats[];
          myStats = (response as Stats[]) || []; // If repsonse is null create an empty object
          const newDate = this.returnDateFull();
          const event: Event = {
            method: req.method,
            route: this.fetchRoute(req),
            statusCode: res.statusCode,
            date: newDate,
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
          this.dumpStats(myStats, 'daily');
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      throw error;
    }
  };
  private fetchHourlyStats = async (req: Request, res: Response) =>  {
    try {
      this.getStats('hourly')
        .then((response) => {
          let myStats: Stats[];
          const newDate = this.returnDateFull();
          const hour = this.returnHour();
          myStats = (response as Stats[]) || []; // If repsonse is null create an empty object
          const event: Event = {
            method: req.method,
            route: this.fetchRoute(req),
            statusCode: res.statusCode,
            date: newDate,
            hour: hour
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
          this.dumpStats(myStats, 'hourly');
        })
        .catch((err) => {
          throw err;
        });
          
    }catch(error) {
      throw error;
      }
  }

  // Fethces the total number of requests for each event hit
  private fetchTotalStats = async (req: Request, res: Response) => {
    try {
      this.getStats('total')
        .then((response) => {
          let myStats: Stats[];
          myStats = (response as Stats[]) || []; // If repsonse is null create an empty object
          const event: Event = {
            method: req.method,
            route: this.fetchRoute(req),
            statusCode: res.statusCode,
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
          this.dumpStats(myStats, 'total');
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      throw error;
    }
  };
}
