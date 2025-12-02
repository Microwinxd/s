

const { initializeApp } = require("firebase/app");
const { getFirestore, collection } = require("firebase/firestore");

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: 'AIzaSyDdjlVqdZnfOtdcbZedY3Kvgve3Os5nXAs',
  authDomain: 'beanscene-ordering.firebaseapp.com',
  projectId: 'beanscene-ordering',
  storageBucket: 'beanscene-ordering.firebasestorage.app',
  messagingSenderId: '615691535026',
  appId: '1:615691535026:web:540152021f977d5c257fab',
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore
const db = getFirestore(app);

// ✅ Firestore Collections
const User = collection(db, "users");
const Category = collection(db, "categories");
const Dishes = collection(db, "dishes");
const Orders = collection(db, "orders");
const menuItems = collection(db, "menuItems");
const tables = collection(db, "tables");

// ✅ Export everything correctly
module.exports = {
  db,
  User,
  Category,
  Dishes,
  Orders,
  menuItems,
  tables
};
