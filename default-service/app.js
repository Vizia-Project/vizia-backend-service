const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi-docs.json");

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(8080, () => {
  console.log(`Default Service listening on port ${8080}`);
});
