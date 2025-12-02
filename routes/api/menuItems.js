const express = require("express");
const path = require("path");
const { menuItems } = require("../../config.js");
const routes = express.Router();
const multer = require("multer");

// handle image uploads
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("images/"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });



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




//  GET ALL MENU ITEMS
routes.get("/", async (req, res) => {
  try {
    const result = await menuItems.get();
    const list = result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch menu items" });
  }
});



/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: Create a new order
 *     description: Adds a new order to the database.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tableRef:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuItemId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *               status:
 *                 type: string
 *                 example: Pending
 *     responses:
 *       200:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */



//  CREATE MENU ITEM
routes.post("/create", upload.single("image"), async (req, res) => {
  try {
    if (req.file) {
      await menuItems.add({ ...req.body, file: req.file.filename });
    } else {
      await menuItems.add({ ...req.body, file: "" });
    }
    res.send({ msg: "Item added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to create menu item" });
  }
});



/**
 * @swagger
 * /api/orders/update/{order_id}:
 *   put:
 *     summary: Update order(s)
 *     description: Updates one or more orders in the database.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID (required by route)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                 items:
 *                   type: array
 *     responses:
 *       200:
 *         description: Orders updated successfully
 *       500:
 *         description: Server error
 */



//  UPDATE MENU ITEM  (FIXED — uses menuItems, NOT Dishes)
routes.put("/update/:menuItems_id", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.menuItems_id;
    delete req.body.id;

    if (req.file) {
      await menuItems.doc(id).update({ ...req.body, file: req.file.filename });
    } else {
      await menuItems.doc(id).update(req.body);
    }

    res.send({ msg: "Item updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update menu item" });
  }
});




/**
 * @swagger
 * /api/orders/delete/{order_id}:
 *   delete:
 *     summary: Delete an order
 *     description: Removes an order from the database.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */



//  DELETE MENU ITEM (FIXED)
routes.delete("/delete/:menuItems_id", async (req, res) => {
  try {
    const id = req.params.menuItems_id;
    await menuItems.doc(id).delete();
    res.send({ msg: "Item deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to delete menu item" });
  }
});

module.exports = routes;




