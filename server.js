require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const gdriveRoutes = require('./routes/gdrive');

const app = express();

app.use(express.json());
app.use('/api', gdriveRoutes);

app.get('/', (req, res) => {
  res.send("PPP");
});

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
