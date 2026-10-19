import express, { json } from "express"
import mysql2 from "mysql2"

const app = express()

app.use(express.json());