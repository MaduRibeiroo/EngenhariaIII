/*const jwt = require('jsonwebtoken');

module.exports = function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ mensagem: 'Token não fornecido.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ mensagem: 'Token inválido.' });
        req.usuario = usuario;
        next();
    });
};*/

// autenticarToken.js
import jwt from 'jsonwebtoken';

export default function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Aqui o erro pode ser TokenExpiredError (token expirado) ou outro erro
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    req.usuario = user; // dados decodificados do token, se precisar
    next();
  });
}
