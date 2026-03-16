const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Hardcoded user data
const users = [
    { username: 'ashok', password: 'password1' },
    { username: 'ashok', password: 'password2' },
    { username: 'ashok', password: 'password3' },
    { username: 'ashok', password: 'password4' },
    { username: 'ashok', password: 'password5' },
];

app.use(cors());
app.use(bodyParser.json());

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helper to read data
const readData = () => {
    return JSON.parse(fs.readFileSync(DATA_FILE));
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Routes
app.get('/api/parties', (req, res) => {
    res.json(readData());
});

app.post('/api/parties', (req, res) => {
    const parties = readData();
    const newParty = {
        name: req.body.name,
        contact: req.body.contact,
        trips: [],
        payments: []
    };
    parties.push(newParty);
    writeData(parties);
    res.status(201).json(newParty);
});

app.post('/api/parties/:index/trips', (req, res) => {
    const parties = readData();
    const index = parseInt(req.params.index);
    if (parties[index]) {
        parties[index].trips.push(req.body);
        writeData(parties);
        res.status(201).json(parties[index]);
    } else {
        res.status(404).send('Party not found');
    }
});

app.post('/api/parties/:index/payments', (req, res) => {
    const parties = readData();
    const index = parseInt(req.params.index);
    if (parties[index]) {
        parties[index].payments.push(req.body);
        writeData(parties);
        res.status(201).json(parties[index]);
    } else {
        res.status(404).send('Party not found');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running at http://0.0.0.0:${PORT}`);
});
