import { Component, OnInit } from '@angular/core';
declare  var Kaleidoscope:  any;

@Component({
  selector: 'app-camera360',
  templateUrl: './camera360.component.html',
  styleUrls: ['./camera360.component.scss']
})
export class Camera360Component implements OnInit {

  viewer1: any;
  viewer2: any;
  viewer3: any;
  viewer4: any;

  constructor() { }

  ngOnInit(): void {
    // setTimeout(()=>{
    //   this.start1();
    //   this.start2();
    //   this.start3();
    //   this.start4();
    // }, 3000)
  }
  startAll() {
      this.start1();
      this.start2();
      this.start3();
      this.start4();
  }

  start1() {
    var containerSelector = '#container360-1';
     this.viewer1 = new Kaleidoscope.Video({
         source: '../../assets/videos/cool.mp4',// './assets/cool.mp4',
         containerId: containerSelector,
         height: window.innerHeight,
         width: window.innerWidth
     });
     this.viewer1.render();
     window.onresize = this.viewer1.setSize({height: window.innerHeight, width: window.innerWidth});

     document.querySelector(containerSelector).addEventListener('touchend', this.viewer1.play.bind(this.viewer1));
     
     document.querySelector(containerSelector)
     .addEventListener('touchend', () => this.viewer1.play(this.viewer1));


    //  document.body.addEventListener('click', function() {
    //      this.viewer.play();
    //  }.bind(this));
  }
  start2() {
    var containerSelector = '#container360-2';
     this.viewer2 = new Kaleidoscope.Video({
         source: '../../assets/videos/cool.mp4',// './assets/cool.mp4',
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
        source: '../../assets/videos/cool.mp4',// './assets/cool.mp4',
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
        source: '../../assets/videos/cool.mp4',// './assets/cool.mp4',
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
