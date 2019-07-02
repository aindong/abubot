'use strict';

import AbubotHttpServer from "../abubot";
// @ts-ignore
import * as glob from './glob';
import * as path from 'path';
import * as _ from 'lodash';
import Middleware from "../interfaces/middleware";

export default async (abubot: AbubotHttpServer) => {
    const { installedMiddlewares, installedPlugins, appPath } = abubot.config;
    let middlewares = {};

    const loaders = createLoaders(abubot);

    await Promise.all([
        loaders.loadLocalMiddlewares(appPath, middlewares)
    ]);

    return middlewares;
}


const createLoaders = (abubot: AbubotHttpServer) => {
    const loadMiddlewaresInDir = async (dir: any, middlewares: Middleware) => {
        console.log(`Scanning ${dir} for middlewares`);
        const files = await glob('*/*(index|defaults).*(js|json|ts)', {
            cwd: dir,
        });

        console.log(`Found ${files}`);
        files.forEach((f: string) => {
            console.log(`Found ${f}`);
            const name = f.split('/')[0];
            mountMiddleware(name, [path.resolve(dir, f)], middlewares);
        });
    };

    const loadLocalMiddlewares = (appPath: string, middlewares: Middleware) =>
        loadMiddlewaresInDir(path.resolve(appPath, 'src/middlewares'), middlewares);

    const mountMiddleware = (name: string, files: [string], middlewares: Middleware) => {
        files.forEach(file => {
          middlewares[name] = middlewares[name] || { loaded: false };
    
          if (_.endsWith(file, 'index.js') && !middlewares[name].load) {
            return Object.defineProperty(middlewares[name], 'load', {
              configurable: false,
              enumerable: true,
              get: () => require(file)(abubot),
            });
          }
    
          if (_.endsWith(file, 'defaults.json')) {
            middlewares[name].defaults = require(file);
            return;
          }
        });
    };
    
    return {
        loadLocalMiddlewares
    }
}