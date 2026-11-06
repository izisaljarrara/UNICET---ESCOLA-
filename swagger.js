const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Escola - Documentação Automática',
    description: 'Documentação dos módulos Estudantes, Cursos, Disciplinas e Matrículas',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './src/docs/swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
