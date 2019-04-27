import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import Controller from './Controller';

const basename = path.basename(__filename);

const getPath = (file: string) => path.join(__dirname, file);

const readDir = promisify(fs.readdir);

export const getControllers = (): Promise<Controller[]> => {
  return new Promise<Controller[]>(async (resolve, reject) => {
    try {
      // Load controller files.
      const controllerFiles = (await readDir(__dirname))
        .filter((file) => {
          // Check that the file load is actually a controller.
          return (file.indexOf('.') !== 0) && (file !== basename)
              && (file.slice(-14) === '.controller.ts');
        });
      // Load imports from controller files.
      const importedModules = await Promise
        .all(controllerFiles.map(file => import(getPath(file))));
      // Only return the default import for each controller.
      return resolve(importedModules.map(module => module.default));
    } catch (e) {
      return reject(e);
    }
  });
};
