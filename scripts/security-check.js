#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running security check for lexical-editor-easy...');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir);
  } catch (err) {
    console.log(`Failed to create logs directory: ${err.message}`);
  }
}

// Function to write debug info to log file
function writeDebugInfo(info, filename) {
  try {
    fs.writeFileSync(
      path.join(logDir, filename),
      typeof info === 'string' ? info : JSON.stringify(info, null, 2)
    );
  } catch (err) {
    console.log(`Failed to write debug info: ${err.message}`);
  }
}

// Use exec instead of execSync for better error handling
exec('npm audit --json', { encoding: 'utf8' }, (error, stdout, stderr) => {
  if (error) {
    console.log(`⚠️  Security check encountered an error: ${error.message}`);
    writeDebugInfo({ error: error.message, stderr }, 'security-check-error.json');
    
    // Try running without --json for human-readable output
    console.log('Attempting to run basic npm audit...');
    exec('npm audit', (baseError, baseStdout) => {
      if (!baseError) {
        console.log('\nSummary of security audit:');
        const summaryLines = baseStdout.split('\n')
          .filter(line => line.includes('vulnerabilities') || line.includes('severity'))
          .slice(0, 5);
        console.log(summaryLines.join('\n'));
      } else {
        console.log('Basic npm audit also failed. You may need to run it manually.');
      }
    });
    return;
  }

  if (stderr) {
    console.log(`Warning during security check: ${stderr}`);
  }

  try {
    const auditData = JSON.parse(stdout);
    
    // Write the full audit data to a log file regardless of findings
    writeDebugInfo(auditData, 'security-audit-full.json');
    
    if (auditData.vulnerabilities && Object.keys(auditData.vulnerabilities).length > 0) {
      const vulnerabilityCount = Object.keys(auditData.vulnerabilities).length;
      console.log(`\n⚠️  Found ${vulnerabilityCount} potential security issues.`);
      
      // Show summary of vulnerabilities
      const severitySummary = {};
      Object.values(auditData.vulnerabilities).forEach(vuln => {
        const severity = vuln.severity || 'unknown';
        severitySummary[severity] = (severitySummary[severity] || 0) + 1;
      });
      
      console.log('\nVulnerability Summary:');
      Object.entries(severitySummary).forEach(([severity, count]) => {
        console.log(`- ${severity}: ${count}`);
      });
      
      console.log('\nRun "npm run security-fix" to attempt to address these issues.');
    } else {
      console.log('✅ No security vulnerabilities found!');
    }
  } catch (parseError) {
    console.log(`⚠️  Could not parse npm audit output: ${parseError.message}`);
    writeDebugInfo(stdout, 'security-audit-unparseable.txt');
    console.log('The raw output was saved to logs/security-audit-unparseable.txt');
  }
});

// Log Node.js and npm versions for debugging
exec('node --version && npm --version', (error, stdout) => {
  if (!error) {
    const [nodeVersion, npmVersion] = stdout.trim().split('\n');
    console.log(`Using Node.js ${nodeVersion} and npm ${npmVersion}`);
  }
});

console.log('Security check started. This may take a moment...');
