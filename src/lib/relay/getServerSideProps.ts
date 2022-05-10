import { ConcreteRequest, Variables } from 'relay-runtime';
import { networkFetch } from './network';

export async function getPreloadedQuery(
  { params }: ConcreteRequest,
  variables: Variables,
  baseUrl: string,
) {
  const response = await networkFetch(params.id, variables, baseUrl);
  return {
    params,
    variables,
    response,
  };
}
