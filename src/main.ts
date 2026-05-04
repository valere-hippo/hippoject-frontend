import { bootstrapApplication } from '@angular/platform-browser';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
import { appConfig } from './app/app.config';
import { App } from './app/app';

registerLocaleData(localeDe);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
