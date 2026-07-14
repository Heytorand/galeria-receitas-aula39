import { Router, Request, Response } from "express";
import { ReceitaRepository } from "../models/ReceitaRepository";
// a) Importar upload
import { upload } from "../middlewares/upload";
import fs from "fs";
import path from "path";

export const apiRoutes = Router();
const repo = new ReceitaRepository();

// GET /api/receitas - listar (com busca opcional) [PRONTO]
apiRoutes.get("/api/receitas", async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const receitas = await repo.listar(q?.toString());
    const dados = receitas.map(r => r.toJSON());
    res.json({ sucesso: true, dados, total: dados.length });
  } catch (e: any) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// POST /api/receitas - criar nova [TEM TODOs DE UPLOAD]
// b) Adicionar upload.single("foto") no POST como middleware
apiRoutes.post("/api/receitas", upload.single("foto"), async (req: Request, res: Response) => {
  try {
    const { titulo, descricao, tempo } = req.body;

    // c) Salvar foto: req.file ? /uploads/${req.file.filename} : null
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    const nova = await repo.criar(titulo, descricao || "", tempo || "", foto);
    res.status(201).json({ sucesso: true, dados: nova.toJSON() });
  } catch (e: any) {
    res.status(400).json({ sucesso: false, erro: e.message });
  }
});

// PUT /api/receitas/:id - editar [PRONTO]
apiRoutes.put("/api/receitas/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const receita = await repo.atualizar(id, req.body);
    if (!receita) { res.status(404).json({ sucesso: false, erro: "Nao encontrada" }); return; }
    res.json({ sucesso: true, dados: receita.toJSON() });
  } catch (e: any) {
    res.status(400).json({ sucesso: false, erro: e.message });
  }
});

// DELETE /api/receitas/:id - remover [PRONTO + DESAFIO BONUS 22]
apiRoutes.delete("/api/receitas/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    
    // Buscar a receita para verificar se ela possui uma foto cadastrada antes de remover
    const receita = await repo.buscarPorId(id);
    if (!receita) { 
      res.status(404).json({ sucesso: false, erro: "Nao encontrada" }); 
      return; 
    }

    // Se a receita tiver uma foto, apaga o arquivo físico do disco
    if (receita.foto) {
      const nomeArquivo = receita.foto.replace("/uploads/", "");
      const caminhoArquivo = path.join(process.cwd(), "uploads", nomeArquivo);
      
      if (fs.existsSync(caminhoArquivo)) {
        fs.unlinkSync(caminhoArquivo);
      }
    }

    const removido = await repo.remover(id);
    res.json({ sucesso: true });
  } catch (e: any) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});