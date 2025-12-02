const express = require("express");
const { db, User } = require("../../config.js");
const {
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} = require("firebase/firestore");

const routes = express.Router();

// ✅ GET ALL USERS
routes.get("/", async (req, res) => {
  try {
    const snapshot = await getDocs(User);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch users",
      details: err.message
    });
  }
});

// ✅ CREATE USER
routes.post("/create", async (req, res) => {
  try {
    const result = await addDoc(User, req.body);

    res.status(201).json({
      msg: "Staff added successfully.",
      id: result.id
    });
  } catch (err) {
    res.status(400).json({
      error: "Failed to add user",
      details: err.message
    });
  }
});

// ✅ UPDATE USER
routes.put("/update/:user_id", async (req, res) => {
  try {
    const id = req.params.user_id;
    delete req.body.id;

    const userRef = doc(db, "users", id);
    await updateDoc(userRef, req.body);

    res.status(200).json({ msg: "Staff updated successfully." });
  } catch (err) {
    res.status(404).json({
      error: "Failed to update user",
      details: err.message
    });
  }
});

// ✅ DELETE USER
routes.delete("/delete/:user_id", async (req, res) => {
  try {
    const id = req.params.user_id;

    const userRef = doc(db, "users", id);
    await deleteDoc(userRef);

    res.status(200).json({ msg: "Staff deleted successfully." });
  } catch (err) {
    res.status(404).json({
      error: "Failed to delete user",
      details: err.message
    });
  }
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
