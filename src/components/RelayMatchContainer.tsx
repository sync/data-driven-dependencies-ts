import MatchContainer, {
  MatchPointer,
  TypenameOnlyPointer,
} from 'react-relay/lib/relay-hooks/MatchContainer';
import moduleLoader from '../lib/moduleLoader';
import ErrorBoundary from './ErrorBoundary';
import { Button } from './LayoutComponents';

export type RelayMatchContainerProps = {
  match?: MatchPointer | TypenameOnlyPointer | null | undefined;
};

export default function RelayMatchContainer({
  match,
}: RelayMatchContainerProps) {
  return (
    <ErrorBoundary
      shouldCatchError={(error) => error instanceof ModuleLoaderError}
      renderError={(error: Error, resetError) => (
        <div className="inline-block rounded-md bg-red-200 px-2 py-1">
          Failed to load {(error as ModuleLoaderError).moduleLoaderName}{' '}
          <Button
            size="small"
            onClick={() => {
              moduleLoader(
                (error as ModuleLoaderError).moduleLoaderName,
              ).resetError();
              resetError();
            }}
          >
            Reload
          </Button>
        </div>
      )}
    >
      <MatchContainer
        match={match}
        loader={(name) => {
          const loader = moduleLoader(name as string);
          const error = loader.getError();
          if (error) {
            throw new ModuleLoaderError(name as string, error);
          }
          const jsModule = loader.get();
          if (jsModule != null) {
            // we know we are loading a React component so we can safely cast
            return jsModule as unknown as React.ComponentType;
          }
          throw loader.load();
        }}
      />
    </ErrorBoundary>
  );
}

class ModuleLoaderError extends Error {
  moduleLoaderName: string;
  error: Error;

  constructor(moduleLoaderName: string, error: Error) {
    super('ModuleLoaderError: ' + error.message);
    this.moduleLoaderName = moduleLoaderName;
    this.error = error;
  }
}
