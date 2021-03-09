#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DeambulandInfraStack } from '../lib/deambuland-infra-stack';

const app = new cdk.App();
new DeambulandInfraStack(app, 'DeambulandInfraStack');
