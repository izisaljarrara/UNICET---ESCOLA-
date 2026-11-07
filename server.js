
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require ('./src/docs/swagger-output.json');
const estudanteRoutes = require('./src/routes/EstudanteRoutes');
const cursoRoutes = require('./src/routes/cursoRoutes');
const matriculas = require('./src/routes/MatriculasRoutes')

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/', estudanteRoutes);
app.use('/', cursoRoutes);
//Disponibiliza a rota de documentação visual
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

