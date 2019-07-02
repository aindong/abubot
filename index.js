"use strict";

const Koa = require("koa");
const logger = require("koa-pino-logger")();
const json = require("koa-json")();
const bodyParser = require("koa-bodyparser")();
const KoaRouter = require("koa-router");

// Koa application
const app = new Koa();
const router = new KoaRouter();

// Middlewares
app.use(logger);
app.use(json);
app.use(bodyParser);

// Routes
router.get("/events", ctx => {
  ctx.body = "This is a slack event";
  return ctx;
});

router.post("/events", ctx => {
  const body = ctx.request.body;
  console.log(body);
  ctx.body = body.challenge;
  return ctx;
});

// Fallback
router.get("/*", ctx => {
  ctx.body = "What are you looking for?";
  ctx.status = 404;
  return ctx;
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
