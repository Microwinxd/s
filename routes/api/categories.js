const express = require("express");
const { Category } = require("../../config.js");
const routes = express.Router();

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

// ✅ GET ALL CATEGORIES
routes.get("/", async (req, res) => {
  try {
    const result = await Category.get();
    const list = result.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(list);
  } catch (err) {
    console.error(err);
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

// ✅ CREATE CATEGORY
routes.post("/create", async (req, res) => {
  try {
    await Category.add(req.body);
    res.status(201).json({ msg: "Category added successfully." });
  } catch (err) {
    console.error(err);
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

// ✅ UPDATE CATEGORY
routes.put("/update/:category_id", async (req, res) => {
  try {
    const id = req.params.category_id;
    delete req.body.id;

    await Category.doc(id).update(req.body);

    res.status(200).json({ msg: "Category updated successfully." });
  } catch (err) {
    console.error(err);
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

// ✅ DELETE CATEGORY
routes.delete("/delete/:category_id", async (req, res) => {
  try {
    const id = req.params.category_id;

    await Category.doc(id).delete();

    res.status(200).json({ msg: "Category deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = routes;
