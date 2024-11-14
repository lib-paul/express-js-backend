// routes/trabajopracticoRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
let data = JSON.parse(fs.readFileSync('pruebas.json'));

// TODAS LAS PRUEBAS SE REALIZARON USANDO POSTMAN, EN CASO DE ENVIAR DATOS SE UTILIZO LA OPCION BODY->RAW->JSON.

// ----------------------------- HTTP GET ----------------------------
// Lee el archivo de pruebas y devuelve todos los datos contenidos en el mismo en formato de JSON.
router.get('/', (req, res) => {
    try {
        res.json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// ----------------------------- HTTP GET ----------------------------
// Lee el archivo de pruebas y obtiene un usuario con el email (esto puede se puede cambiar por cualquier otro dato en la ruta).
router.get('/:email', (req, res) => {
    try {
        const user = data.find(item => item.email === req.params.email);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// ----------------------------- HTTP POST ----------------------------
// Agrega un usuario nuevo al archivo de pruebas con los datos del body.
router.post('/agregar', (req, res) => {
    try {
        const user = {
            email: req.body.email,
            name: req.body.name,
            lastname: req.body.lastname,
            number: req.body.number,
        };
        data.push(user);
        fs.writeFileSync('pruebas.json', JSON.stringify(data, null, 2));
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// ----------------------------- HTTP PUT ----------------------------
// Lee el archivo de pruebas y modifica un usuario con el email (esto puede se puede cambiar por cualquier otro dato en la ruta) y devuelve el usuario modificado
// o error en caso de no encontrar el usuario.
router.put('/:email', (req, res) => {
    try {
        const index = data.findIndex(item => item.email === req.params.email);
        if (index === -1) return res.status(404).json({ msg: 'Usuario no encontrado' });
        const { name, lastname, number } = req.body;
        data[index] = { ...data[index], name, lastname, number };
        fs.writeFileSync('pruebas.json', JSON.stringify(data, null, 2));
        res.json(data[index]);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// ----------------------------- HTTP DELETE ----------------------------
// Lee el archivo de pruebas y elimina un usuario con el email (esto puede se puede cambiar por cualquier otro dato en la ruta) y devuelve un mensaje de exito o de 
// error en caso de no encontrar al usuario.
router.delete('/:email', (req, res) => {
    try {
        const index = data.findIndex(item => item.email === req.params.email);
        if (index === -1) return res.status(404).json({ msg: 'Usuario no encontrado' });
        data.splice(index, 1);
        fs.writeFileSync('pruebas.json', JSON.stringify(data, null, 2));
        res.json({ msg: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
