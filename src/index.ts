import redis from 'async-redis';
import { Stats } from './types/stats';
import { NextFunction, Response, Request } from 'express';

export class Aegis {
  private connectionString: string;
  private client: any;
  constructor(connectionString: string) {
    this.connectionString = connectionString;
    this.client = redis.createClient(this.connectionString);
    
  }

  /* 
    Fetches the endpoint of url in custom form of
    /{endpoint}/
  */
  #fetchRoute = (req: Request) => {
    const route: string = req.route ? req.route.path : '';
    const baseUrl: string = req.baseUrl ? req.baseUrl : '';
    return route ? `${baseUrl === '/' ? '' : baseUrl}${route}` : 'unknown route';
  };

  // Retrieve the stats from persistance storage and parse the JSON
  #getStats = async (key: string) => {
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
  #dumpStats = async (stats: Stats, key: string) => {
    try {
        this.client.set(key, JSON.stringify(stats));
    } catch (error) {
      throw error;
    }
  };
  // Helper to return date in YYYY/MM/DD format
  #returnDate = () => {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; // Months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const newDate = year + '/' + month + '/' + day;
    return newDate;
  };
    
   /* 
    Active listener to be used as middleware with express
    every time an endpoint is hit we update the key with called endpoints and stats
   */
  listen = async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      this.#getStats('stats')
        .then((response) => {
          let myStats: Stats;
          myStats = response || {}; // If repsonse is null create an empty object
          const newDate = this.#returnDate();
          const event = JSON.stringify({
            date: newDate,
            method: req.method,
            route: this.#fetchRoute(req),
            statusCode: res.statusCode,
          });
          myStats[event] = myStats[event] ? myStats[event] + 1 : 1;
          this.#dumpStats(myStats, 'stats');
        })
        .catch((err) => {
          throw err;
        });
    });
    next();
  };
}
