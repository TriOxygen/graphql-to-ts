import GraphQLToTs from './';
import fs from 'fs';

const go = async () => {
  const types = await GraphQLToTs('http://localhost:8001/graphql', {
    // module: 'api',
    prefix: `import { GraphQLResolveInfo, GraphQLOutputType, GraphQLFieldConfigArgumentMap } from 'graphql';

const Types = {};

export interface Context {
  request: any;
}

export type Resolver<T> = {
  [U in keyof Partial<typeof Types>]: {
    [P in keyof Partial<T>]: (parent: T, args: any, ctx: Context, info: GraphQLResolveInfo) => any;
  };
};

export interface Queries {
  [key: string]: {
    type: GraphQLOutputType;
    args?: GraphQLFieldConfigArgumentMap;
  };
}

export interface Mutations {
  [key: string]: {
    type: GraphQLOutputType;
    args?: GraphQLFieldConfigArgumentMap;
  };
}

export interface Schema {
  Query?: Queries;
  Mutation?: Mutations;
}

export enum BusinessType {
  BusinessToCustomer = 'BUSINESS_TO_CUSTOMER',
}

export enum CustomerType {
  Individual = 'INDIVIDUAL',
}

export enum Brand {
  Comhem = 'comhem',
}

export enum UserAgent {
  ComHemWeb = 'comhem-web',
}

export type SchemaCreator = () => Schema;


  `,
  });

  fs.writeFile('./Types.ts', types, { flag: 'w' }, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('Types successfully saved to types.ts!');
  });
};

go();
