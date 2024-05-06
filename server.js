import express from "express";
import jsonwebtoken from "jsonwebtoken"; // Corrigido o nome do módulo
import { user, PRIVATE_KEY, tokenValited } from "./auth.js";

const api = express();
api.use(express.json())

api.get('/', (_, res) => res.status(200).json({
    message: "This is a public router ..."
}));

api.get('/login', (req, res) => {
    const [, hash] = req.headers.authorization?.split(' ') || [' ', ' ']; // Corrigido a variável
    const [email, password] = Buffer.from(hash, 'base64').toString().split(':'); // Corrigido a variável

    try {
        const correctPassword = email === 'caiomosmy@example.com' && password === '123456'; // Corrigido a variável

        if (!correctPassword) return res.status(401).send('Password or Email incorrect !'); // Corrigido a variável

        const token = jsonwebtoken.sign(
            { user: JSON.stringify(user) },
            PRIVATE_KEY,
            { expiresIn: '60m' }
        );

        return res.status(200).json({ data: { user, token } });
    } catch (error) {
        console.log(error);
        return res.send(error);
    }
});

api.use('*', tokenValited);

api.get('/private', (req, res) => {
    const { user } = req.headers;
    const currentUser = JSON.parse(user);
    return res.status(200).json({
        message: 'This is a private router...',
        data: {
            userLogged: currentUser
        }
    })
});
api.listen(3333, () => console.log('server running...'));
