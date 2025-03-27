const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path')
const u_router= require('./routes/auth')
const m_router=require('./routes/matchRoutes')

const app = express();

dotenv.config();
// app.use(express.json())
// app.use(express.urlencoded({extended : true,limit}))

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Middleware
// app.use(cors());
// const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Routes
app.get('/',(req,res)=>{
  res.send("iam main route")
})

app.use('/api/auth',u_router);

app.use('/api/matches',m_router );

// Error handling middleware (to ensure JSON responses)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));