const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json());

const path = require('path');
const FILE = path.join(__dirname, 'data.json');

/* ---------- GET ALL DATA ---------- */

app.get('/data', (req, res) => {

    fs.readFile(FILE, 'utf8', (err, data) => {

        if(err){
            console.log("Error reading file");
            return res.json({
                subjects: [],
                activities: [],
                bookmarks: [],
                uploads: [],
                stats: {},
                streak: 0,
                lastActiveDate: null
            });
        }

        res.json(JSON.parse(data));
    });
});


/* ---------- SAVE ALL DATA ---------- */

app.post('/data', (req, res) => {

    fs.writeFile(FILE, JSON.stringify(req.body, null, 2), (err) => {

        if(err){
            console.log("Error saving file");
            return res.status(500).json({ error: "Failed to save data" });
        }

        res.json({ message: "Saved successfully" });
    });
});


/* ---------- ROOT CHECK ---------- */

app.get('/', (req, res) => {
    res.send("Knowledge Vault Backend Running 🚀");
});


/* ---------- START SERVER ---------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});