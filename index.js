const express = require('express');
const admin = require('firebase-admin');
const app = express();

app.use(express.json());

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.post('/crear-usuario', async (req, res) => {
  const { correo, contrasena, nombre, puesto, rol } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email: correo,
      password: contrasena,
      displayName: nombre
    });

    await admin.firestore().collection('usuarios').doc(userRecord.uid).set({
      nombre,
      correo,
      puesto,
      rol,
      creadoEn: new Date().toISOString()
    });

    res.json({ ok: true, uid: userRecord.uid });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor corriendo en puerto', PORT));
