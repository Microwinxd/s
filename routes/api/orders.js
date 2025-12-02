const { json } = require("body-parser");
const express = require("express");
const { Orders } = require("../../config");
const routes = express.Router();

routes.get("/", async (req, res) => {
  const result = await Orders.get();
  const list = result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list);
});
routes.post("/create", async (req, res) => {
  await Orders.add(req.body);
  res.send({ msg: "Orders added successfully." });
});

routes.put("/update/:order_id", async (req, res) => {
  req.body.map(async (x) => {
    await Orders.doc(x.id).update(x);
  });
  res.send({ msg: "Orders updated successfully." });
});

routes.delete("/delete/:order_id", async (req, res) => {
  const id = req.params.order_id;
  await Orders.doc(id).delete();
  res.send({ msg: "Orders deleted successfully." });
});

module.exports = routes;






/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management API
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieves all orders from the database.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Successfully retrieved orders
 *       500:
 *         description: Server error
 */
