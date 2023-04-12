import { resolve } from 'path';
import { fileURLToPath } from 'url';

export const DATA_DIR = resolve(fileURLToPath(import.meta.url), '..', '..', '..', 'data');

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
