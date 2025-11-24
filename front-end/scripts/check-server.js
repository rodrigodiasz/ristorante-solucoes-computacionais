#!/usr/bin/env node

/**
 * Script para verificar se o servidor Next.js está rodando
 * antes de executar os testes do Cypress
 */

const http = require('http');

const BASE_URL = process.env.CYPRESS_BASE_URL || 'http://localhost:3333';
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000;

function checkServer(url, retries = 0) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 3000,
    }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 500) {
        console.log(`✅ Servidor está rodando em ${BASE_URL}`);
        resolve(true);
      } else {
        reject(new Error(`Servidor retornou status ${res.statusCode}`));
      }
    });

    req.on('error', (error) => {
      if (retries < MAX_RETRIES) {
        console.log(`⏳ Tentando conectar ao servidor... (${retries + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          checkServer(url, retries + 1).then(resolve).catch(reject);
        }, RETRY_DELAY);
      } else {
        console.error(`\n❌ ERRO: Servidor não está rodando em ${BASE_URL}`);
        console.error('\n📋 SOLUÇÃO:');
        console.error('1. Abra um novo terminal');
        console.error('2. Execute: npm run dev');
        console.error('3. Aguarde até ver "Ready"');
        console.error('4. Execute os testes novamente\n');
        reject(error);
      }
    });

    req.on('timeout', () => {
      req.destroy();
      if (retries < MAX_RETRIES) {
        setTimeout(() => {
          checkServer(url, retries + 1).then(resolve).catch(reject);
        }, RETRY_DELAY);
      } else {
        reject(new Error('Timeout ao conectar ao servidor'));
      }
    });

    req.end();
  });
}

checkServer(BASE_URL)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    process.exit(1);
  });

