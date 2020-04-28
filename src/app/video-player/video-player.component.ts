import { Component, OnInit, ChangeDetectionStrategy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { merge, delay } from 'rxjs/operators';
declare  var Kaleidoscope:  any;

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoPlayerComponent implements OnInit {


  public compatible = true;
  public displayX = 0;
  public displayY = 0;
  public displayZ = 0;
  public currentView = 0;
  public shaked$: Observable<boolean> = of(false);
  public lastShake = {
    lastTime: new Date(),
    lastX: null,
    lastY: null,
    lastZ: null
  };
  private options = {
    threshold: 15, // default velocity threshold for shake to register
    timeout: 1000 // default interval between events
  };
  private observer: any;
  public Shaked = new Observable((observer: any) => {
    if (!this.checkCompatibility()) {
      const err = 'HTTPS通信でデバイスより使ってください';
      console.error(err);
      observer.error(err);
      observer.complete();
    }
    this.observer = observer;
  });
  viewer1: any;
  viewer2: any;
  viewer3: any;
  viewer4: any;
  show1: boolean = true;
  show2: boolean = true;
  show3: boolean = true;
  show4: boolean = true;

  started: Boolean = false;


  constructor() {
  }

  ngOnInit(): void {

    this.shaked$ = of(false).pipe(delay(this.options.timeout * 10));//.pipe(merge(of(false)));
    this.Shaked.subscribe(event => {
      this.shaked$ = of(true).pipe(merge(of(false).pipe(delay(this.options.timeout * 3))));
    });
    this.compatible = this.checkCompatibility();
  }
  public checkCompatibility () {
    return !!('DeviceMotionEvent' in window);
  }
  @HostListener('window:devicemotion', ['$event']) handleMotion(event: DeviceMotionEvent) {
    // https://developers.google.com/web/fundamentals/native-hardware/device-orientation/
    // https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent
    // phone facing the user

    // const accelerationIncludingGravity = event.accelerationIncludingGravity;
    // const acceleration = event.acceleration;
    // not moving = [0, 0, 0]
    // moving up = [0, 5, 0]
    // moving right = [0, 3, 0]
    // moving up and right = [5, 5, 0]

    // const rotationRate = event.rotationRate;
    // const interval = event.interval;
    this.displayX = event.acceleration.x;
    this.displayY = event.acceleration.y;
    this.displayZ = event.acceleration.z;
    this.checkShake(event);
  }
  private checkShake(e: DeviceMotionEvent) {
    const current = e.accelerationIncludingGravity;
    let currentTime;
    let timeDifference;
    let deltaX = 0;
    let deltaY = 0;
    let deltaZ = 0;

    if ((this.lastShake.lastX === null) && (this.lastShake.lastY === null) && (this.lastShake.lastZ === null)) {
      this.lastShake.lastX = current.x;
      this.lastShake.lastY = current.y;
      this.lastShake.lastZ = current.z;
      return;
    }

    deltaX = Math.abs(this.lastShake.lastX - current.x);
    deltaY = Math.abs(this.lastShake.lastY - current.y);
    deltaZ = Math.abs(this.lastShake.lastZ - current.z);

    if (((deltaX > this.options.threshold) && (deltaY > this.options.threshold)) || ((deltaX > this.options.threshold) && (deltaZ > this.options.threshold)) || ((deltaY > this.options.threshold) && (deltaZ > this.options.threshold))) {
        // calculate time in milliseconds since last shake registered
        currentTime = new Date();
        timeDifference = currentTime.getTime() - this.lastShake.lastTime.getTime();

        if (timeDifference > this.options.timeout) {
          this.observer.next(e);
          this.startAll();
          if (this.currentView === 4) {
            this.currentView = 0
          }
          this.currentView = this.currentView + 1;
          this.displayNext(this.currentView);
          console.log("現在のビデオ：", this.currentView);
          // window.dispatchEvent(this.event);
          this.lastShake.lastTime = new Date();
        }
    }

    this.lastShake.lastX = current.x;
    this.lastShake.lastY = current.y;
    this.lastShake.lastZ = current.z;
  }
  startAll() {
    if (!this.started) {
      this.start1();
      this.start2();
      this.start3();
      this.start4();
      this.currentView = this.currentView + 1;
      this.displayNext(this.currentView);
      this.started = true;
    } else {
      return;
    }
  }
  displayNext(current: Number) {
    if(current === 1) {
      this.show1 = true;
      this.show2 = false;
      this.show3 = false;
      this.show4 = false;
      console.log("Now 1");
  } else if (current === 2){
    this.show1 = false;
    this.show2 = true;
    this.show3 = false;
    this.show4 = false;
    console.log("Now 2");
  } else if (current === 3){
    this.show1 = false;
    this.show2 = false;
    this.show3 = true;
    this.show4 = false;
    console.log("Now 3");
  } else if (current === 4){
    this.show1 = false;
    this.show2 = false;
    this.show3 = false;
    this.show4 = true;
    console.log("Now 4");
  } 
    
  }

  start1() {
    var containerSelector = '#container360-1';
     this.viewer1 = new Kaleidoscope.Video({
         source: './assets/videos/equi.mp4',// もしも重いならこちらに変更で早くなるなずです。動画が短い：'./assets/videos/cool.mp4',
         containerId: containerSelector,
         height: window.innerHeight,
         width: window.innerWidth
     });
     this.viewer1.render();
     window.onresize = this.viewer1.setSize({height: window.innerHeight, width: window.innerWidth});

     document.querySelector(containerSelector).addEventListener('touchend', this.viewer1.play.bind(this.viewer1));
     
     document.querySelector(containerSelector)
     .addEventListener('touchend', () => this.viewer1.play(this.viewer1));


  }
  start2() {
    var containerSelector = '#container360-2';
     this.viewer2 = new Kaleidoscope.Video({
         source: './assets/videos/ClashofClans.mp4',// './assets/videos/cool.mp4',
         containerId: containerSelector,
         height: window.innerHeight,
         width: window.innerWidth
     });
     this.viewer2.render();
     window.onresize = this.viewer2.setSize({height: window.innerHeight, width: window.innerWidth});
     
     document.querySelector(containerSelector)
     .addEventListener('touchend', () => this.viewer2.play(this.viewer2));

  }
  start3() {
    var containerSelector = '#container360-3';
    this.viewer3 = new Kaleidoscope.Video({
        source: './assets/videos/equi.mp4',// './assets/videos/cool.mp4',
        containerId: containerSelector,
        height: window.innerHeight,
        width: window.innerWidth
    });
    this.viewer3.render();
    window.onresize = this.viewer3.setSize({height: window.innerHeight, width: window.innerWidth});

    
    document.querySelector(containerSelector)
    .addEventListener('touchend', () => this.viewer3.play(this.viewer3));

  }

  start4() {
    var containerSelector = '#container360-4';
    this.viewer4 = new Kaleidoscope.Video({
        source: './assets/videos/ClashofClans.mp4',// './assets/videos/cool.mp4',
        containerId: containerSelector,
        height: window.innerHeight,
        width: window.innerWidth
    });
    this.viewer4.render();
    window.onresize = this.viewer4.setSize({height: window.innerHeight, width: window.innerWidth});

    
    document.querySelector(containerSelector)
    .addEventListener('touchend', () => this.viewer4.play(this.viewer4));

  }
}

