import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { merge, delay } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

declare var Kaleidoscope: any;

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent implements OnInit {
  // For the view change
  public shakeStart: boolean = false;
  public buttonStart: boolean = false;
  public allStart: boolean = false;

  // Video source from local
  public videoSources = [
    {
      url: './assets/videos/ferrari-1m30s.mp4',
      size: '4.8MB',
      length: '1:30',
    },
    {
      url: './assets/videos/equi.mp4',
      title: 'Canvas',
      size: '10.1MB',
      length: '1:26',
    },
    {
      url: './assets/videos/ClashofClans.mp4',
      title: 'Apartment',
      size: '17.4MB',
      length: '1:23',
    },
    {
      url: './assets/videos/newyork-15min.mp4',
      title: 'New York',
      size: '72MB',
      length: '14:42',
    },
  ];
  //For change the currentVideo
  public currentView: number = 0;
  public nextVideo: number = 1;

  //shake related ones
  public compatible = true;
  public displayX = 0;
  public displayY = 0;
  public displayZ = 0;
  public shaked$: Observable<boolean> = of(false);
  public lastShake = {
    lastTime: new Date(),
    lastX: null,
    lastY: null,
    lastZ: null,
  };
  private options = {
    threshold: 15, // default velocity threshold for shake to register
    timeout: 1000, // default interval between events
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
  shakeVideo: Boolean = false;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      console.log('params', params.get('videoType'));
      if (params.get('videoType') === 'shakeStart') {
        this.shakeStart = true;
      } else if (params.get('videoType') === 'buttonStart') {
        this.buttonStart = true;
      } else if (params.get('videoType') === 'allStart') {
        this.allStart = true;
        this.startAllShaked();
      }
      console.log('shake', this.shakeStart);
      console.log('button', this.buttonStart);
      console.log('all', this.allStart);
      //this.name = params['name'];
    });

    this.shaked$ = of(false).pipe(delay(this.options.timeout * 10)); //.pipe(merge(of(false)));
    this.Shaked.subscribe((event) => {
      this.shaked$ = of(true).pipe(
        merge(of(false).pipe(delay(this.options.timeout * 3)))
      );
    });
    this.compatible = this.checkCompatibility();
  }
  public checkCompatibility() {
    return !!('DeviceMotionEvent' in window);
  }
  @HostListener('window:devicemotion', ['$event']) handleMotion(
    event: DeviceMotionEvent
  ) {
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

    if (
      this.lastShake.lastX === null &&
      this.lastShake.lastY === null &&
      this.lastShake.lastZ === null
    ) {
      this.lastShake.lastX = current.x;
      this.lastShake.lastY = current.y;
      this.lastShake.lastZ = current.z;
      return;
    }

    deltaX = Math.abs(this.lastShake.lastX - current.x);
    deltaY = Math.abs(this.lastShake.lastY - current.y);
    deltaZ = Math.abs(this.lastShake.lastZ - current.z);

    if (
      (deltaX > this.options.threshold && deltaY > this.options.threshold) ||
      (deltaX > this.options.threshold && deltaZ > this.options.threshold) ||
      (deltaY > this.options.threshold && deltaZ > this.options.threshold)
    ) {
      // calculate time in milliseconds since last shake registered
      currentTime = new Date();
      timeDifference =
        currentTime.getTime() - this.lastShake.lastTime.getTime();

      if (timeDifference > this.options.timeout) {
        this.observer.next(e);
        this.startAllShaked();
        if (this.currentView === 4) {
          this.currentView = 0;
        }
        this.currentView = this.currentView + 1;
        this.displayNext(this.nextVideo);
        console.log('現在のビデオ：', this.currentView);
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
      //      this.currentView = this.currentView;
      this.displayNext(this.nextVideo);
      this.started = true;
    } else {
      return;
    }
  }
  startAllShaked() {
    if (!this.started) {
      this.start1();
      this.start2();
      this.start3();
      this.start4();
      this.shakeVideo = true;
      this.displayNext(this.nextVideo);
      this.started = true;
    } else {
      return;
    }
  }
  displayNext(current: Number) {
    if (current === 1) {
      this.viewer1.play();
      this.viewer2.pause();
      this.viewer3.pause();
      this.viewer4.pause();
      this.show1 = true;
      this.show2 = false;
      this.show3 = false;
      this.show4 = false;
      this.nextVideo = 2;
      console.log('Now 1');
    } else if (current === 2) {
      this.viewer2.play();
      this.viewer1.pause();
      this.viewer3.pause();
      this.viewer4.pause();
      this.show1 = false;
      this.show2 = true;
      this.show3 = false;
      this.show4 = false;
      this.nextVideo = 3;
      console.log('Now 2');
    } else if (current === 3) {
      this.viewer3.play();
      this.viewer2.pause();
      this.viewer1.pause();
      this.viewer4.pause();
      this.show1 = false;
      this.show2 = false;
      this.show3 = true;
      this.show4 = false;
      this.nextVideo = 4;
      console.log('Now 3');
    } else if (current === 4) {
      this.viewer4.play();
      this.viewer2.pause();
      this.viewer3.pause();
      this.viewer1.pause();
      this.show1 = false;
      this.show2 = false;
      this.show3 = false;
      this.show4 = true;
      this.nextVideo = 1;
      console.log('Now 4');
    }
  }

  start1() {
    var containerSelector = '#container360-1';
    this.viewer1 = new Kaleidoscope.Video({
      source: this.shakeStart
        ? this.videoSources[0].url
        : this.videoSources[0].url,
      containerId: containerSelector,
      height: window.innerHeight,
      width: window.innerWidth,
      loop: true,
    });
    this.viewer1.render();
    window.onresize = this.viewer1.setSize({
      height: window.innerHeight,
      width: window.innerWidth,
    });

    document
      .querySelector(containerSelector)
      .addEventListener('touchend', this.viewer1.play.bind(this.viewer1));

    document
      .querySelector(containerSelector)
      .addEventListener('touchend', () => this.viewer1.play(this.viewer1));

    this.viewer1.pause();
  }
  start2() {
    var containerSelector = '#container360-2';
    this.viewer2 = new Kaleidoscope.Video({
      source: this.videoSources[1].url,
      containerId: containerSelector,
      height: window.innerHeight,
      width: window.innerWidth,
      loop: true,
    });
    this.viewer2.render();
    window.onresize = this.viewer2.setSize({
      height: window.innerHeight,
      width: window.innerWidth,
    });

    document
      .querySelector(containerSelector)
      .addEventListener('touchend', () => this.viewer2.play(this.viewer2));

    this.viewer2.pause();
  }
  start3() {
    var containerSelector = '#container360-3';
    this.viewer3 = new Kaleidoscope.Video({
      source: this.shakeStart
        ? this.videoSources[0].url
        : this.videoSources[2].url,
      containerId: containerSelector,
      height: window.innerHeight,
      width: window.innerWidth,
      loop: true,
    });
    this.viewer3.render();
    window.onresize = this.viewer3.setSize({
      height: window.innerHeight,
      width: window.innerWidth,
    });

    document
      .querySelector(containerSelector)
      .addEventListener('touchend', () => this.viewer3.play(this.viewer3));
    this.viewer3.pause();
    this.viewer3.muted = true;
  }

  start4() {
    var containerSelector = '#container360-4';
    this.viewer4 = new Kaleidoscope.Video({
      source: this.shakeStart
        ? this.videoSources[0].url
        : this.videoSources[3].url,
      containerId: containerSelector,
      height: window.innerHeight,
      width: window.innerWidth,
      loop: true,
    });
    this.viewer4.render();
    window.onresize = this.viewer4.setSize({
      height: window.innerHeight,
      width: window.innerWidth,
    });

    document
      .querySelector(containerSelector)
      .addEventListener('touchend', () => this.viewer4.play(this.viewer4));

    this.viewer4.pause();
  }
  startAllStreams() {}
}
