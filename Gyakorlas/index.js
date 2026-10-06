const express = require("express")
const app = express(); 
const port  = 3000

app.get("/", (req, res) => {
    res.send("Müködik a BackEnd")
})

app.listen(port, () =>{
    console.log("A server a 3000 porton fut")
})