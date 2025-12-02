const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyDdjlVqdZnfOtdcbZedY3Kvgve3Os5nXAs",
  authDomain: "beanscene-ordering.firebaseapp.com",
  projectId: "beanscene-ordering",
  storageBucket: "beanscene-ordering.firebasestorage.app",
  messagingSenderId: "615691535026",
  appId: "1:615691535026:web:540152021f977d5c257fab",
  measurementId: "G-LSWD7XB4Y2"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const User = db.collection("users");
const Category = db.collection("categories");
const Dishes = db.collection("dishes");
const Orders = db.collection("orders");
const menuItems = db.collection("menuItems")
const tables  = db.collection("tables")
module.exports = { User, Category, menuItems, Orders, tables };
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
