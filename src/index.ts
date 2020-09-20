import redis from 'async-redis';
import { Event } from './types/stats';
import { NextFunction, Response, Request } from 'express';

export class Aegis {
  private connectionString: string;
  protected client: any;
  constructor(connectionString: string) {
    this.connectionString = connectionString;
    this.client = redis.createClient(this.connectionString);
  }

  /* 
    Fetches the endpoint of url in custom form of
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
          this.client.set(key, JSON.stringify(stats))
          break;
        default:
          break;
      }
    } catch (error) {
      throw error;
    }
  };

  // Helper to return date in MM/DD/YYYY format
  private returnDate = () => {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; // Months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const newDate = day + '/' + month + '/' + year;
    return newDate;
  };
    
   /* 
    Active listener to be used as middleware with express
    every time an endpoint is hit we update the key with called endpoints and stats
   */
  listen = async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      this.fetchDailyStats(req, res);
      this.fetchTotalStats(req, res);
    });
    next();
  };

  private fetchDailyStats = async (req: Request, res: Response) => {
    try {
          this.getStats('daily')
            .then((response) => {
              let myStats: Event[];
              myStats = [response] || [{}]; // If repsonse is null create an empty object
              const newDate = this.returnDate();
              const event: Event = {
                method: req.method,
                route: this.fetchRoute(req),
                statusCode: res.statusCode,
                date: newDate
              }
              if (response) {
                myStats.map((item: any) => {
                  if (item[0].date == event.date && item[0].method == event.method && item[0].route == event.route && item[0].statusCode == event.statusCode) {
                    item[0].requests ? item[0].requests += 1 : item[0].requests = 1;
                  } else {
                    event.requests = 1;
                    myStats.push(event);
                  }
                })
              } else {
                event.requests = 1;
                myStats[0] = event
              }
              this.dumpStats(myStats, 'daily');
            })
            .catch((err) => {
              throw err;
            });
    } catch (error) {
      throw error;
    }
  }

  private fetchTotalStats = async (req: Request, res: Response) => {
    try {
      this.getStats('total')
        .then((response) => {
          let myStats: Event[];
          myStats = [response] || [{}]; // If repsonse is null create an empty object
              
              const event: Event = {
                method: req.method,
                route: this.fetchRoute(req),
                statusCode: res.statusCode,
              };
              if (response) {
                myStats.map((item: any) => {
                  if (item[0].method == event.method && item[0].route == event.route && item[0].statusCode == event.statusCode) {
                    item[0].requests ? item[0].requests += 1 : item[0].requests = 1;
                  } else {
                    event.requests = 1;
                    myStats.push(event)
                  }
                })
              } else {
                event.requests = 1;
                myStats[0] = (event);
              }
              this.dumpStats(myStats, 'total');
            })
            .catch((err) => {
              throw err;
            });
    } catch (error) {
      throw error;
    }
  }
}

export class AegisWeb extends Aegis {

  web = async(res: Response) => {
    const value = await this.client.mget(['daily', 'total'])
    console.log('value', (value))
    res.render('../src/views/web.ejs', { value });
  }
}
