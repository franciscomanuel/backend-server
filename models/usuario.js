var mongose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'El email es obligatorio'] },
    password: { type: String, required: [true, 'El password es obligatorio'] },
    img: { type: String, required: false },
    role: { type: String, required: false, default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} debe ser único'});

module.exports = mongose.model('Usuario', usuarioSchema);