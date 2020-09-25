import Redis from 'ioredis'
import { Options } from '../types/options'
import { defaults } from './defaults'

export const redisClient = (options: Options) => {
    if (options.host && options.host) {
        client = new Redis(({ host: options.host, port: options.port }));
    } else {
        client = new Redis(({ host: defaults.host, port: defaults.port }));
    }
    return client;
}

export let client: any;