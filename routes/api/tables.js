/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Table management API
 */

/**
 * @swagger
 * /api/tables:
 *   get:
 *     summary: Get all tables
 *     description: Retrieves all tables from the database.
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: Successfully retrieved tables
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tables/create:
 *   post:
 *     summary: Create a new table
 *     description: Adds a new table to the database with optional image upload.
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               area:
 *                 type: string
 *               name:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Table created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tables/update/{tables_id}:
 *   put:
 *     summary: Update a table
 *     description: Updates an existing table record in Firestore.
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: tables_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The table ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               area:
 *                 type: string
 *               name:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Table updated successfully
 *       404:
 *         description: Table not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tables/delete/{tables_id}:
 *   delete:
 *     summary: Delete a table
 *     description: Removes a table from the database.
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: tables_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The table ID
 *     responses:
 *       200:
 *         description: Table deleted successfully
 *       404:
 *         description: Table not found
 *       500:
 *         description: Server error
 */

const express = require("express");
const path = require("path");
const { tables } = require("../../config");
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

//  GET ALL MENU ITEMS
routes.get("/", async (req, res) => {
  try {
    const result = await tables.get();
    const list = result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to load tables" });
  }
});

//  CREATE MENU ITEM
routes.post("/create", upload.single("image"), async (req, res) => {
  try {
    if (req.file) {
      await tables.add({ ...req.body, file: req.file.filename });
    } else {
      await tables.add({ ...req.body, file: "" });
    }
    res.send({ msg: "Item added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to create table" });
  }
});

//  UPDATE MENU ITEM  
routes.put("/update/:tables_id", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.tables_id;
    delete req.body.id;

    if (req.file) {
      await tables.doc(id).update({ ...req.body, file: req.file.filename });
    } else {
      await tables.doc(id).update(req.body);
    }

    res.send({ msg: "Item updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update table" });
  }
});

//  DELETE MENU ITEM 
routes.delete("/delete/:tables_id", async (req, res) => {
  try {
    const id = req.params.tables_id;
    await tables.doc(id).delete();
    res.send({ msg: "Item deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to delete table" });
  }
});

module.exports = routes;
