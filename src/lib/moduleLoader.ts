type JSModule =
  | {
      kind: 'pending';
      reject: (reason?: Error) => void;
      resolve: (value: JSModule | undefined) => void;
    }
  | {
      kind: 'registered';
      loaderFn: () => Promise<JSModuleLoaded>;
    };

type JSModuleLoaded = {
  default: JSModule;
};

const loaders = new Map<string, JSModule>();
const loadedModules = new Map<string, JSModuleLoaded>();
const failedModules = new Map<string, Error>();
const pendingLoaders = new Map<string, Promise<JSModule | undefined>>();

export default function moduleLoader(name: string) {
  return {
    getError() {
      return failedModules.get(name);
    },
    resetError() {
      failedModules.delete(name);
    },
    get() {
      const jsModule = loadedModules.get(name);
      return jsModule == null ? null : jsModule.default;
    },
    load() {
      const loader = loaders.get(name);
      if (loader == null) {
        const promise = new Promise<JSModule | undefined>((resolve, reject) => {
          loaders.set(name, {
            kind: 'pending',
            resolve,
            reject,
          });
        });
        pendingLoaders.set(name, promise);
        return promise;
      } else if (loader.kind == 'registered') {
        return loader.loaderFn().then(
          (module) => {
            loadedModules.set(name, module);
            return module.default;
          },
          (error) => {
            failedModules.set(name, error as Error);
            throw error;
          },
        );
      } else if (loader.kind == 'pending') {
        return pendingLoaders.get(name);
      } else {
        return;
      }
    },
  };
}

export function registerLoader(
  name: string,
  loaderFn: () => Promise<JSModuleLoaded>,
) {
  const loader = loaders.get(name);
  if (loader == null) {
    loaders.set(name, {
      kind: 'registered',
      loaderFn,
    });
  } else if (loader.kind === 'pending') {
    loaderFn().then(
      (module) => {
        loadedModules.set(name, module);
        pendingLoaders.delete(name);
        loader.resolve(module.default);
      },
      (error) => {
        failedModules.set(name, error as Error);
        pendingLoaders.delete(name);
        loader.reject(error as Error);
      },
    );
  }
}
