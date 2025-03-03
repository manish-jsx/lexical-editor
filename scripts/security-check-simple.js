#!/usr/bin/env node

console.log('Running basic security check for lexical-editor-easy...');

const { spawn } = require('child_process');

// Run npm audit as a separate process without capturing output
const audit = spawn('npm', ['audit'], { 
  stdio: 'inherit', // This passes through all I/O directly
  shell: true 
});

audit.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Security check completed - no critical issues found.');
  } else {
    console.log(`\n⚠️  Security check completed with exit code ${code}.`);
    console.log('To fix issues, run: npm audit fix');
  }
});

console.log('Running npm audit...');
