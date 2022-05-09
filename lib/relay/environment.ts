import {Environment, RecordSource, Store} from 'relay-runtime';

import moduleLoader from '../moduleLoader';
import {createNetwork} from './network';
import {NetworkWithResponseCache} from './sharedTypes';

const IS_SERVER = typeof window === typeof undefined;
const CLIENT_DEBUG = false;
const SERVER_DEBUG = false;

export function createEnvironment() {
  // Operation loader is reponsible for loading JS modules/components
  // for data-processing and rendering
  const operationLoader = {
    get: (name: string) => moduleLoader(name).get(),
    load: (name: string) => moduleLoader(name).load(),
  };

  const network = createNetwork();
  const environment = new Environment({
    network,
    store: new Store(new RecordSource(), {operationLoader}),
    operationLoader,
    isServer: IS_SERVER,
    log(event) {
      if ((IS_SERVER && SERVER_DEBUG) || (!IS_SERVER && CLIENT_DEBUG)) {
        console.debug('[relay environment event]', event);
      }
    },
  });

  const environmentNetwork =
    environment.getNetwork() as NetworkWithResponseCache;
  environmentNetwork.responseCache = network.responseCache;

  return environment;
}
