var mongose = require('mongoose');

var Schema = mongose.Schema;

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'El email es obligatorio'] },
    password: { type: String, required: [true, 'El password es obligatorio'] },
    img: { type: String, required: false },
    role: { type: String, required: false, default: 'USER_ROLE' }
});

module.exports = mongose.model('Usuario', usuarioSchema);