const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const analyticsRoutes = require("./routes/analyticsRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors(
   {
    origin : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials : true
   }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/analytics", analyticsRoutes);


app.get("/", (req,res)=> {
    res.send("shopnest backend is working properly");
})

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

const Port = process.env.PORT || 5000;      
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
})