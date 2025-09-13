#!/usr/bin/env node

import { runSpec } from './index';
import { TestSpec } from '@qa-builder/shared';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: qa-runner <spec-file>');
    console.log('Example: qa-runner ./examples/login-test.json');
    process.exit(1);
  }

  const specFile = args[0];
  
  if (!fs.existsSync(specFile)) {
    console.error(`Spec file not found: ${specFile}`);
    process.exit(1);
  }

  try {
    const specContent = fs.readFileSync(specFile, 'utf-8');
    const spec: TestSpec = JSON.parse(specContent);
    
    console.log(`Running test: ${spec.name}`);
    console.log(`Base URL: ${spec.baseUrl}`);
    console.log(`Steps: ${spec.steps.length}`);
    console.log('---');
    
    const result = await runSpec(spec);
    
    if (result.success) {
      console.log('✅ Test passed!');
      if (result.artifacts) {
        console.log('Artifacts saved to:', result.artifacts.screenshots[0]?.split('/').slice(0, -1).join('/'));
      }
    } else {
      console.log('❌ Test failed:', result.error);
      if (result.artifacts) {
        console.log('Error screenshot saved to:', result.artifacts.screenshots[0]);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('Error running test:', error);
    process.exit(1);
  }
}

main();
