import enderecos from "../models/Endereco.js";
import axios from "axios";

class EnderecoController {
  // GET
  static listarEnderecos = (req, res) => {
    enderecos.find((err, enderecos) => {
      res.status(200).json(enderecos);
    });
  };

  static listarEnderecoPorId = (req, res) => {
    const { id } = req.params;
    enderecos.findById(id, (err, enderecos) => {
      if (!err) {
        res.status(200).json(enderecos);
      } else {
        res.status(400).send({
          message: `Falha ao localizar endereço. ID Inválido - ${err.message}`,
        });
      }
    });
  };

  static buscarCepCorreios = (req, res) => {
    const { cep } = req.query;
    axios
      .get(`https://brasilapi.com.br/api/cep/v1/${cep}`)
      .then((resposta) => {
        const data = resposta.data;
        res.status(resposta.status).json(data);
      })
      .catch((err) => {
        const response = err.response;
        const data = response.data;
        if (err) {
          res.status(response.status).json({
            message: `Error: ${data.message}. Motivo: ${data.errors[0].message}`,
          });
        }
      });
  };

  // POST
  static cadastrarEndereco = (req, res) => {
    let endereco = new enderecos(req.body);
    const cepInputado = req.body.cep;
    
    // Validar CEP
    axios
      .get(`https://brasilapi.com.br/api/cep/v1/${cepInputado}`)
      // CEP ENCONTRADO
      .then((resposta) => {
        endereco.save((err) => {
          if (err) {
            res.status(500).send({
              message: `Falha ao cadastrar endereço - ${err.message}`,
            });
          } else {
            res.status(201).send(endereco.toJSON());
          }
        });
      })
      .catch((err) => {
        // CEP NÃO ENCONTRADO
        const response = err.response;
        const data = response.data;
        if (err) {
          res.status(response.status).json({
            message: `Error: ${data.message}. Motivo: ${data.errors[0].message}`,
          });
        }
      });
  };

  // PUT - PATCH
  static atualizarEndereco = (req, res) => {
    const { id } = req.params;
    enderecos.findByIdAndUpdate(id, { $set: req.body }, (err) => {
      if (!err) {
        res.status(200).send({ message: `Endereço atualizado com sucesso` });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
  };

  // DELETE
  static excluirEndereco = (req, res) => {
    const { id } = req.params;
    enderecos.findByIdAndRemove(id, (err) => {
      if (!err) {
        res.status(200).send({ message: `Endereço deletado com sucesso` });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
  };
}

export default EnderecoController;
