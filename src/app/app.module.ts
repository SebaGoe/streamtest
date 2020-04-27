import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { Camera360Component } from './camera360/camera360.component';
import { HomeComponent } from './home/home.component';
import { MotionSensorComponent } from './motion-sensor/motion-sensor.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoPlayerComponent,
    Camera360Component,
    HomeComponent,
    MotionSensorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
