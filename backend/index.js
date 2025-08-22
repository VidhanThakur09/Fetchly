import express from "express";
import "dotenv/config";
import humaninput from "./humanInput.js";
import loadPDF from "./pdfuploader.js";
import chat from "./retriver.js";
import scrapeWebsite  from "./webScraping.js"
import deleteDB from "./deleteDB.js";
import cors from "cors";
import multer from "multer";

const app = express();
const upload = multer({ dest: 'uploads/' })
const PORT = process.env.PORT || 3000;

// Configure CORS to allow requests from your frontend URL
app.use(cors({
    origin: ["https://fetchly-1-lnae.onrender.com", "http://localhost:8080"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Explicitly handle preflight requests
// app.options('*', cors());

// app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));

// Middleware to parse JSON
app.use(express.json());

// deleteDb

app.get('/', async(req, res) => {
    await deleteDB();
})

// Basic route
app.post('/humaninput', async(req, res) => {
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
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    await loadPDF(req.file.path);  // pass file path to pdfuploader.js
    res.status(200).send("PDF processed successfully.");
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.post('/retrive',async (req, res)=>{
    const { userQuery } = req.body;
    const response = await chat(userQuery);
    res.send(response);
    
})

app.post('/scrape', async (req, res) => {
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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});