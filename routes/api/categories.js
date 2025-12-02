const express = require("express");
const { Category } = require("../../config.js");
const routes = express.Router();


/**
 * @swagger
 * tags:
 *   name: MenuItems
 *   description: Menu item management API
 */

/**
 * @swagger
 * /api/menuItems:
 *   get:
 *     summary: Get all menu items
 *     description: Retrieves all menu items from the database.
 *     tags: [MenuItems]
 *     responses:
 *       200:
 *         description: Successfully retrieved menu items
 *       500:
 *         description: Server error
 */


// ✅ GET ALL CATEGORIES
routes.get("/", async (req, res) => {
  try {
    const result = await Category.get();
    const list = result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to load categories" });
  }
});


/**
 * @swagger
 * /api/menuItems/create:
 *   post:
 *     summary: Create a new menu item
 *     description: Adds a new menu item to the database with optional image upload.
 *     tags: [MenuItems]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               dietaryFlags:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Menu item created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */



// ✅ CREATE CATEGORY
routes.post("/create", async (req, res) => {
  try {
    await Category.add(req.body);
    res.send({ msg: "Category added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to create category" });
  }
});


/**
 * @swagger
 * /api/menuItems/update/{menuItems_id}:
 *   put:
 *     summary: Update a menu item
 *     description: Updates an existing menu item with optional image upload.
 *     tags: [MenuItems]
 *     parameters:
 *       - in: path
 *         name: menuItems_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The menu item ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               dietaryFlags:
 *                 type: array
 *                 items:
 *                   type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Server error
 */




// ✅ UPDATE CATEGORY
routes.put("/update/:category_id", async (req, res) => {
  try {
    const id = req.params.category_id;
    delete req.body.id;
    await Category.doc(id).update(req.body);
    res.send({ msg: "Category updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update category" });
  }
});


/**
 * @swagger
 * /api/menuItems/delete/{menuItems_id}:
 *   delete:
 *     summary: Delete a menu item
 *     description: Removes a menu item from the database.
 *     tags: [MenuItems]
 *     parameters:
 *       - in: path
 *         name: menuItems_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The menu item ID
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Server error
 */




// ✅ DELETE CATEGORY
routes.delete("/delete/:category_id", async (req, res) => {
  try {
    const id = req.params.category_id;
    await Category.doc(id).delete();
    res.send({ msg: "Category deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to delete category" });
  }
});

module.exports = routes;
