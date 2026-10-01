const express = require("express");
const app = express();
const PORT = 3000;

app.post('/', (req, res) =>{
    res.send("POST Request Called")
})


app.listen(PORT, ()=> {
    
})