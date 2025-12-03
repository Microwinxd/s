const express = require("express");
const routes = express.Router();

const {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} = require("firebase/firestore");

const { db } = require("../../config.js"); // ✅ must export db from config

// ✅ Firestore Collection Reference (v9)
const Orders = collection(db, "orders");

// ✅ GET ALL ORDERS
routes.get("/", async (req, res) => {
  try {
    const result = await getDocs(Orders);

    const list = result.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    res.send(list);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to load orders" });
  }
});

// ✅ CREATE ORDER
routes.post("/create", async (req, res) => {
  try {
    await addDoc(Orders, req.body);
    res.send({ msg: "Orders added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to add order" });
  }
});

// ✅ UPDATE ORDERS (BATCH UPDATE)
// ✅ UPDATE SINGLE ORDER
routes.put("/update/:order_id", async (req, res) => {
  try {
    const id = req.params.order_id;
    const updates = req.body;

    delete updates.id; // ✅ prevent ID overwrite

    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, updates);

    res.status(200).send({ msg: "Order updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update order" });
  }
});


// ✅ DELETE ORDER
routes.delete("/delete/:order_id", async (req, res) => {
  try {
    const id = req.params.order_id;
    const orderRef = doc(db, "orders", id);

    await deleteDoc(orderRef);

    res.send({ msg: "Orders deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to delete order" });
  }
});

module.exports = routes;







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
