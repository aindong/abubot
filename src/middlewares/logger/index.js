"use strict";

/**
 * Logger hook
 */

module.exports = abubot => {
  return {
    /**
     * Initialize the hook
     */
    initialize() {
      const {
        level,
        exposeInContext,
        requests
      } = abubot.config.middleware.settings.logger;

      if (level) {
        abubot.log.level = abubot.config.middleware.settings.logger.level;
      }

      if (exposeInContext) {
        abubot.app.context.log = abubot.log;
      }

      if (requests && abubot.log.levelVal <= 20) {
        abubot.app.use(async (ctx, next) => {
          const start = Date.now();
          await next();
          const delta = Math.ceil(Date.now() - start);
          abubot.log.debug(`${ctx.method} ${ctx.url} (${delta} ms)`);
        });
      }
    }
  };
};
