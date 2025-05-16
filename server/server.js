const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT;
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory data store for products (this would be a database in a real application)
let products = [];

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Product management endpoints
// Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Get a specific product
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

// Create a new product
app.post("/api/products", (req, res) => {
  const newProduct = {
    ...req.body,
    _id: Date.now().toString(), // Simple mock ID generation
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update a product
app.put("/api/products/:id", (req, res) => {
  const index = products.findIndex(p => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  
  const updatedProduct = {
    ...products[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  products[index] = updatedProduct;
  res.json(updatedProduct);
});

// Delete a product
app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex(p => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  
  products.splice(index, 1);
  res.status(204).send();
});

// Payment processing
app.post("/pay", async (req, res) => {
  console.log(req.body.token);
  try {
    await Stripe.charges.create({
      source: req.body.token.id,
      amount: req.body.amount,
      currency: "usd",
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
