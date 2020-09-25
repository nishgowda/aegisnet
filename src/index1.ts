import { Options } from './types/options'
import { expressState, expressFetchDailyStats, expressFetchHourlyStats, expressFetchResponseTimes, expressFetchTotalStats } from './aegis/aegis-express';
import { koaState, koaFetchDailyStats, koaFetchResponseTimes, koaFetchHourlyStats, koaFetchTotalStats } from './aegis/aegis-koa'
import { getResponseTime } from './utils/times'
import { defaults, setOptions} from './utils/defaults'
import { redisClient } from './utils/client'
import { NextFunction, Request, Response } from 'express';
import { Context, Next } from 'koa';

export default class AegisNet {

    express(options?: Options) {
        return function (req: Request, res: Response, next: NextFunction) {
            if (options?.port || options?.host) {
                redisClient(options);
            } else {
                redisClient(defaults);
            }
            options ? setOptions(options) : setOptions(defaults);
            const start = process.hrtime();
            res.on('finish', () => {
                expressState.responseTime = getResponseTime(start);
                expressFetchDailyStats(req, res);
                expressFetchHourlyStats(req, res);
                expressFetchTotalStats(req, res);
                expressFetchResponseTimes(req, res);
            });
            next();
        }
    } 

    koa(options?: Options) {
        return function (ctx: Context, next: Next) {
            if (options?.port || options?.host) {
                redisClient(options);
            } else {
                redisClient(defaults);
            }
            options ? setOptions(options) : setOptions(defaults);
            const start = process.hrtime();
            ctx.res.on('finish', () => {
                koaState.responseTime = getResponseTime(start);
                koaFetchDailyStats(ctx);
                koaFetchHourlyStats(ctx);
                koaFetchTotalStats(ctx);
                koaFetchResponseTimes(ctx);
            });
            next(); 
        }
}
     
}
