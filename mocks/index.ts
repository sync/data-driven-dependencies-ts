import { server } from './server';

server.listen({ onUnhandledRequest: 'warn' });
// eslint-disable-next-line no-console
console.info('🔶 Mock server running');

process.once('SIGINT', () => server.close());
process.once('SIGTERM', () => server.close());
