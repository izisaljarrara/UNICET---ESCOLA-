
const express = require('express');
const estudanteRoutes = require('./src/routes/EstudanteRoutes');
const cursoRoutes = require('./src/routes/cursoRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/', estudanteRoutes);
app.use('/', cursoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
