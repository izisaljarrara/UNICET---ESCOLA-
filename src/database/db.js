
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../escola.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS estudantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      dataNascimento TEXT NOT NULL,
      telefone TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cursos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cargaHoraria INTEGER,
      turno TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela cursos:', err.message);
    } else {
      console.log('Tabela cursos verificada com sucesso!');
    }
  });
});

module.exports = db;
db.run(`
    CREATE TABLE IF NOT EXISTS disciplinas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        codigo TEXT NOT NULL UNIQUE,
        cargaHoraria INTEGER NOT NULL,
        curso_id INTEGER NOT NULL,
        FOREIGN KEY (curso_id) REFERENCES cursos(id)
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS matriculas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudante_id INTEGER NOT NULL,
        curso_id INTEGER NOT NULL,
        numeroMatricula TEXT NOT NULL UNIQUE,
        dataMatricula TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ATIVA',
        FOREIGN KEY (estudante_id) REFERENCES estudantes(id),
        FOREIGN KEY (curso_id) REFERENCES cursos(id)
    )
`);
// 6. Tabela de Notas (Avaliações)
  db.run(`
    CREATE TABLE IF NOT EXISTS notas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matricula_id INTEGER NOT NULL,
      disciplina_id INTEGER NOT NULL,
      valor REAL NOT NULL,
      tipoAvaliacao TEXT NOT NULL,
      dataLancamento TEXT NOT NULL,
      FOREIGN KEY (matricula_id) REFERENCES matriculas(id),
      FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
    )
  `);
// 5. Tabela de Professores
  db.run(`
    CREATE TABLE IF NOT EXISTS professores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      titulacao TEXT NOT NULL,
      telefone TEXT
    )
  `);