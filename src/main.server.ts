// src/main.server.ts
import 'zone.js/node'; // Necessário para SSR
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

/**
 * Função de bootstrap usada pelo Angular SSR (CommonEngine).
 * O server.ts irá importar esse default.
 */
const bootstrap = () => bootstrapApplication(AppComponent, appConfig);

export default bootstrap;
