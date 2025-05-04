const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const app = express();




const userRoutes = require("./routes/user.routes");
const authRoutes = require('./routes/auth.routes');


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Kết nối database
const db = require("./models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Database sync error:", err);
  });



// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Node.js, Express & Sequelize application." });
});

app.use("/api/users", userRoutes);
// Routes
app.use('/api/auth', authRoutes);

// Xử lý lỗi 404
app.use((req, res, next) => {
  res.status(404).send({
    message: "Route not found!",
  });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
