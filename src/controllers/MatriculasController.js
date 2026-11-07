const db = require('../database/db');

class MatriculaController {
  // GET /matriculas - Listar todas com os nomes do Estudante e Curso (JOIN)
  static listarTodos(req, res) {
    const sql = `
      SELECT 
        matriculas.id,
        matriculas.numeroMatricula,
        matriculas.dataMatricula,
        matriculas.status,
        estudantes.nome AS nomeEstudante,
        cursos.nome AS nomeCurso
      FROM matriculas
      INNER JOIN estudantes ON matriculas.estudante_id = estudantes.id
      INNER JOIN cursos ON matriculas.curso_id = cursos.id
    `;
    db.all(sql, [], (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      return res.status(200).json(rows);
    });
  }

  // GET /matriculas/:id - Buscar matrícula por ID
  static listarPorId(req, res) {
    const { id } = req.params;
    const sql = `
      SELECT 
        matriculas.id,
        matriculas.numeroMatricula,
        matriculas.dataMatricula,
        matriculas.status,
        matriculas.estudante_id,
        matriculas.curso_id,
        estudantes.nome AS nomeEstudante,
        cursos.nome AS nomeCurso
      FROM matriculas
      INNER JOIN estudantes ON matriculas.estudante_id = estudantes.id
      INNER JOIN cursos ON matriculas.curso_id = cursos.id
      WHERE matriculas.id = ?
    `;
    db.get(sql, [id], (err, row) => {
      if (err) return res.status(500).json({ erro: err.message });
      if (!row) return res.status(404).json({ erro: "Matrícula não encontrada." });
      return res.status(200).json(row);
    });
  }

  // POST /matriculas - Cadastrar matrícula
  static salvar(req, res) {
    const { estudante_id, curso_id, numeroMatricula, dataMatricula, status } = req.body;

    if (!estudante_id || !curso_id || !numeroMatricula || !dataMatricula) {
      return res.status(400).json({ erro: "Campos obrigatórios: estudante_id, curso_id, numeroMatricula e dataMatricula." });
    }

    const statusFinal = status || 'ATIVA';
    const sql = `
      INSERT INTO matriculas (estudante_id, curso_id, numeroMatricula, dataMatricula, status) 
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [estudante_id, curso_id, numeroMatricula, dataMatricula, statusFinal], function(err) {
      if (err) return res.status(500).json({ erro: err.message });
      return res.status(201).json({
        id: this.lastID,
        estudante_id,
        curso_id,
        numeroMatricula,
        dataMatricula,
        status: statusFinal
      });
    });
  }

  // PUT /matriculas/:id/status - Alterar somente o status da matrícula
  static editarStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ erro: "Informe o novo status da matrícula." });
    }

    const sql = `UPDATE matriculas SET status = ? WHERE id = ?`;
    db.run(sql, [status, id], function(err) {
      if (err) return res.status(500).json({ erro: err.message });
      if (this.changes === 0) return res.status(404).json({ erro: "Matrícula não encontrada." });

      return res.status(200).json({ mensagem: "Status da matrícula atualizado!", status });
    });
  }

  // DELETE /matriculas/:id - Deletar matrícula
  static deletar(req, res) {
    const { id } = req.params;
    const sql = `DELETE FROM matriculas WHERE id = ?`;
    db.run(sql, [id], function(err) {
      if (err) return res.status(500).json({ erro: err.message });
      if (this.changes === 0) return res.status(404).json({ erro: "Matrícula não encontrada." });
      return res.status(200).json({ mensagem: "Matrícula removida com sucesso!" });
    });
  }
}

module.exports = MatriculaController;