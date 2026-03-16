const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

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

// MongoDB Connection
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.warn('WARNING: MONGODB_URI not found. Data will not be saved permanently.');
}

// Database Schema
const TripSchema = new mongoose.Schema({
    tripDate: String,
    vehicleNo: String,
    weight: String,
    freightAmount: Number,
    openingBalance: Number,
    advancePayment: Number,
    loadingStation: String,
    unloadingStation: String,
    expenseAmount: Number,
    expenseReason: String,
    createdAt: String
});

const PaymentSchema = new mongoose.Schema({
    amount: Number,
    date: String,
    createdAt: String
});

const PartySchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: String,
    trips: [TripSchema],
    payments: [PaymentSchema]
});

const Party = mongoose.model('Party', PartySchema);

// Routes
app.get('/api/parties', async (req, res) => {
    try {
        const parties = await Party.find();
        res.json(parties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/parties', async (req, res) => {
    const party = new Party({
        name: req.body.name,
        contact: req.body.contact,
        trips: [],
        payments: []
    });
    try {
        const newParty = await party.save();
        res.status(201).json(newParty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/parties/:id/trips', async (req, res) => {
    try {
        const party = await Party.findById(req.params.id);
        if (party) {
            party.trips.push(req.body);
            await party.save();
            res.status(201).json(party);
        } else {
            res.status(404).send('Party not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/parties/:id', async (req, res) => {
    try {
        const party = await Party.findByIdAndDelete(req.params.id);
        if (party) {
            res.status(200).json({ message: 'Party deleted successfully' });
        } else {
            res.status(404).send('Party not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/parties/:id/payments', async (req, res) => {
    try {
        const party = await Party.findById(req.params.id);
        if (party) {
            party.payments.push(req.body);
            await party.save();
            res.status(201).json(party);
        } else {
            res.status(404).send('Party not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running at http://0.0.0.0:${PORT}`);
});
