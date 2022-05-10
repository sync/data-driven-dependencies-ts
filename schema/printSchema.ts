import fs from 'fs';
import {printSchema} from 'graphql';

import {schema} from '../lib/graphql';

const text = printSchema(schema);

fs.writeFileSync('./schema/schema.graphql', text, 'utf8');

// eslint-disable-next-line no-console
console.log('Schema updated!');
