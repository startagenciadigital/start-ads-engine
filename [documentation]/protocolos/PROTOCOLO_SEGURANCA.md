# 🛡️ Protocolo de Segurança e Defesa de Credenciais

Este documento estabelece as diretrizes para gestão segura de credenciais de marketing e inteligência artificial no **START ADS ENGINE**.

## 1. Proteção do Meta Marketing API Token
- O `META_ADS_ACCESS_TOKEN` possui privilégios de criação e alteração de anúncios.
- O token deve residir estritamente no arquivo `.env` (no ambiente local) e em Environment Variables seguras (no painel da Vercel).
- O arquivo `.env` está explicitamente adicionado ao `.gitignore` e NUNCA deve ser comitado.

## 2. Proteção da Chave Google Gemini Flash
- A `GEMINI_API_KEY` deve ser consumida exclusivamente pelo backend (`services/geminiService.js`).
- O frontend público JAMAIS realiza chamadas diretas com a chave exposta; todas as chamadas passam pelos endpoints seguros `/api/pre-voo-ia` e `/api/analise-ia`.

## 3. Uploads Locais de Mídia
- Arquivos de imagem e vídeo enviados pelo criador passam por validação de tamanho (limite 50MB) e extensão segura via `multer`.
