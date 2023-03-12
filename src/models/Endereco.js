import mongoose from "mongoose";

const enderecoSchema = new mongoose.Schema(
  {
    id: { type: String },
    logradouro: { type: String, required: true },
    numero: { type: Number, required: true },
    bairro: { type: String, required: true },
    complemento: { type: String },
    cep: { type: Number, required: true },
    cidade: { type: String, required: true },
    uf: { type: String, required: true },
  },
  { versionKey: false }
);

const enderecos = mongoose.model("enderecos", enderecoSchema);

export default enderecos;
