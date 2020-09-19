import redis from 'async-redis';
import { Stats } from './types/stats';
import { Req, Res } from './types/url';

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

  #fetchRoute = (req: Req) => {
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

  #dumpStats = async (stats: any, key: string) => {
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

  listen = async (req: Req, res: Res, next: any) => {
    res.on('finish', () => {
      this.#getStats('stats')
        .then((response) => {
          if (!response) {
            const event = `${req.method} ${this.#fetchRoute(req)} ${res.statusCode}`;
            let myStats: Stats;
            myStats = { event };
            myStats[event] = myStats[event] ? myStats[event] + 1 : 1;
            this.#dumpStats(myStats, 'stats');
          } else {
            let myStats: Stats;
            myStats = response;
            const event = `${req.method} ${this.#fetchRoute(req)} ${res.statusCode}`;
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
