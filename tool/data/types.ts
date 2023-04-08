export type DataContract<T> = {
  filePath: string;
  lastUpdated: Date;
  data: T;
};

export interface IDataProvider {
  name: string;

  shouldFetch(): Promise<boolean>;
  fetch(): Promise<void>;
}
