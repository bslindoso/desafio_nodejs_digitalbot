import express from "express";
import EnderecoController from "../controllers/enderecosController.js";

const router = express.Router();

router
    .get("/enderecos", EnderecoController.listarEnderecos)
    .get("/enderecos/buscarcep", EnderecoController.buscarCepCorreios)
    .get("/enderecos/:id", EnderecoController.listarEnderecoPorId)
    .post("/enderecos", EnderecoController.cadastrarEndereco)
    .put("/enderecos/:id", EnderecoController.atualizarEndereco)
    .patch("/enderecos/:id", EnderecoController.atualizarEndereco)
    .delete("/enderecos/:id", EnderecoController.excluirEndereco)

export default router;