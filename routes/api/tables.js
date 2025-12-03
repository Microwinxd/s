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
const { db } = require("../../config.js"); // ✅ FIXED
const routes = express.Router();
const multer = require("multer");

const {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} = require("firebase/firestore");

// ✅ PROPER COLLECTION REFERENCE
const tablesRef = collection(db, "tables");

// ✅ IMAGE STORAGE CONFIG
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

// ✅ GET ALL TABLES
routes.get("/", async (req, res) => {
  try {
    const result = await getDocs(tablesRef);

    const list = result.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    res.status(200).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load tables" });
  }
});

// ✅ CREATE TABLE (WITH IMAGE UPLOAD)
routes.post("/create", upload.single("file"), async (req, res) => {
  try {
    const data = {
      ...req.body,
      file: req.file ? req.file.filename : ""
    };

    await addDoc(tablesRef, data);

    res.status(201).json({ msg: "Table added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add table" });
  }
});

// ✅ UPDATE SINGLE TABLE (MATCHES SWAGGER)
routes.put("/update/:table_id", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.table_id;
    const tableRef = doc(db, "tables", id);

    const updates = {
      ...req.body
    };

    if (req.file) {
      updates.file = req.file.filename;
    }

    await updateDoc(tableRef, updates);

    res.status(200).json({ msg: "Table updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update table" });
  }
});

// ✅ DELETE TABLE (FIXED PARAM NAME)
routes.delete("/delete/:table_id", async (req, res) => {
  try {
    const id = req.params.table_id;
    const tableRef = doc(db, "tables", id);

    await deleteDoc(tableRef);

    res.status(200).json({ msg: "Table deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete table" });
  }
});

module.exports = routes;
