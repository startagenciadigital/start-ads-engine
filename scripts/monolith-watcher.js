/**
 * START ADS ENGINE - Anti-Monolith Watcher
 * Monitoramento contínuo de tamanho de arquivos para prevenir monolitos (> 500 linhas).
 */

const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

const LINE_LIMIT = 500;
const WATCH_PATHS = [
  path.join(__dirname, '../api/**/*.js'),
  path.join(__dirname, '../services/**/*.js'),
  path.join(__dirname, '../public/js/**/*.js'),
  path.join(__dirname, '../public/**/*.html'),
  path.join(__dirname, '../server.js')
];

console.log(`\x1b[36m[Anti-Monolith Watcher]\x1b[0m Monitoramento ativo para arquivos > ${LINE_LIMIT} linhas...`);

const watcher = chokidar.watch(WATCH_PATHS, {
  ignored: /(^|[\/\\])\../,
  persistent: true,
  ignoreInitial: false
});

function checkFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const lineCount = content.split('\n').length;

    if (lineCount > LINE_LIMIT) {
      const fileName = path.basename(filePath);
      console.log(`\n\x1b[41m\x1b[37m ⚠️ ALERTA DE MONOLITO DETECTADO ⚠️ \x1b[0m`);
      console.log(`\x1b[31mO arquivo \x1b[1m${fileName}\x1b[0m ultrapassou o teto sugerido!\x1b[0m`);
      console.log(`Linhas atuais: \x1b[1m${lineCount}\x1b[0m / Limite: ${LINE_LIMIT}`);
      console.log(`Caminho: ${filePath}`);
      console.log(`\x1b[33mSugestão: Aplique o Protocolo de Refatoração de Monolitos (PRM) extraindo funções ou submódulos.\x1b[0m\n`);
    }
  } catch (error) {
    console.error(`\x1b[31m[Anti-Monolith Watcher] Erro ao analisar ${filePath}:\x1b[0m`, error.message);
  }
}

watcher
  .on('add', filePath => checkFile(filePath))
  .on('change', filePath => checkFile(filePath));
