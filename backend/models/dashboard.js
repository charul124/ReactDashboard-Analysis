const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    path: { type: String, required: true },
    widgets: {
        Table: { type: [
            {
                type: Object
            }
        ], default: [] },
        Chart: { type: [
            {
                type: Object
            }
        ], default: [] }
    },
});

const dashboardModel = mongoose.model('Dashboard', dashboardSchema);
module.exports = dashboardModel;
