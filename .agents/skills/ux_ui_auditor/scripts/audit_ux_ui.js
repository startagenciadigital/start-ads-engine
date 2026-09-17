/**
 * START ADS ENGINE - Script de Auditoria UX/UI
 * Analisa as interfaces em public/ verificando conformidade com o design system Dark/SaaS.
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../../../../public');

const TARGET_FILES = [
  path.join(PUBLIC_DIR, 'index.html'),
  path.join(PUBLIC_DIR, 'criar.html'),
  path.join(PUBLIC_DIR, 'gestor.html'),
  path.join(PUBLIC_DIR, 'cliente.html'),
  path.join(PUBLIC_DIR, 'conexoes.html'),
  path.join(PUBLIC_DIR, 'css', 'styles.css')
];

console.log('\x1b[36m====================================================\x1b[0m');
console.log('\x1b[36m🔍 [Auditoria UX/UI] Iniciando varredura das telas...\x1b[0m');
console.log('\x1b[36m====================================================\x1b[0m');

let avisos = 0;

TARGET_FILES.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;

  const fileName = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  console.log(`\n📄 Verificando: \x1b[1m${fileName}\x1b[0m (${lines.length} linhas)`);

  // 1. Checagem de rounded-none
  lines.forEach((line, idx) => {
    if (line.includes('rounded-none')) {
      console.log(`  \x1b[33m⚠️ Linha ${idx + 1}: Uso de 'rounded-none' detectado. Recomenda-se cantos suaves (rounded-lg ou rounded-xl).\x1b[0m`);
      avisos++;
    }

    // 2. Checagem de bg-white solto fora de tags de impressão
    if (line.includes('bg-white') && !line.includes('print:') && !line.includes('after:bg-white') && !line.includes('selection:')) {
      console.log(`  \x1b[33m⚠️ Linha ${idx + 1}: Uso de 'bg-white' em tema escuro. Verifique se não quebra a imersão do Dark Mode.\x1b[0m`);
      avisos++;
    }

    // 3. Checagem de inputs sem id
    if (line.includes('<input') && !line.includes('id=') && !line.includes('type="hidden"')) {
      console.log(`  \x1b[33m⚠️ Linha ${idx + 1}: Input sem atributo 'id'.\x1b[0m`);
      avisos++;
    }
  });

  if (lines.length > 500) {
    console.log(`  \x1b[35mℹ️ Nota Anti-Monolito: O arquivo possui ${lines.length} linhas (limite sugerido: 500 linhas).\x1b[0m`);
  }
});

console.log('\n\x1b[36m----------------------------------------------------\x1b[0m');
if (avisos === 0) {
  console.log('\x1b[32m✅ Auditoria concluída! 0 infrações críticas de UX/UI encontradas.\x1b[0m');
} else {
  console.log(`\x1b[33m⚠️ Auditoria finalizada com ${avisos} avisos para atenção preventiva.\x1b[0m`);
}
console.log('\x1b[36m====================================================\x1b[0m\n');
