const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors");

const PORT = process.env.PORT || 3002;


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(cookieParser());
app.use(express.json());
require("./DB/connetion") // it will comes in db file.

const GymRoutes = require("./Routes/gym")
const MembershipRoutes = require("./Routes/membership")
const MemberRoutes = require("./Routes/member")

app.use("/members", MemberRoutes);
app.use("/plans", MembershipRoutes)
app.use("/auth", GymRoutes)


// app.get("/",(req,res)=>{
//     res.send("message: Hello World server is running successfully");
// })

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    
})
