const express = require('express')
const connectDB = require('./db.js')
const dashboardModel = require('./models/dashboard.js')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

connectDB()

// Get all dashboards
app.get('/', async (req, res) => {
    try {
        const data = await dashboardModel.find();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a single dashboard by path
app.get('/dashboard/:path', async (req, res) => {
    try {
        const { path } = req.params;
        const data = await dashboardModel.findOne({ path });
        if (!data) {
            return res.status(404).json({ error: 'Dashboard not found' });
        }
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new dashboard
app.post('/post', async (req, res) => {
    console.log(req.body);
    try {
        const dashboard = new dashboardModel(req.body);
        const result = await dashboard.save();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request body' });
    }
});

// Update a dashboard by path (including widgets)
app.put('/dashboard/:path', async (req, res) => {
    try {
        const { path } = req.params;
        const updatedDashboard = await dashboardModel.findOneAndUpdate(
            { path },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedDashboard) {
            return res.status(404).json({ error: 'Dashboard not found' });
        }
        res.json(updatedDashboard);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request body' });
    }
});

// Delete a dashboard by path
app.delete('/dashboard/:path', async (req, res) => {
    try {
        const { path } = req.params;
        const deletedDashboard = await dashboardModel.findOneAndDelete({ path });
        if (!deletedDashboard) {
            return res.status(404).json({ error: 'Dashboard not found' });
        }
        res.json({ message: 'Dashboard deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3003, () => {
    console.log('Server is running on port 3003');
});
