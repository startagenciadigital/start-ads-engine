# 🛡️ Protocolo Git Point (Ponto de Restauração)

Define as diretrizes para criar um ponto de restauração seguro antes de grandes modificações de código.

## Fluxo de Execução
1. **Analisar Status:** Rodar `git status` para verificar alterações pendentes.
2. **Criar Tag de Restauração:**
   ```bash
   git tag -a restore-point-YYYYMMDD-HHMMSS -m "Ponto de restauração seguro"
   ```
3. **Comando de Reversão (Caso Necessário):**
   ```bash
   git reset --hard restore-point-YYYYMMDD-HHMMSS
   ```
