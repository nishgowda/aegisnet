import { Options } from "./types/options";
import {
  expressState,
  expressFetchDailyStats,
  expressFetchHourlyStats,
  expressFetchResponseTimes,
  expressFetchTotalStats,
} from "./aegis/aegis-express";
import {
  koaState,
  koaFetchDailyStats,
  koaFetchResponseTimes,
  koaFetchHourlyStats,
  koaFetchTotalStats,
} from "./aegis/aegis-koa";
import {
  httpFetchDailyStats,
  httpFetchHourlyStats,
  httpFetchResponseTimes,
  httpFetchTotalStats,
  httpState,
} from "./aegis/aeigs-http";
import { getResponseTime } from "./utils/times";
import { defaults, setOptions } from "./utils/defaults";
import { redisClient } from "./utils/client";
import { NextFunction, Request, Response } from "express";
import { Context, Next } from "koa";
import { IncomingMessage, ServerResponse } from "http";

export class AegisNet {
  express(options?: Options) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (options?.port || options?.host) {
        redisClient(options);
      } else {
        redisClient(defaults);
      }
      options ? setOptions(options) : setOptions(defaults);
      const start = process.hrtime();
      res.on("finish", () => {
        expressState.responseTime = getResponseTime(start);
        expressFetchDailyStats(req, res);
        expressFetchHourlyStats(req, res);
        expressFetchTotalStats(req, res);
        expressFetchResponseTimes(req, res);
      });
      next();
    };
  }

  koa(options?: Options) {
    return (ctx: Context, next: Next) => {
      if (options?.port || options?.host) {
        redisClient(options);
      } else {
        redisClient(defaults);
      }
      options ? setOptions(options) : setOptions(defaults);
      const start = process.hrtime();
      ctx.res.on("finish", () => {
        koaState.responseTime = getResponseTime(start);
        koaFetchDailyStats(ctx);
        koaFetchHourlyStats(ctx);
        koaFetchTotalStats(ctx);
        koaFetchResponseTimes(ctx);
      });
      next();
    };
  }
  
  http(req: IncomingMessage, res: ServerResponse, options?: Options) {
    if (options?.port || options?.host) {
      redisClient(options);
    } else {
      redisClient(defaults);
    }
    options ? setOptions(options) : setOptions(defaults);
    const start = process.hrtime();
    res.on("finish", () => {
      httpState.responseTime = getResponseTime(start);
      httpFetchDailyStats(req, res);
      httpFetchHourlyStats(req, res);
      httpFetchTotalStats(req, res);
      httpFetchResponseTimes(req, res);
    });
  }
}
