const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const auth_routes = require("./routes/api/auth");
const users_routes = require("./routes/api/users");
const category_routes = require("./routes/api/categories");
const menuItems_routes = require("./routes/api/menuItems");
const orders_routes = require("./routes/api/orders");
const tables_routes = require("./routes/api/tables")
app.use("/api/auth", auth_routes);  
app.use("/api/users", users_routes);
app.use("/api/categories", category_routes);
app.use("/api/menuItems", menuItems_routes);
app.use("/api/orders", orders_routes);
app.use("/api/tables",tables_routes);
app.use("/static", express.static("images"));
app.listen(process.env.PORT || 5000);
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
