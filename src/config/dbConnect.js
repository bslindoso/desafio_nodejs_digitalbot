import mongoose from "mongoose";

mongoose.connect("mongodb+srv://desafio-squadra:Q7SHRl5R5FV4a3bT@node-express.fhcwlrb.mongodb.net/desafio-squadra-crud?");

const db = mongoose.connection;

export default db;