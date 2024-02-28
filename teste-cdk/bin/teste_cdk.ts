#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TesteCdkStack } from '../lib/teste_cdk-stack';
const app = new cdk.App();
new TesteCdkStack(app, 'TesteCdkStack', {
  env: { account: '469521937231', region: 'us-east-1' },
});