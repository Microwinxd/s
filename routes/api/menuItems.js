const express = require("express");
const path = require("path");
const { db, menuItems } = require("../../config.js"); // ✅ v9 db + collection
const routes = express.Router();
const multer = require("multer");

const {
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");

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
 * /api/menuItems:
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

// ✅ ✅ ✅ GET ALL MENU ITEMS (v9)
routes.get("/", async (req, res) => {
  try {
    const snapshot = await getDocs(menuItems);

    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    res.status(200).json(list);
  } catch (err) {
    console.error("GET /menuItems ERROR:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

/**
 * @swagger
 * /api/menuItems/create:
 *   post:
 *     summary: Create a new menu item
 *     description: Adds a new menu item to the database.
 *     tags: [Menu]
 */

// ✅ ✅ ✅ CREATE MENU ITEM (v9)
routes.post("/create", upload.single("file"), async (req, res) => {
  try {
    const data = {
      ...req.body,
      file: req.file ? req.file.filename : "",
    };

    await addDoc(menuItems, data); // ✅ v9 ADD

    res.status(201).json({ msg: "Item added successfully." });
  } catch (err) {
    console.error("CREATE /menuItems ERROR:", err);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

/**
 * @swagger
 * /api/menuItems/update/{menuItem_id}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
 */

// ✅ ✅ ✅ UPDATE MENU ITEM (v9)
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

    const itemRef = doc(db, "menuItems", id); // ✅ v9 DOC
    await updateDoc(itemRef, updates);        // ✅ v9 UPDATE

    res.status(200).json({ msg: "Item updated successfully." });
  } catch (err) {
    res.status(404).json({
      error: "Failed to update item",
      details: err.message
    });
  }
});

/**
 * @swagger
 * /api/menuItems/delete/{menuItem_id}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
 */

// ✅ ✅ ✅ DELETE MENU ITEM (v9)
routes.delete("/delete/:menuItem_id", async (req, res) => {
  try {
    const id = req.params.menuItem_id;

    const itemRef = doc(db, "menuItems", id); // ✅ v9 DOC
    await deleteDoc(itemRef);                 // ✅ v9 DELETE

    res.status(200).json({ msg: "Item deleted successfully." });
  } catch (err) {
    res.status(404).json({
      error: "Failed to delete item",
      details: err.message
    });
  }
});

module.exports = routes;
