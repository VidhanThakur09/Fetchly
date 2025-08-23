// index.js

import express from "express";
import "dotenv/config";
import humaninput from "./humanInput.js";
import loadPDF from "./pdfuploader.js";
import chat from "./retriver.js";
import scrapeWebsite from "./webScraping.js";
import deleteDB from "./deleteDB.js";
import cors from "cors";
import multer from "multer";
import { skipPartiallyEmittedExpressions } from "typescript";

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ["https://fetchly-1-lnae.onrender.com", "https://fetchly-1xki.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/delete', async (req, res) => {
    await deleteDB();
    res.status(200).send("Database deleted successfully.");
});

app.post('/humaninput', async(req, res) => {
    // Add await here
    // await deleteDB();
    const {humanInputText} = req.body;
    await humaninput(humanInputText)
        .then(() => {
            res.status(200).send("Input processed successfully.");
        })
        .catch((error) => {
            console.error("Error processing input:", error);
            res.status(500).send("Internal Server Error");
        });
});

app.post('/pdf', upload.single('pdfFile'), async (req, res) => {
    // Add await here
    // await deleteDB();
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }
        await loadPDF(req.file.path);
        res.status(200).send("PDF processed successfully.");
    } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/retrive', async (req, res) => {
    const { userQuery } = req.body;
    const response = await chat(userQuery);
    res.send(response);
});

app.post('/scrape', async (req, res) => {
    // Add await here
    // await deleteDB();
    const { url } = req.body;
    await scrapeWebsite(url)
        .then(() => {
            res.status(200).send("Website scraped successfully.");
        })
        .catch((error) => {
            console.error("Error scraping website:", error);
            res.status(500).send("Internal Server Error");
        });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});