const mongoose = require("mongoose");

mongoose
    .connect(
        'mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.xuhf7jm.mongodb.net/groupomania',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    )
    .then(() => console.log('Connected to MongoDB'))
    .catch ((err) => console.log('Failed to connect to MongoDB', err));