import Referente from "../models/referente.js";
import Referido from "../models/referido.js";
import helpersReferente from "../helpers/referente.js";
import helpersGeneral from "../helpers/generales.js";

const httpReferente = {
  //Get
  getAll: async (req, res) => {
    try {
      const referente = await Referente.find().populate("idReferido");
      res.json(referente);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  getPorCedula: async (req, res) => {
    try {
      const { cedula } = req.params;
      const referente = await Referente.find({ cedula }).populate("idReferido");
      res.json(referente);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  },

  getPorCedulaReferido: async (req, res) => {
    try {
      const { cedula } = req.params; 
      const referido = await Referido.findOne({ cedula });
      if (!referido) {
        return res.status(404).json({ error: 'No existe el referido con la cédula digitada' });
      }

      const referente = await Referente.findOne({ idReferido: referido._id }).populate("idReferido");
      if (!referente) {
        return res.status(404).json({ error: 'Referente no encontrado' });
      }

      res.json(referente);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  },


  

  //Post registro referente
  registro: async (req, res) => {
    try {
      const { nombre, cedula, correo, telefono, idReferido } = req.body;

      const referenteExistente = await helpersReferente.existeCedula(
        cedula,
        req
      );

      if (referenteExistente) {
        res.json(referenteExistente);
        const nuevoReferente = new Referente({
          nombre: referenteExistente.nombre,
          cedula: referenteExistente.cedula,
          correo: referenteExistente.correo,
          telefono: referenteExistente.telefono,
          idReferido,
        });

        await nuevoReferente.save();
      } else {
        const nuevoReferente = new Referente({
          nombre: await helpersGeneral.primeraMayuscula(nombre),
          cedula,
          correo,
          telefono,
          idReferido,
        });

        await nuevoReferente.save();

        const ref = await Referente.findById(nuevoReferente._id).populate(
          "idReferido"
        );

        res.json(ref);
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  editar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, cedula, correo, telefono, idReferido } = req.body;

      const referente = await Referente.findByIdAndUpdate(
        id,
        {
          nombre: await helpersGeneral.primeraMayuscula(nombre),
          cedula,
          correo,
          telefono,
          idReferido,
        },
        { new: true }
      ).populate("idUsuario");

      res.json(referente);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },

  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const referente = await Referente.findByIdAndUpdate(
        id,
        { estado: 1 },
        { new: true }
      );
      res.json(referente);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;

      const referente = await Referente.findByIdAndUpdate(
        id,
        { estado: 0 },
        { new: true }
      );
      res.json(referente);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default httpReferente;
