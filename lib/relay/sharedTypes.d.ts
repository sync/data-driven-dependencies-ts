/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextPage } from 'next';
import type { PreloadedQuery } from 'react-relay';
import type { OperationType } from 'relay-runtime';
import { QueryResponseCache } from 'relay-runtime';
import type { Network } from 'relay-runtime/lib/network/RelayNetworkTypes';

export type QueryRefs<T extends OperationType = any> = Record<
  string,
  PreloadedQuery<T>
>;

export type NextRelayPage<T = {}> = NextPage<{ queryRefs: QueryRefs } & T>;

export type NetworkWithResponseCache = Network & {
  responseCache: QueryResponseCache;
};
