const express = require('express');
const cors = require('cors');

const videoRoutes = require('./routes/video.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/v1/videos', videoRoutes);

app.get("/", (req, res) => {
  res.send("XFlix Backend is Live 🚀");
});

module.exports = app;