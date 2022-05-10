import { ExecutionResult, graphql } from 'graphql';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Variables } from 'relay-runtime';
import { handleCors } from '../../lib/cors';
import { schema, rootValue, dataDrivenDependencies } from '../../lib/graphql';
import queryMap from '../../queryMap.json';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await handleCors(req, res);

  const requestParams = req.body as
    | {
        id: never;
        query: string;
        variables: Variables;
      }
    | {
        id: string;
        query: never;
        variables: Variables;
      }
    | null
    | undefined;

  let response: undefined | null | ExecutionResult = { data: null };
  if (req.method === 'POST' && requestParams) {
    const mappedQueries = queryMap as Record<string, string>;

    dataDrivenDependencies.reset();
    response = await graphql({
      schema,
      rootValue,
      source:
        requestParams && requestParams.id
          ? mappedQueries[requestParams.id]
          : requestParams.query,
      variableValues: requestParams.variables,
    });
  }

  if (response?.errors != null) {
    // eslint-disable-next-line no-console
    console.error('GraphQL Server Errors', response.errors);
  }

  response.extensions = {
    modules: dataDrivenDependencies.getModules(),
  };

  return res.status(200).json(response);
};

export default handler;
