const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Create a client
router.post('/', async (req, res) => {
    try {
        const newClient = new Client({ ...req.body, createdBy: req.user._id });
        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all clients created by a user
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find({ createdBy: req.user._id });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a client
router.put('/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a client
router.delete('/:id', async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.json({ message: 'Client deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
