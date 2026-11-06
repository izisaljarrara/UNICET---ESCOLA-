
const db = require('../database/db');

class DisciplinasController {
  // Listar todos as disciplinas
  static listarTodos(req, res) {
    db.all("SELECT * FROM disciplinas", [], (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      return res.status(200).json(rows);
    });
  }

  // Listar disciplina por ID
  static listarPorId(req, res) {
    const { id } = req.params;

    db.get("SELECT * FROM disciplins WHERE id = ?", [id], (err, row) => {
      if (err) return res.status(500).json({ erro: err.message });

      if (!row) {
        return res.status(404).json({ erro: "disciplina não encontrada." });
      }

      return res.status(200).json(row);
    });
  }

  // Salvar Disciplina
  static salvar(req, res) {
    const { nome, cargaHoraria, turno } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({
        erro: "O nome da disciplina é obrigatório."
      });
    }

    const sql = `
      INSERT INTO Disciplinas (nome, cargaHoraria, turno)
      VALUES (?, ?, ?)
    `;

    db.run(sql, [nome.trim(), cargaHoraria, turno], function(err) {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      return res.status(201).json({
        id: this.lastID,
        nome: nome.trim(),
        cargaHoraria,
        turno
      });
    });
  }

  // Editar Disciplinas
  static editar(req, res) {
    const { id } = req.params;
    const { nome, cargaHoraria, turno } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({
        erro: "O nome da disciplina é obrigatório."
      });
    }

    const sql = `
      UPDATE Disciplinas
      SET nome = ?, cargaHoraria = ?, turno = ?
      WHERE id = ?
    `;

    db.run(
      sql,
      [nome.trim(), cargaHoraria, turno, id],
      function(err) {
        if (err) {
          return res.status(500).json({ erro: err.message });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            erro: "Disciplina não encontrado."
          });
        }

        return res.status(200).json({
          id,
          nome: nome.trim(),
          cargaHoraria,
          turno
        });
      }
    );
  }

  // Deletar Disciplina
  static deletar(req, res) {
    const { id } = req.params;

    db.run("DELETE FROM Disciplinas WHERE id = ?", [id], function(err) {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          erro: "Disciplina não encontrado."
        });
      }

      return res.status(200).json({
        mensagem: " Disciplina removida com sucesso!"
      });
    });
  }
}

module.exports = DisciplinasController;
