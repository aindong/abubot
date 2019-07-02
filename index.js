"use strict";

const Koa = require("koa");
const logger = require("koa-pino-logger")();
const json = require("koa-json")();
const bodyParser = require("koa-bodyparser")();
const KoaRouter = require("koa-router");

const slackProcessor = require("./slack");

// Koa application
const app = new Koa();
const router = new KoaRouter();

// Middlewares
app.use(logger);
app.use(json);
app.use(bodyParser);

// Routes
router.get("/events", async ctx => {
  ctx.body = "This is a slack event";
});

router.post("/events", async ctx => {
  const body = ctx.request.body;
  await slackProcessor(body);
  ctx.body = body.challenge;
});

// Fallback
router.get("/*", ctx => {
  ctx.body = "What are you looking for?";
  ctx.status = 404;
});

// Router middleware
app.use(router.routes()).use(router.allowedMethods());

// // Simple middleware
// app.use(async ctx => {
//   ctx.log.info("hey there");
//   ctx.body = "hello word";
// });

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
