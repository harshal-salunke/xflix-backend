const mongoose = require('mongoose');
const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 8082;

mongoose.connect(process.env.MONGODB_URI)
    .then((connect) => {
        console.log('MongoDB Connected', connect.connection.host, connect.connection.name);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    })