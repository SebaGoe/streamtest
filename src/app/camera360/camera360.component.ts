import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { MotionSensorService } from '../motion-sensor.service';
import { MotionSensorComponent } from '../motion-sensor/motion-sensor.component';
import { Observable, of } from 'rxjs';
import { merge, delay } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare var Kaleidoscope: any;
declare var Hls: any;

@Component({
  selector: 'app-camera360',
  templateUrl: './camera360.component.html',
  styleUrls: ['./camera360.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Camera360Component implements OnInit {
  public allTheSame: boolean = false;
  public allDifferent: boolean = false;
  public compatible = true;
  // public videoSourceAllTheSame = {
  //   video1: {
  //     url: './assets/videos/puppies1m55s.mp4',
  //     title: 'Puppies',
  //     size: '5.4MB',
  //     length: '1:55'
  //   },
  //   video2: {
  //     url: './assets/videos/puppies1m55s.mp4',
  //     title: 'Puppies',
  //     size: '5.4MB',
  //     length: '1:55'
  //   },
  //   video3: {
  //     url: './assets/videos/puppies1m55s.mp4',
  //     title: 'Puppies',
  //     size: '5.4MB',
  //     length: '1:55'
  //   },
  //   video4: {
  //     url: './assets/videos/puppies1m55s.mp4',
  //     title: 'Puppies',
  //     size: '5.4MB',
  //     length: '1:55'
  //   },
  // };
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
  public videoStreams = [
    {
      url: './assets/videos/tiger-3m36s.mp4',
      title: 'Tigers',
      size: '7.4MB',
      length: '3:36',
    },
    {
      url: './assets/videos/puppies1m55s.mp4',
      title: 'Puppies',
      size: '5.4MB',
      length: '1:55',
    },
    {
      url: './assets/videos/mecca-3m40s.mp4',
      title: 'Mecca',
      size: '10.4MB',
      length: '3:43',
    },
    {
      url: './assets/videos/ferrari-1m30s.mp4',
      size: '4.8MB',
      length: '1:30',
    },
  ];
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
      const err = 'Motion is not available in this browser.';
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
  currentWindowWidth = window.innerWidth;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('current width', this.currentWindowWidth);
    this.activatedRoute.paramMap.subscribe((params) => {
      console.log('params', params.get('videoType'));
      if (params.get('videoType') === 'allTheSame') {
        this.allTheSame = true;
      } else if (params.get('videoType') === 'allDifferent') {
        this.allDifferent = true;
      }
      console.log('same', this.allTheSame);
      console.log('diff', this.allDifferent);
      //this.name = params['name'];
    });

    // setTimeout(()=>{
    //   this.start1();
    //   this.start2();
    //   this.start3();
    //   this.start4();
    // }, 3000)
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
        this.startAll();
        // window.dispatchEvent(this.event);
        this.lastShake.lastTime = new Date();
      }
    }

    this.lastShake.lastX = current.x;
    this.lastShake.lastY = current.y;
    this.lastShake.lastZ = current.z;
  }
  ngOnDestroy() {
    this.viewer1.destroy();
    this.viewer2.destroy();
    this.viewer3.destroy();
    this.viewer4.destroy();
  }
  startAll() {
    this.start1();
    this.start2();
    this.start3();
    this.start4();
  }
  startAllStreams() {
    this.start1stream();
    this.start2stream();
    this.start3stream();
    this.start4stream();
  }

  start1stream() {
    var containerSelector = '#container360-1';
    if (Hls.isSupported()) {
      var hls = new Hls();
      var video = document.createElement('video');

      hls.loadSource('https://465b486a.ngrok.io');
      //        hls.loadSource('https://9ab3a2e3.ngrok.io/test.m3u8');
      //  hls.loadSource('https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8');
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
      this.viewer1 = new Kaleidoscope.Video({
        source: video,
        containerId: containerSelector,
        height: window.innerHeight,
        width: window.innerWidth,
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
    } else {
      alert("HLS.js doesn't work with your current browser");
    }
  }
  start2stream() {
    var containerSelector = '#container360-2';
    if (Hls.isSupported()) {
      var hls = new Hls();
      var video = document.createElement('video');

      hls.loadSource('http://localhost:8000/test.m3u8');
      //        hls.loadSource('https://9ab3a2e3.ngrok.io/test.m3u8');
      //  hls.loadSource('https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8');
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });

      this.viewer2 = new Kaleidoscope.Video({
        source: video,
        containerId: containerSelector,
        height: window.innerHeight,
        width: window.innerWidth,
      });

      this.viewer2.render();
      window.onresize = this.viewer2.setSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });

      document
        .querySelector(containerSelector)
        .addEventListener('touchend', this.viewer2.play.bind(this.viewer2));

      document
        .querySelector(containerSelector)
        .addEventListener('touchend', () => this.viewer2.play(this.viewer2));
    } else {
      alert("HLS.js doesn't work with your current browser");
    }
  }
  start3stream() {
    var containerSelector = '#container360-3';
    if (Hls.isSupported()) {
      var hls = new Hls();
      var video = document.createElement('video');

      hls.loadSource('https://465b486a.ngrok.io');
      //        hls.loadSource('https://9ab3a2e3.ngrok.io/test.m3u8');
      //  hls.loadSource('https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8');
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });

      this.viewer3 = new Kaleidoscope.Video({
        source: video,
        containerId: containerSelector,
        height: window.innerHeight,
        width: window.innerWidth,
      });

      this.viewer3.render();
      window.onresize = this.viewer3.setSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });

      document
        .querySelector(containerSelector)
        .addEventListener('touchend', this.viewer3.play.bind(this.viewer3));

      document
        .querySelector(containerSelector)
        .addEventListener('touchend', () => this.viewer3.play(this.viewer3));
    } else {
      alert("HLS.js doesn't work with your current browser");
    }
  }
  start4stream() {
    var containerSelector = '#container360-4';
    if (Hls.isSupported()) {
      var hls = new Hls();
      var video = document.createElement('video');
      hls.loadSource('https://465b486a.ngrok.io');
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });

      this.viewer4 = new Kaleidoscope.Video({
        source: video,
        containerId: containerSelector,
        height: window.innerHeight,
        width: window.innerWidth,
      });

      this.viewer4.render();
      window.onresize = this.viewer4.setSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });

      document
        .querySelector(containerSelector)
        .addEventListener('touchend', this.viewer4.play.bind(this.viewer4));

      document
        .querySelector(containerSelector)
        .addEventListener('touchend', () => this.viewer4.play(this.viewer4));
    } else {
      alert("HLS.js doesn't work with your current browser");
    }
  }

  start1() {
    var containerSelector = '#container360-1';
    this.viewer1 = new Kaleidoscope.Video({
      source: this.allTheSame
        ? this.videoSources[0].url
        : this.videoSources[0].url,
      containerId: containerSelector,
      height:
        this.currentWindowWidth < 767
          ? window.innerHeight
          : window.innerHeight / 2,
      width:
        this.currentWindowWidth < 767
          ? window.innerWidth
          : window.innerWidth / 2,
    });
    this.viewer1.render();
    window.onresize = this.viewer1.setSize({
      height:
        this.currentWindowWidth < 767
          ? window.innerHeight
          : window.innerHeight / 2,
      width:
        this.currentWindowWidth < 767
          ? window.innerWidth
          : window.innerWidth / 2,
    });

    document
      .querySelector(containerSelector)
      .addEventListener('touchend', this.viewer1.play.bind(this.viewer1));

    document
      .querySelector(containerSelector)
      .addEventListener('touchend', () => this.viewer1.play(this.viewer1));

    //  document.body.addEventListener('click', function() {
    //      this.viewer.play();
    //  }.bind(this));
  }
  start2() {
    var containerSelector = '#container360-2';
    this.viewer2 = new Kaleidoscope.Video({
      source: this.allTheSame
        ? this.videoSources[0].url
        : this.videoSources[1].url,
      containerId: containerSelector,
      height:
        this.currentWindowWidth < 767
          ? window.innerHeight
          : window.innerHeight / 2,
      width:
        this.currentWindowWidth < 767
          ? window.innerWidth
          : window.innerWidth / 2,
    });
    this.viewer2.render();
    window.onresize = this.viewer2.setSize({
      height:
        this.currentWindowWidth < 767
          ? window.innerHeight
          : window.innerHeight / 2,
      width:
        this.currentWindowWidth < 767
          ? window.innerWidth
          : window.innerWidth / 2,
    });

    document
      .querySelector(containerSelector)
      .addEventListener('touchend', () => this.viewer2.play(this.viewer2));
  }
  start3() {
    var containerSelector = '#container360-3';
    this.viewer3 = new Kaleidoscope.Video({
      source: this.allTheSame
        ? this.videoSources[0].url
        : this.videoSources[2].url,
      containerId: containerSelector,
      height:
        this.currentWindowWidth < 767
          ? window.innerHeight
          : window.innerHeight / 2,
      width:
        this.currentWindowWidth < 767
          ? window.innerWidth
          : window.innerWidth / 2,
    });
    this.viewer3.render();
    window.onresize = this.viewer3.setSize({
      height:
        this.currentWindowWidth < 767
          ? window.innerHeight
          : window.innerHeight / 2,
      width:
        this.currentWindowWidth < 767
          ? window.innerWidth
          : window.innerWidth / 2,
    });

    document
      .querySelector(containerSelector)
      .addEventListener('touchend', () => this.viewer3.play(this.viewer3));
  }

  start4() {
    var containerSelector = '#container360-4';
    this.viewer4 = new Kaleidoscope.Video({
      source: this.allTheSame
        ? this.videoSources[0].url
        : this.videoSources[3].url,
      containerId: containerSelector,
      height:
        this.currentWindowWidth < 767
          ? window.innerHeight
          : window.innerHeight / 2,
      width:
        this.currentWindowWidth < 767
          ? window.innerWidth
          : window.innerWidth / 2,
    });
    this.viewer4.render();
    window.onresize = this.viewer4.setSize({
      height:
        this.currentWindowWidth < 767
          ? window.innerHeight
          : window.innerHeight / 2,
      width:
        this.currentWindowWidth < 767
          ? window.innerWidth
          : window.innerWidth / 2,
    });

    document
      .querySelector(containerSelector)
      .addEventListener('touchend', () => this.viewer4.play(this.viewer4));
  }
}
