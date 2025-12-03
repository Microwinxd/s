const express = require("express");
const { db, Category } = require("../../config.js");
const routes = express.Router();

const {
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management API
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieves all categories from the database.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *       500:
 *         description: Server error
 */

// ✅ ✅ ✅ GET ALL CATEGORIES (v9)
routes.get("/", async (req, res) => {
  try {
    const snapshot = await getDocs(Category);

    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    res.status(200).json(list);
  } catch (err) {
    console.error("GET /categories ERROR:", err);
    res.status(500).json({ error: "Failed to load categories" });
  }
});

/**
 * @swagger
 * /api/categories/create:
 *   post:
 *     summary: Create a new category
 *     description: Adds a new category to the database.
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Drinks
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

// ✅ ✅ ✅ CREATE CATEGORY (v9)
routes.post("/create", async (req, res) => {
  try {
    await addDoc(Category, req.body); // ✅ v9 add

    res.status(201).json({ msg: "Category added successfully." });
  } catch (err) {
    console.error("CREATE /categories ERROR:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
});

/**
 * @swagger
 * /api/categories/update/{category_id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 */

// ✅ ✅ ✅ UPDATE CATEGORY (v9)
routes.put("/update/:category_id", async (req, res) => {
  try {
    const id = req.params.category_id;
    delete req.body.id;

    const categoryRef = doc(db, "categories", id); // ✅ v9 doc ref
    await updateDoc(categoryRef, req.body);        // ✅ v9 update

    res.status(200).json({ msg: "Category updated successfully." });
  } catch (err) {
    console.error("UPDATE /categories ERROR:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
});

/**
 * @swagger
 * /api/categories/delete/{category_id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 */

// ✅ ✅ ✅ DELETE CATEGORY (v9)
routes.delete("/delete/:category_id", async (req, res) => {
  try {
    const id = req.params.category_id;

    const categoryRef = doc(db, "categories", id); // ✅ v9 doc ref
    await deleteDoc(categoryRef);                  // ✅ v9 delete

    res.status(200).json({ msg: "Category deleted successfully." });
  } catch (err) {
    console.error("DELETE /categories ERROR:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = routes;
