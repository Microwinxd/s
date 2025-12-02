const express = require("express");
const { User } = require("../../config");
const routes = express.Router();

routes.post("/login", async (req, res) => {
  const result = await User.get();
  const list = result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const user = list.find(
    (x) => x.email == req.body.email && x.password == req.body.password
  );
  if (user) {
    res.send({
      success: true,
      data: user,
      message: "User logged in successfully.",
    });
  } else {
    res.send({
      success: false,
      data: user,
      message: "Email or password is wrong.",
    });
  }
});

module.exports = routes;
