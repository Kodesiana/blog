export type Repository = {
  data: {
    repositoryOwner: {
      repositories: Repositories;
    };
  };
};

export type Repositories = {
  totalCount: number;
  pageInfo: PageInfo;
  nodes: Node[];
};

export type Node = {
  name: string;
  description: null | string;
  url: string;
  forkCount: number;
  stargazerCount: number;
  isArchived: boolean;
  updatedAt: Date;
  pushedAt: Date;
  issues: {
    totalCount: number;
  };
};

export type PageInfo = {
  endCursor: string;
  startCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type RepoSummary = {
  name: string;
  description: string;
  url: string;
  forkCount: number;
  issuesCount: number;
  stargazerCount: number;
  isArchived: boolean;
  updatedAt: Date;
  pushedAt: Date;
};
