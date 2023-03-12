import mongoose from "mongoose";
const usuarioSchema = new mongoose.Schema({
  id: { type: String },
  nome: { type: String, required: true },
  cpf: { type: String, required: true },
  email: { type: String, required: true },
  dataNascimento: { type: String, required: true },
  foto: { type: String, required: true },
  endereco: { type: mongoose.Schema.Types.ObjectId, ref: 'enderecos', required: true },
});

const usuarios = mongoose.model("uusuarios", usuarioSchema);

export default usuarios;
