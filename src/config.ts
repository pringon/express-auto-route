import nconf from 'nconf';
import path from 'path';

// Set default port value.
const PORT: number = 3000;
// If no environment is specified, assume development.
const NODE_ENV: string = 'development';

nconf
  .argv()
  .env(['NODE_ENV', 'PORT'])
  .file({ file: path.join(__dirname, 'config.json') })
  .defaults({
    PORT,
    NODE_ENV,
  });

export default nconf;
