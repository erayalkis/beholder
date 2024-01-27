const Docker = require("dockerode");
const docker = new Docker();
const logger = require("./logger")("DOCKER_UTILS");

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const listContainers = async () => {
  const containers = await docker.listContainers({ all: true });
  return containers;
};

const getContainer = async (targetProp, value) => {
  const containers = await listContainers();

  switch (targetProp) {
    case "name": {
      const containerInfo = containers.find((c) =>
        c.Names.some((n) => n.slice(1) === value)
      );

      if (!containerInfo) return { found: false };

      const container = docker.getContainer(containerInfo.Id);

      const resObj = {
        found: true,
        containerInfo,
        container: container,
      };

      return resObj;
    }
    default:
      const capitalizedProp = capitalizeFirstLetter(targetProp);
      const containerInfo = containers.find(
        (c) => c[capitalizedProp] === value
      );

      if (!containerInfo) return { found: false };

      const container = docker.getContainer(containerInfo.Id);
      const resObj = {
        found: true,
        containerInfo,
        container: container,
      };

      return resObj;
  }
};

const startContainer = async (containerObj) => {
  if (!containerObj.found || containerObj.containerInfo["State"] === "running")
    return;

  logger(`Starting container ${JSON.stringify(containerObj)}`);

  await containerObj.container.start();

  const newState = await getContainer("id", containerObj.containerInfo["Id"]);

  logger(`Got new state ${JSON.stringify(newState)}`);
  containerObj.containerInfo = newState.containerInfo;

  return containerObj;
};

const stopContainer = async (containerObj) => {
  if (!containerObj.found || containerObj.containerInfo["State"] === "stopped")
    return;

  logger(`Stopping container ${JSON.stringify(containerObj)}`);
  await containerObj.container.stop();

  const newState = getContainer("id", containerObj.containerInfo["Id"]);

  logger(`Got new state ${JSON.stringify(newState)}`);
  containerObj.containerInfo = newState.containerInfo;

  return containerObj;
};

module.exports = {
  listContainers,
  getContainer,
  startContainer,
  stopContainer,
};
