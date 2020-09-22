export interface Stats {
  [key: number]: Event;
}

export type Event = {
  method?: string;
  route?: string;
  statusCode?: number;
  date?: string;
  hour?: string;
  requests?: number;
  responseTime?: number;
};
