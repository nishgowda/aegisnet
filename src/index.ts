import redis from 'async-redis';
import { Stats } from './types/stats';
import { NextFunction, Response, Request } from 'express';

export class Aegis {
  persistance: string;
  connectionString: string;
  client: any;
  constructor(persistance: string, connectionString: string) {
    this.persistance = persistance;
    this.connectionString = connectionString;
    switch (this.persistance) {
      case 'redis':
        this.client = redis.createClient(this.connectionString);
    }
  }

  #fetchRoute = (req: Request) => {
    const route: string = req.route ? req.route.path : '';
    const baseUrl: string = req.baseUrl ? req.baseUrl : '';
    return route ? `${baseUrl === '/' ? '' : baseUrl}${route}` : 'unknown route';
  };

  #getStats = async (key: string) => {
    let data = {};
    try {
      switch (this.persistance) {
        case 'redis':
          try {
            const value = await this.client.get(key);
            data = JSON.parse(value);
          } catch (err) {
            throw err;
          }
      }
    } catch (error) {
      throw error;
    }
    return data;
  };

  #dumpStats = async (stats: Stats, key: string) => {
    try {
      switch (this.persistance) {
        case 'redis':
          try {
            this.client.set(key, JSON.stringify(stats));
          } catch (err) {
            throw err;
          }
      }
    } catch (error) {
      throw error;
    }
  };
    #returnDate = () => {
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();
        let newDate = year + "/" + month + "/" + day;
        return newDate;
  }
  listen = async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      this.#getStats('stats')
        .then((response) => {
            if (!response) {
            const newDate = this.#returnDate();
            const event = `${newDate}: ${req.method} ${this.#fetchRoute(req)} ${res.statusCode}`;
            let myStats: Stats;
            myStats = {};
            myStats[event] = myStats[event] ? myStats[event] + 1 : 1;
            this.#dumpStats(myStats, 'stats');
            } else {
            let myStats: Stats;
            myStats = response;
            const newDate = this.#returnDate();
            const event = `${newDate}:${req.method} ${this.#fetchRoute(req)} ${res.statusCode}`;
            myStats[event] = myStats[event] ? myStats[event] + 1 : 1;
            this.#dumpStats(myStats, 'stats');
          }
        })
        .catch((err) => {
          throw err;
        });
    });
    next();
  };
}
