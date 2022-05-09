import {NextApiRequest, NextApiResponse} from 'next';
import NextCors from 'nextjs-cors';

export const handleCors = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<unknown> =>
  NextCors(req, res, {
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: [
      'http://localhost:3000',
      'https://calibre.care',
      'https://www.calibre.care',
      /calibreapp-front-end-test.+\.vercel\.app$/,
    ],
  });
