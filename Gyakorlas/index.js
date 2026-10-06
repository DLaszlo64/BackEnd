const express = require("express")
const app = express(); 
const port  = 3000
app.use(express.json())

let users = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    {
      id: "3",
      name: "Sam Johnson",
      email: "sam.johnson@example.com",
    },
  ];

app.get("/", (req, res) => {
    res.send("Müködik a BackEnd")
})

app.get("/adatok", (req, res) =>{
    res.send(users)

})

app.get("/adatok/1", (req, res) =>{
    res.send(users)
})

app.listen(port, () =>{
    console.log("A server a 3000 porton fut")
})