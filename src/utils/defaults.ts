import { Options } from '../types/options'

export let defaults: Options = {
    totalKey: 'total',
    dailyKey: 'daily',
    hourlyKey: 'hourly',
    responseKey: 'response-times',
    server: 'express'
}

export const setOptions = (options: Options) => {
    console.log(options)
    defaults = options;
    console.log('defaults',defaults);
}