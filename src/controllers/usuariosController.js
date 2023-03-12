import usuarios from "../models/Usuario.js";

class UsuarioController {
  // GET
  static listarUsuarios = (req, res) => {
    usuarios
      .find()
      .populate("endereco")
      .exec((err, usuarios) => {
        res.status(200).json(usuarios);
      });
  };

  static listarUsuarioPorId = (req, res) => {
    const { id } = req.params;
    usuarios
      .findById(id)
      .populate("endereco", "logradouro")
      .exec((err, usuarios) => {
        if (!err) {
          res.status(200).json(usuarios);
        } else {
          res.status(400).send({ message: err.message });
        }
      });
  };

  // POST
  static cadastrarUsuario = (req, res) => {
    let usuario = req.body;
    const camposObrigatorios = [
      "nome",
      "cpf",
      "email",
      "dataNascimento",
      "foto",
      "endereco",
    ];

    // Valida se todos os campos obrigatorios estão presentes no corpo da requisição
    let obrigatorio;
    for (let i = 0; i < camposObrigatorios.length; i++) {
      const element = camposObrigatorios[i];
      if (!usuario.hasOwnProperty(element)) {
        res.status(400).send({ message: `O campo ${element} é obrigatório.` });
        obrigatorio = false;
        break;
      } else {
        obrigatorio = true;
      }
    }

    // Validações
    if (obrigatorio) {
      // Valida CPF
      let cpfValidado = validaCpf(usuario.cpf);
      if (cpfValidado.type == "error") {
        res.status(400).send({ message: `CPF inválido.` });
      } else {
        usuario.cpf = cpfValidado.input;
      }

      // Valida Email
      let emailValidado = validaEmail(usuario.email);
      if (emailValidado.type == "error") {
        res.status(400).send({ message: `Email inválido.` });
      } else {
        usuario.email = emailValidado.input;
      }

      // Valida Data
      let dataValidado = validaDataMenor18Anos(usuario.dataNascimento);
      if (dataValidado.type == "error") {
        res.status(400).send({ message: dataValidado.input });
      } else {
        usuario.dataNascimento = dataValidado.input;
      }

      // Valida Foto URL
      let fotoValidado = validaFotoUrl(usuario.foto);
      if (fotoValidado.type == "error") {
        res.status(400).send({ message: fotoValidado.input });
      } else {
        usuario.foto = fotoValidado.input;
      }

      usuario = new usuarios(req.body);

      console.log(usuario);

      usuario.save((err) => {
        if (err) {
          res
            .status(500)
            .send({ message: `${err.message} - Falha ao cadastrar usuario.` });
        } else {
          res.status(201).send(usuario.toJSON());
        }
      });
    }
  };

  // PUT - PATCH
  static atualizarUsuario = (req, res) => {
    const { id } = req.params;
    usuarios.findByIdAndUpdate(id, { $set: req.body }, (err) => {
      if (!err) {
        res.status(200).send({ message: `Usuario atualizado com sucesso` });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
  };

  // DELETE
  static excluirUsuario = (req, res) => {
    const { id } = req.params;
    usuarios.findByIdAndRemove(id, (err) => {
      if (!err) {
        res.status(200).send({ message: `Usuario deletado com sucesso` });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
  };
}

// FUNÇÕES AUXILIARES
function validaCpf(cpf) {
  let regex = /^\d{3}(\.)?\d{3}(\.)?\d{3}(\-)?\d{2}$/gm;
  let match = cpf.match(regex);

  console.log(`CPF: ${cpf}, typeof: ${typeof cpf}, match: ${match}`);

  if (match) {
    cpf = cpf.replace(/[^\d]+/g, "");

    // Remove alguns CPF's inválidos conhecidos
    if (
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999"
    ) {
      return { type: "error", input: "ERRO CPF", validation: "cpf" };
    }
    return { type: "success", input: cpf, validation: "cpf" };
  } else {
    return { type: "error", input: "ERRO CPF", validation: "cpf" };
  }
}

function validaEmail(input) {
  input = input.toLowerCase();
  const match = input.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.?([a-z]+)?$/gm);

  console.log(`Email: ${input}, typeof: ${typeof input}, match: ${match}`);

  if (!match) {
    return { type: "error", input: "ERRO EMAIL", validation: "email" };
  } else {
    return { type: "success", input: input, validation: "email" };
  }
}

function validaDataMenor18Anos(data) {
  let regex = /^\d{4}-\d{2}-\d{2}$/gm;
  let match = data.match(regex);
  console.log(`Data: ${data}, typeof: ${typeof data}, match: ${match}`);

  if (!match) {
    return {
      type: "error",
      input: "Data inválida. Formato: YYYY-MM-DD",
      validation: "data",
    };
  }

  let dataNascimento = new Date(data);
  if (dataNascimento == "Invalid date") {
    return {
      type: "error",
      input: "Data inválida. Formato: YYYY-MM-DD",
      validation: "data",
    };
  }
  let dataHoje = new Date();
  let idade = dataHoje.getFullYear() - dataNascimento.getFullYear();

  var m = dataHoje.getMonth() - dataNascimento.getMonth();
  if (m < 0 || (m === 0 && dataHoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }

  if (idade < 18 && idade > 0) {
    return {
      type: "error",
      input: "Idade menor que 18 anos",
      validation: "data",
    };
  } else if (idade < 0) {
    return {
      type: "error",
      input: "Data maior que o dia de hoje. Você é um viajante do tempo?",
      validation: "data",
    };
  } else {
    return { type: "success", input: data, validation: "data" };
  }
}

function validaFotoUrl(fotoUrl) {
  let regex = /^(http||https):\/\/\S*/gm;
  let match = fotoUrl.match(regex);
  console.log(
    `Foto URL: ${fotoUrl}, typeof: ${typeof fotoUrl}, match: ${match}`
  );

  if (!match) {
    return { type: "error", input: "Foto inválida", validation: "foto" };
  } else {
    return { type: "success", input: fotoUrl, validation: "foto" };
  }
}

export default UsuarioController;
