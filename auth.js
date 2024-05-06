import jsonwebtoken from "jsonwebtoken";

// Chave privada usada para assinar e verificar tokens JWT
export const PRIVATE_KEY = '1010FFF';

// Informações do usuário (pode ser recuperado do banco de dados)
export const user = {
    name: 'Caio Henrique',
    email: 'caiomosmy@example.com'
}

// Middleware para validar tokens JWT
export function tokenValited(request, response, next) {
    // Extrair o token do cabeçalho de autorização
    const [, token] = request.headers.authorization?.split(' ') || [' ', ' '];

    // Verificar se o token está presente
    if (!token) return response.status(401).send('Access denied. No token provided.');

    try {
        // Verificar e decodificar o token JWT usando a chave privada
        const payload = jsonwebtoken.verify(token, PRIVATE_KEY);

        // Extrair o ID do usuário do token decodificado
        const userIdFromToken = typeof payload !== 'string' && payload.user;

        // Verificar se o usuário no token corresponde ao usuário esperado
        if (!user && !userIdFromToken) {
            return response.send(401).json({ message: 'Invalid Token' });
        }

        // Adicionar o usuário extraído do token ao objeto de solicitação
        request.headers['user'] = payload.user;

        // Chamar a próxima função de middleware
        return next(); 
    } catch (error) {
        // Lidar com erros de validação de token
        console.log(error);
        return response.status(401).json({ message: 'Invalid token' });
    }
}
