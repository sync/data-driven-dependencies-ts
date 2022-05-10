import '@testing-library/jest-dom/extend-expect';
import { server } from './mocks/server';

jest
  .useFakeTimers('modern')
  .setSystemTime(new Date('2021-07-07T06:25:14.30384+00:00').getTime());

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
