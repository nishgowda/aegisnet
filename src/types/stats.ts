export interface Stats {
  [key: number]: Event;
}

export type Event = {
  method?: string;
  route?: string;
  statusCode?: number;
  date?: string;
  requests?: number;
};
