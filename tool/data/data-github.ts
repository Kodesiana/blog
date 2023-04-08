import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import axios from 'axios';

import { DataContract, IDataProvider } from './types';
import { fileExists } from '../utils/fs-utils';
import { CACHE_DATA_TTL } from '../utils/cache';
import { RepoSummary, Repository } from './data-github.types';

export type GitHubDataType = DataContract<RepoSummary[]>;

export class GithubDataProvider implements IDataProvider {
  private _dataPath: string;

  public name = 'GitHub repositories';

  constructor() {
    this._dataPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../data/github_repos.json');
  }

  async shouldFetch(): Promise<boolean> {
    // check if we don't have a cached version
    if (!(await fileExists(this._dataPath))) {
      return true;
    }

    // check if cached data is stale
    const cachedData = JSON.parse(await fs.readFile(this._dataPath, 'utf-8')) as GitHubDataType;
    if (new Date().getTime() - new Date(cachedData.lastUpdated).getTime() > CACHE_DATA_TTL) {
      return true;
    }

    // data is not cached and is stalled
    return false;
  }

  async fetch(): Promise<void> {
    // run query against github api
    const response = await axios.post(
      'https://api.github.com/graphql',
      {
        query: `
        query { 
          viewer {
            repositories(
                first:100
                isFork: false
                privacy: PUBLIC
                ownerAffiliations: OWNER
                orderBy: { field: PUSHED_AT, direction: DESC }
            ) {
              totalCount
              pageInfo {
                endCursor
                startCursor
                hasNextPage
                hasPreviousPage
              }
              nodes {
                name
                description
                url
                forkCount 
                stargazerCount 
                isArchived 
                updatedAt
                pushedAt
                issues {
                    totalCount
                } 
              }
            }
          }
        }`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    // sort repositories by last updated date
    const body: Repository = response.data;
    const repositories = body.data.viewer.repositories.nodes;

    // construct data contract
    const repos: GitHubDataType = {
      filePath: this._dataPath,
      lastUpdated: new Date(),
      data: repositories.map((x) => ({
        name: x.name,
        description: x.description || '',
        url: x.url,
        forkCount: x.forkCount,
        stargazerCount: x.stargazerCount,
        issuesCount: x.issues.totalCount,
        isArchived: x.isArchived,
        updatedAt: x.updatedAt,
        pushedAt: x.pushedAt,
      })),
    };

    // save to file
    await fs.writeFile(this._dataPath, JSON.stringify(repos, null, 2));
  }
}
