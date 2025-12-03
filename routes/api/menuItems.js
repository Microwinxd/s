const express = require("express");
const path = require("path");
const { menuItems } = require("../../config.js");
const routes = express.Router();
const multer = require("multer");

// ✅ IMAGE UPLOAD CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("images/"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu item management API
 */

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get all menu items
 *     description: Retrieves all menu items from the database.
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Successfully retrieved menu items
 *       500:
 *         description: Server error
 */

// ✅ GET ALL MENU ITEMS
routes.get("/", async (req, res) => {
  try {
    const result = await menuItems.get();
    const list = result.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

/**
 * @swagger
 * /api/menu/create:
 *   post:
 *     summary: Create a new menu item
 *     description: Adds a new menu item to the database.
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Item created successfully
 *       500:
 *         description: Server error
 */

// ✅ CREATE MENU ITEM
routes.post("/create", upload.single("file"), async (req, res) => {
  try {
    const data = {
      ...req.body,
      file: req.file ? req.file.filename : "",
    };

    await menuItems.add(data);
    res.status(201).json({ msg: "Item added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

/**
 * @swagger
 * /api/menu/update/{menuItem_id}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
 */

// ✅ UPDATE MENU ITEM
routes.put("/update/:menuItem_id", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.menuItem_id;
    delete req.body.id;

    const updates = {
      ...req.body,
    };

    if (req.file) {
      updates.file = req.file.filename;
    }

    await menuItems.doc(id).update(updates);

    res.status(200).json({ msg: "Item updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

/**
 * @swagger
 * /api/menu/delete/{menuItem_id}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
 */

// ✅ DELETE MENU ITEM
routes.delete("/delete/:menuItem_id", async (req, res) => {
  try {
    const id = req.params.menuItem_id;
    await menuItems.doc(id).delete();
    res.status(200).json({ msg: "Item deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

module.exports = routes;
