export interface ICorsConfig {
  methods: string | string;
  origin: string | string[];
}

export interface IPagination {
  pageNumber: number;
  pageSize: number;
}
