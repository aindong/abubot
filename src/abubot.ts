"use strict";

import * as Koa from 'koa';
import * as Http from 'http';
import { EventEmitter } from "events";
import loadMiddlewares from './core/loadMiddlewares';
import Middleware from './interfaces/middleware';

interface AbubotConfiguration {
    host: string; 
    port: string | number; 
    environment: string;
    middleware: object;
    version: string;
    installedMiddlewares: [object];
    installedPlugins: [object];
    appPath: string
}

class AbubotHttpServer extends EventEmitter {
    app: Koa<any, {}>;
    server: Http.Server;
    config: AbubotConfiguration;
    middleware: Middleware;

    constructor(config?: AbubotConfiguration) {
        super();

        this.app = new Koa();
        this.server = Http.createServer(this.app.callback());
        this.middleware = {}

        this.config = Object.assign({
            host: process.env.HOST || process.env.HONSTNAME || "localhost",
            port: process.env.PORT || 3000,
            environment: process.env.NODE_ENV || "development",
            middleware: {},
            version: process.env.ABUBOT_VERSION || "0.1.0",
            installedMiddlewares: [],
            installedPlugins: [],
            appPath: process.cwd()
        }, config);
    }

    async start(): Promise<void> {
        try {
            this.emit("server:starting");
            await this.load();

            this.server.listen(this.config.port, async () => {
                console.log(`Server started at ${this.config.port}`);
                this.emit("server:started");
            });
        } catch (err) {
            this.stopAndShowError(err);
        }
    }

    async load(): Promise<void> {
        // TODO: Detect if port already in use

        // Healthcheck
        this.app.use(async (ctx, next) => {
            if (ctx.request.url === '/_health' && ctx.request.method === 'GET') {
                ctx.body = {
                    'status': 'healthy'
                }
                ctx.status = 200;
            } else {
                await next();
            }
        });

        const [middlewares] = await Promise.all([loadMiddlewares(this)]);
        this.middleware = middlewares;

        // console.log(this.config.appPath);
        console.log(this.middleware);
    }

    stopAndShowError(err: Error): void {
        console.log("Server wasn't able to start properly");
        console.error(err);

        return this.stop();
    }

    stop(): void {
        this.server.close();
        process.exit(1);
    }
}

export default AbubotHttpServer;