import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { ControllerClass } from './Controller';

const basename = path.basename(__filename);

/**
 * @param {string} file filename of file in current directory.
 * @returns {string} absolute path of given file.
 */
const getPath = (file: string): string => path.join(__dirname, file);

/**
 * Normal fs.readdir takes a callback as its 3rd parameter so I am using promisify
 * to make it return a promise which allows for cleaner code using async/await.
 * @param {string} path path to directory.
 * @param {object} options encoding options.
 * @returns {Promise<string[]>} promise that will resolve to names of files in directory.
 */
const readDir = promisify(fs.readdir);

/**
 * Takes an array of filenames and returns dynamically imported modules.
 * @param {string[]} controllerFiles filenames of controllers
 * @returns {Promise<module[]>} modules corresponding to given file name.
 */
const importModules = async (controllerFiles: string[]): Promise<any> => (
  Promise.all(controllerFiles.map(file => import(getPath(file))))
);

/**
 * Take the name of a file checks that the file is actually a controller.
 * @param {string} file name of file being checked
 * @returns {boolean} result of checking whether the file is a controller or not.
 */
const filterControllers = (file: string): boolean => (
  (file.indexOf('.') !== 0) && (file !== basename)
    && (file.slice(-14, -2) === '.controller.')
);

/**
 * Asynchronously returns all controllers in src/controllers.
 * @returns {Promise<ControllerClass[]>} promise that resolves to array of controllers.
 */
export const getControllers = (): Promise<ControllerClass[]> => {
  return new Promise<ControllerClass[]>(async (resolve, reject) => {
    try {
      // Load controller files.
      const controllerFiles = (await readDir(__dirname))
        .filter(filterControllers);
      // Import controller modules.
      const modules = (await importModules(controllerFiles));
      // Map the controller classes from the array of modules.
      const controllers = modules.map((module: any) => module.default);
      return resolve(controllers);
    } catch (e) {
      return reject(e);
    }
  });
};
