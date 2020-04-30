import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { VideoPlayerComponent} from './video-player/video-player.component';
import { Camera360Component } from './camera360/camera360.component';
import { HomeComponent } from './home/home.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'video', component: VideoPlayerComponent },
  { path: 'video/:videoType', component: VideoPlayerComponent, pathMatch: 'full' },
  { path: 'camera360', component: Camera360Component },
  { path: 'camera360/:videoType', component: Camera360Component, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
