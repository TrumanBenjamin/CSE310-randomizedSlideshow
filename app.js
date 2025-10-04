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
    res.render("index", { photos: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));