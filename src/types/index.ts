export interface IDataItem {
  type: string;
  model: string;
  created_at: string;
  usage_input: number;
  usage_output: number;
  totalCost: number;
}

export interface IFilterOptions {
  types: string[];
  models: string[];
}

export interface IFilters {
  type: string;
  model: string;
}

export interface IChartDataItem {
  created_at: string;
  totalCost: number;
}

export interface IUsage {
  model: string;
  usage_input: string;
  usage_output: string;
}

export interface ICost {
  model: string;
  input: string;
  output: string;
}

export interface ICostMap {
  [model: string]: {
    input: number;
    output: number;
  };
}
