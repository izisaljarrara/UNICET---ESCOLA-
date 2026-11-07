const db = require('../database/db');

class DisciplinaController {
  // GET /disciplinas - Lista todas (com nome do curso via JOIN simples)
  static listarTodos(req, res) {
    const sql = `
      SELECT disciplinas.*, cursos.nome AS nomeCurso 
      FROM disciplinas 
      LEFT JOIN cursos ON disciplinas.curso_id = cursos.id
    `;
    db.all(sql, [], (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      return res.status(200).json(rows);
    });
  }

  // GET /disciplinas/:id - Buscar por ID
  static listarPorId(req, res) {
    const { id } = req.params;
    const sql = `
      SELECT disciplinas.*, cursos.nome AS nomeCurso 
      FROM disciplinas 
      LEFT JOIN cursos ON disciplinas.curso_id = cursos.id 
      WHERE disciplinas.id = ?
    `;
    db.get(sql, [id], (err, row) => {
      if (err) return res.status(500).json({ erro: err.message });
      if (!row) return res.status(404).json({ erro: "Disciplina não encontrada." });
      return res.status(200).json(row);
    });
  }

  // GET /disciplinas/curso/:curso_id - Filtrar disciplinas de um curso específico
  static listarPorCurso(req, res) {
    const { curso_id } = req.params;
    const sql = `SELECT * FROM disciplinas WHERE curso_id = ?`;
    db.all(sql, [curso_id], (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      return res.status(200).json(rows);
    });
  }

  // POST /disciplinas - Salvar disciplina
  static salvar(req, res) {
    const { nome, codigo, cargaHoraria, curso_id } = req.body;

    if (!nome || !codigo || !cargaHoraria || !curso_id) {
      return res.status(400).json({ erro: "Campos obrigatórios: nome, codigo, cargaHoraria e curso_id." });
    }

    const sql = `INSERT INTO disciplinas (nome, codigo, cargaHoraria, curso_id) VALUES (?, ?, ?, ?)`;
    db.run(sql, [nome, codigo, cargaHoraria, curso_id], function(err) {
      if (err) return res.status(500).json({ erro: err.message });
      return res.status(201).json({
        id: this.lastID,
        nome,
        codigo,
        cargaHoraria,
        curso_id
      });
    });
  }

  // PUT /disciplinas/:id - Editar disciplina
  static editar(req, res) {
    const { id } = req.params;
    const { nome, codigo, cargaHoraria, curso_id } = req.body;

    if (!nome || !codigo || !cargaHoraria || !curso_id) {
      return res.status(400).json({ erro: "Campos obrigatórios para atualização." });
    }

    const sql = `UPDATE disciplinas SET nome = ?, codigo = ?, cargaHoraria = ?, curso_id = ? WHERE id = ?`;
    db.run(sql, [nome, codigo, cargaHoraria, curso_id, id], function(err) {
      if (err) return res.status(500).json({ erro: err.message });
      if (this.changes === 0) return res.status(404).json({ erro: "Disciplina não encontrada." });

      return res.status(200).json({
        mensagem: "Disciplina atualizada com sucesso!",
        disciplina: { id: parseInt(id), nome, codigo, cargaHoraria, curso_id }
      });
    });
  }

  // DELETE /disciplinas/:id - Deletar disciplina
  static deletar(req, res) {
    const { id } = req.params;
    const sql = `DELETE FROM disciplinas WHERE id = ?`;
    db.run(sql, [id], function(err) {
      if (err) return res.status(500).json({ erro: err.message });
      if (this.changes === 0) return res.status(404).json({ erro: "Disciplina não encontrada." });
      return res.status(200).json({ mensagem: "Disciplina removida com sucesso!" });
    });
  }
}

module.exports = DisciplinaController;