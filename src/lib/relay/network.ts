import {
  FetchFunction,
  GraphQLResponse,
  GraphQLSingularResponse,
  Network,
  QueryResponseCache,
  Variables,
} from 'relay-runtime';

import { registerLoader } from '../moduleLoader';
import { NetworkWithResponseCache } from './sharedTypes';

const ONE_MINUTE_IN_MS = 60 * 1000;

export function createNetwork(baseUrl: string) {
  const responseCache = new QueryResponseCache({
    size: 100,
    ttl: ONE_MINUTE_IN_MS,
  });

  const fetchResponse: FetchFunction = async (
    operation,
    variables,
    cacheConfig,
  ) => {
    const { id } = operation;

    const isQuery = operation.operationKind === 'query';
    const forceFetch = cacheConfig && cacheConfig.force;
    if (isQuery && !forceFetch && id) {
      const fromCache = responseCache.get(id, variables);
      if (fromCache != null) {
        return Promise.resolve(fromCache);
      }
    }

    return networkFetch(id, variables, baseUrl);
  };

  const fetchFn: FetchFunction = async (...args) => {
    const response = (await fetchResponse(...args)) as GraphQLResponse;

    if (Array.isArray(response)) {
      const responses = response as GraphQLSingularResponse[];
      responses.forEach((singleResponse) => {
        if (Array.isArray(singleResponse.extensions?.modules)) {
          registerModuleLoaders(singleResponse.extensions?.modules as string[]);
        }
      });
    } else {
      const singleResponse = response as GraphQLSingularResponse;
      if (Array.isArray(singleResponse.extensions?.modules)) {
        registerModuleLoaders(singleResponse.extensions?.modules as string[]);
      }
    }

    return response;
  };

  const network = Network.create(fetchFn) as NetworkWithResponseCache;
  network.responseCache = responseCache;

  return network;
}

export async function networkFetch(
  id: string | undefined | null,
  variables: Variables,
  baseUrl: string,
) {
  const response = await fetch(`${baseUrl}/api/graphql`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      variables,
    }),
  });
  return response.json();
}

function registerModuleLoaders(modules: string[]) {
  modules.forEach((module) => {
    if (module.endsWith('$normalization.graphql')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      registerLoader(module, () => import(`../../__generated__/${module}`));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      registerLoader(module, () => import(`../../components/${module}`));
    }
  });
}
