#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("@aws-cdk/core");
const deambuland_infra_stack_1 = require("../lib/deambuland-infra-stack");
const app = new cdk.App();
new deambuland_infra_stack_1.DeambulandInfraStack(app, 'DeambulandInfraStack');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVhbWJ1bGFuZC1pbmZyYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlYW1idWxhbmQtaW5mcmEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsdUNBQXFDO0FBQ3JDLHFDQUFxQztBQUNyQywwRUFBcUU7QUFFckUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSw2Q0FBb0IsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IERlYW1idWxhbmRJbmZyYVN0YWNrIH0gZnJvbSAnLi4vbGliL2RlYW1idWxhbmQtaW5mcmEtc3RhY2snO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IERlYW1idWxhbmRJbmZyYVN0YWNrKGFwcCwgJ0RlYW1idWxhbmRJbmZyYVN0YWNrJyk7XG4iXX0=