const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// ✅ Routes
const auth_routes = require("./routes/api/auth");
const users_routes = require("./routes/api/users");
const category_routes = require("./routes/api/categories");
const menuItems_routes = require("./routes/api/menuItems");
const orders_routes = require("./routes/api/orders");
const tables_routes = require("./routes/api/tables");

// ✅ API Endpoints
app.use("/api/auth", auth_routes);  
app.use("/api/users", users_routes);
app.use("/api/categories", category_routes);
app.use("/api/menuItems", menuItems_routes);
app.use("/api/orders", orders_routes);
app.use("/api/tables", tables_routes);

// ✅ Static Images
app.use("/static", express.static("images"));

// ✅ Swagger MUST be BEFORE listen
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Start Server LAST
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Swagger docs available at http://localhost:${PORT}/api-docs`);
});
