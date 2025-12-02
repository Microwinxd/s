const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bean Scene API",
      version: "1.0.0",
      description: "REST API documentation for Bean Scene mobile app",
    },
    servers: [
      {
        url: "http://localhost:5000",   // ✅ change if your port is different
      },
    ],
  },
  apis: ["./routes/**/*.js"],  // ✅ looks for JSDoc in your routes
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
