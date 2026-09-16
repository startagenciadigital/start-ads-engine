# 📘 Tutorial Oficial: Criação de Token de Acesso Permanente (Meta Ads API)

> **START ADS ENGINE** — Diretriz Operacional de Integração & Autenticação  
> **Objetivo:** Gerar um token de acesso que **nunca expira** via *System User* (Usuário do Sistema) para garantir o monitoramento contínuo das contas de anúncio na aplicação local e em produção (Vercel).

---

## 1. Por que usar Token Permanente em vez do Graph API Explorer?

| Tipo de Token | Duração | Problema Operacional |
| :--- | :--- | :--- |
| **Graph API Explorer (Padrão)** | 1 a 2 horas | Expira rapidamente (`OAuthException 190`), exigindo reconexão manual constante. |
| **Token de Longa Duração (User)** | Até 60 dias | Expira se a senha do Facebook for trocada ou após 2 meses. |
| **Token de Usuário do Sistema (System User)** | **Permanente (Nunca expira)** | **Ideal para a ENGINE**. Só expira se revogado manualmente nas configurações. |

---

## 2. ⚠️ Pré-requisito Obrigatório: Acesso Total (Administrador)

Para criar um *Usuário do Sistema*, a sua conta no Meta Business Suite **PRECISA** ter **Acesso Total (Administrador)** ao Portfólio Empresarial.

> **Importante:** Se a sua conta estiver como **"Acesso parcial (Básico)"**, o botão e o menu *"Usuários do sistema"* ficarão ocultos.

### Como liberar o acesso de Administrador:
1. O proprietário do Portfólio Empresarial (ex: **Alex Voltagem**) deve acessar: [business.facebook.com/settings](https://business.facebook.com/settings).
2. No menu lateral, clicar em **Usuários ➔ Pessoas**.
3. Localizar seu usuário (ex: **FAUZER CRUZ**), clicar nos **três pontinhos (`...`)** à direita.
4. Clicar em **Editar permissões** e alterar para **Acesso total (Tudo)**.
5. Salvar. Após isso, dê um **F5 (atualizar)** na sua tela e o menu estará liberado.

---

## 3. Passo a Passo: Gerando o Token Permanente

### Passo 1: Criar o Usuário do Sistema
1. Acesse: [https://business.facebook.com/settings](https://business.facebook.com/settings).
2. No menu lateral esquerdo, vá em **Usuários** ➔ **Usuários do sistema** (*System Users*).
3. Clique no botão azul **Adicionar**.
4. Defina:
   - **Nome do Usuário do Sistema:** `Start Ads Engine`
   - **Função do Usuário do Sistema:** **Administrador** (*Admin System User*).
5. Clique em **Criar usuário do sistema**.

---

### Passo 2: Atribuir a Conta de Anúncios e Páginas ao Usuário
1. Com o usuário `Start Ads Engine` selecionado na lista, clique no botão **Atribuir ativos** (*Assign Assets*).
2. **Contas de Anúncios:**
   - Selecione a categoria **Contas de anúncios**.
   - Marque a conta do cliente (ex: `Alex Voltagem / Banda A Voltagem` - `act_1717085079153654`).
   - Na coluna da direita, ative a chave de controle total: **Gerenciar conta de anúncios** (*Manage Ad Account*).
3. **Páginas (Opcional, mas recomendado para postagens e Reels):**
   - Selecione a categoria **Páginas**.
   - Marque a página correspondente.
   - Ative a chave de controle total.
4. Clique em **Salvar alterações**.

---

### Passo 3: Gerar o Token de Acesso Permanente
1. Ainda na tela do usuário `Start Ads Engine`, clique no botão **Gerar novo token** (*Generate New Token*).
2. Uma janela modal se abrirá com as configurações do token:
   - **Selecionar aplicativo:** Escolha o App criado no Meta for Developers.
   - **Expiração do token (*Token Expiration*):** Selecione **Nunca** (*Never*).
   - **Permissões (*Scopes*):** Marque rigorosamente as seguintes caixas:
     - `ads_read` *(leitura de campanhas, conjuntos e anúncios)*
     - `ads_management` *(pausa, ativação e criação de anúncios pelo Co-Piloto)*
     - `read_insights` *(leitura de métricas granulares, CPM, Hook Rate e Hold Rate)*
     - `business_management` *(gestão do portfólio)*
     - `pages_read_engagement` *(leitura de postagens do feed/reels)*
     - `pages_show_list` *(listagem de páginas associadas)*
3. Role até o final e clique no botão **Gerar token**.
4. **ATENÇÃO:** O token gerado (começando com `EAAB...`) será exibido **apenas uma vez**. Clique no botão **Copiar** e guarde-o em local seguro imediatamente.

---

## 4. Configurando o Token no START ADS ENGINE

### Ambiente Local (`.env`)
Abra o arquivo `.env` na raiz do projeto e atualize a linha:
```env
META_ADS_ACCESS_TOKEN=EAAB_seu_token_permanente_aqui...
META_ADS_AD_ACCOUNT_ID=act_1717085079153654
```

### Ambiente de Produção (Vercel)
Se a aplicação estiver publicada na Vercel:
1. Acesse o dashboard do projeto na [Vercel](https://vercel.com).
2. Vá em **Settings** ➔ **Environment Variables**.
3. Atualize ou crie a variável:
   - **Key:** `META_ADS_ACCESS_TOKEN`
   - **Value:** `EAAB_seu_token_permanente_aqui...`
4. Dispare um **Redeploy** para aplicar a nova credencial.

---

## 5. Como Testar se o Token está Operacional

Com o servidor local ativo (`npm start`), execute no terminal:
```bash
node -e "const http = require('http'); http.get('http://127.0.0.1:3000/api/metricas', (res) => { let body = ''; res.on('data', d => body += d); res.on('end', () => console.log('STATUS:', res.statusCode, JSON.parse(body).sucesso ? 'CONECTADO COM SUCESSO' : 'ERRO')); });"
```
Ou acesse diretamente no navegador:
👉 [http://localhost:3000/gestor](http://localhost:3000/gestor)

Se o token for válido:
- As métricas de **Hook Rate**, **Hold Rate**, **Investimento** e **Curva de CPM** serão consumidas em tempo real diretamente dos servidores da Meta via Graph API v20.0+.
