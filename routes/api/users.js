const express = require("express");
const { User } = require("../../config");
const routes = express.Router();

routes.get("/", async (req, res) => {
  const result = await User.get();
  const list = result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list);
});

routes.post("/create", async (req, res) => {
  await User.add(req.body);
  res.send({ msg: "Staff added successfully." });
});

routes.put("/update/:user_id", async (req, res) => {
  const id = req.params.user_id;
  delete req.body.id;
  await User.doc(id).update(req.body);
  res.send({ msg: "Staff updated successfully." });
});

routes.delete("/delete/:user_id", async (req, res) => {
  const id = req.params.user_id;
  await User.doc(id).delete();
  res.send({ msg: "Staff deleted successfully." });
});

module.exports = routes;
 








/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users from the database.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved user list
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a new user
 *     description: Adds a new staff/admin user to the database.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/update/{user_id}:
 *   put:
 *     summary: Update a user
 *     description: Updates an existing user's details.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/delete/{user_id}:
 *   delete:
 *     summary: Delete a user
 *     description: Removes a user from the database.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
