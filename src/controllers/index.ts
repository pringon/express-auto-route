import fs from 'fs';
import path from 'path';
import Controller from './Controller';

const basename = path.basename(__filename);

const getPath = (file: string) => path.join(__dirname, file);

export const getControllers = (): Promise<Controller[]> => {
  // Load controller files.
  const controllerFiles = fs.readdirSync(__dirname)
    .filter((file) => {
      // Check that the file load is actually a controller.
      return (file.indexOf('.') !== 0) && (file !== basename)
          && (file.slice(-14) === '.controller.ts');
    });
  return new Promise<Controller[]>(async (resolve, reject) => {
    try {
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
