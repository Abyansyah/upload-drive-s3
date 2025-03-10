require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const gdriveRoutes = require('./routes/gdrive');

const app = express();

app.use(express.json());
app.use('/api', gdriveRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
