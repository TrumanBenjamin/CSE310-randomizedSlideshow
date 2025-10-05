import express from "express";
import fs from 'fs';
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { query } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// serve static
app.use(express.static(path.join(__dirname, "public")));

// serve images from db with local image storage path
const IMAGE_ROOT = process.env.IMAGE_ROOT;

app.use("/images", express.static(IMAGE_ROOT));

app.get("/", async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT url, COALESCE(alt,'') AS alt
       FROM for_sale_photos
       ORDER BY RANDOM()
       LIMIT 5`
    );

    // throw an exception
    if (!rows || rows.length === 0) {
      throw new Error("No images found in the database!");
    }

    res.render("index", { photos: rows });

  } catch (err) {
    // handle errors
    console.error("❌ Error loading images:", err.message);

    // error message
    res.status(500).send(`
      <h1>Something went wrong</h1>
      <p>${err.message}</p>
    `);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));