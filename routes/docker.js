const express = require("express");
const {
  getContainer,
  startContainer,
  stopContainer,
} = require("../utils/docker");
const router = express.Router();
const logger = require("../utils/logger")("DOCKER_ROUTER");

router.get("/up/id/:id", async function (req, res, next) {
  const target = await getContainer("id", req.params.name);
  await startContainer(target);

  res.json(target);
});

router.get("/up/name/:name", async function (req, res, next) {
  const target = await getContainer("name", req.params.name);
  await startContainer(target);

  res.json(target);
});

router.get("/down/id/:id", async function (req, res, next) {
  const target = await getContainer("id", req.params.name);
  await stopContainer(target);

  res.json(target);
});

router.get("/down/name/:name", async function (req, res, next) {
  const target = await getContainer("name", req.params.name);
  await stopContainer(target);

  res.json(target);
});

module.exports = router;
