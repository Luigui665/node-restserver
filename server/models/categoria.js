const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, "La descripción es obligatoria"]
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    }
});

/*
categoriaShema.methods.toJSON = function() {
    let categoria = this;
    let catObject = categoria.toObject();
    //delete catObject.password;

    return categoria;
};
*/

categoriaSchema.plugin(uniqueValidator, {
    message: "{PATH} debe de ser único"
});

module.exports = mongoose.model("Categoria", categoriaSchema);