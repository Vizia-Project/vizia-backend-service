const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const path = require("path");

const pathKey = path.resolve("./vizia-sa.json");
const client = new SecretManagerServiceClient({ keyFile: pathKey });

const getSecretKeys = async (name) => {
  const [accessResponse] = await client.accessSecretVersion({
    name: `projects/vizia-441603/secrets/${name}/versions/latest`
  });
  return accessResponse.payload.data.toString('utf8');
};

module.exports = getSecretKeys;
