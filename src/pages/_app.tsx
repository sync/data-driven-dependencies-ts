import '../styles/globals.css';
import { Suspense, useMemo } from 'react';
import { ReactRelayContext, useRelayEnvironment } from 'react-relay';
import { GraphQLResponse, RequestParameters, Variables } from 'relay-runtime';
import { Layout } from '../components/LayoutComponents';
import { createEnvironment } from '../lib/relay/environment';
import { NetworkWithResponseCache, QueryRefs } from '../lib/relay/sharedTypes';

type PreloadedQueries = Record<
  string,
  {
    params: RequestParameters;
    response: GraphQLResponse;
    variables: Variables;
  }
>;

function Hydrate<T extends { preloadedQueries: PreloadedQueries }>({
  Component,
  props,
}: {
  Component: React.ComponentType;
  props: T;
}) {
  const environment = useRelayEnvironment();

  const transformedProps = useMemo(() => {
    if (props == null) {
      return props;
    }
    const { preloadedQueries, ...otherProps } = props;
    if (preloadedQueries == null) {
      return props;
    }

    const queryRefs: QueryRefs = {};
    for (const [queryName, { params, variables, response }] of Object.entries(
      preloadedQueries,
    )) {
      if (params.id) {
        (
          environment.getNetwork() as NetworkWithResponseCache
        ).responseCache.set(params.id, variables, response);
        // TODO: create using a function exported from react-relay package
        queryRefs[queryName] = {
          environment,
          fetchKey: params.id,
          fetchPolicy: 'store-or-network',
          isDisposed: false,
          name: params.name,
          kind: 'PreloadedQuery',
          variables,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          dispose: () => {},
        };
      }
    }

    return { ...otherProps, queryRefs };
  }, [props, environment]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Component {...(transformedProps as any)} />;
}

const getBaseUrl = (
  baseUrlFromProps: string | null | undefined,
  fallbackUrl = 'http://localhost:3000',
) => {
  if (baseUrlFromProps) {
    return baseUrlFromProps;
  }

  if (
    typeof window !== 'undefined' &&
    window.location.protocol &&
    window.location.host
  ) {
    return `${window.location.protocol}//${window.location.host}`;
  }

  return fallbackUrl;
};

export default function RelayApp<
  T extends {
    baseUrl: string | undefined | null;
    preloadedQueries: PreloadedQueries;
  },
>({ Component, pageProps }: { Component: React.ComponentType; pageProps: T }) {
  const { baseUrl, ...otherProps } = pageProps;

  const environment = useMemo(
    () => createEnvironment(getBaseUrl(baseUrl)),
    [baseUrl],
  );
  return (
    <Layout>
      <ReactRelayContext.Provider value={{ environment }}>
        <Suspense fallback={null}>
          <Hydrate Component={Component} props={otherProps} />
        </Suspense>
      </ReactRelayContext.Provider>
    </Layout>
  );
}
