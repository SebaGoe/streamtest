# Streamtest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


# Node

v10.16.0

# Angular
```
Angular CLI: 9.1.3
Node: 10.16.0
OS: darwin x64

Angular: 9.1.3
... animations, cli, common, compiler, compiler-cli, core, forms
... language-service, platform-browser, platform-browser-dynamic
... router, service-worker
Ivy Workspace: Yes

Package                           Version
-----------------------------------------------------------
@angular-devkit/architect         0.901.3
@angular-devkit/build-angular     0.901.3
@angular-devkit/build-optimizer   0.901.3
@angular-devkit/build-webpack     0.901.3
@angular-devkit/core              9.1.3
@angular-devkit/schematics        9.1.3
@ngtools/webpack                  9.1.3
@schematics/angular               9.1.3
@schematics/update                0.901.3
rxjs                              6.5.5
typescript                        3.8.3
webpack                           4.42.0
```

angular-cliはバージョンによってエラーが起きる場合はCLIに@angular-devkit/build-angularを合わせる：
```
Angular CLI v8.3.19 -> 0.803.19
Angular CLI v8.3.17 -> 0.803.17
Angular CLI v7.3.8 -> 0.13.8
Angular CLI v6-lts -> 0.8.9
```
ソース：　https://stackoverflow.com/questions/56393158/errors-data-path-buildersapp-shell-should-have-required-property-class

# Install/Build

```
$ npm install

$ ng build --prod

$ npm run pwa
```

# HLS Video サーバー

最初、AndroidのみでもiOSで使えるようにHLSを使用。

HLS.jsは世界でいろんなサイト実際に使われてる（Twittterなど）


FFMPEG インストール:
https://www.ffmpeg.org/

Node Media Server インストール:
https://www.npmjs.com/package/node-media-server

試しにYoutubeで"360 degree video"をダウンロードしてからFFMEGでHLSストリームに変換
https://www.4kdownload.com/products/product-videodownloader

HLSを使えるように設定を変更。リンクより引用：　https://github.com/illuspas/Node-Media-Server/issues/134

```
  http: {
    port: 8080,
    allow_origin: '*',
    mediaroot: 'C:/Users/Sam', //  例：  mediaroot: '/Users/sebastian/Desktop/Projects/nms/Node-Media-Server/media',
  },
   trans: {
    ffmpeg: '/ffmpeg/bin/ffmpeg.exe',
    tasks: [
      {
        app: 'live',
        ac: 'aac',
	vc: 'libx264',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
};
```

mediarootはPWAで以下のようにアクセスになります
```
http://localhost:8000/test.m3u8
```
# FFMPEGでHLSに変換

MP4ファイルでのサンプルを作成：
１）ターミナルでサンプルファイルのダイレクトリーに入る
２）コマンドを以下のように使ってください。例ではファイルをtest.mp4にしていますが、ファイル名にしてください。
ffmpeg -i test.mp4 -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls test.m3u8
３）test.m3u8, test01.tsなどが作成される。名前は事前に好きに変更してください。


# SSL

OpensslによってローカルのHttps通信もあり、package.jsonに設定済み。
Opensslの設定: https://medium.com/@richardr39/using-angular-cli-to-serve-over-https-locally-70dab07417c8
Win/Macでcertificate設定: https://medium.com/@rubenvermeulen/running-angular-cli-over-https-with-a-trusted-certificate-4a0d5f92747a


# HTTPS

PWAはHTTPSでないとセンサーなどが動けない
そのため、サーバーを設定してからテストなどが必要

PWAとMediaServerのHTTPSでないとデバイスでテストできないため

ngrok ダウンロード： https://ngrok.com/
新しいアカウントを名前、メール、パスワードを設置
ダッシュボードの１−３番設定したらターミナルでローンチ
```
$ ./ngrok http 8080
```
httpsのURLをブラウサーで開く（そしたらローカルじゃなくても観覧可能になる）

同じパソコンでデバイスでもAndroidデバッグできるようにするには以下のような流れで設定すれば行けます：

１）node app.sjでMedia serverをスタート

２）Port8080で ngrok スタート：$ ./ngrok http 8080

３）HTTPSアドレスをコピー、PWAのAPIもしくは直接使う（http://localhost:8080 -> https://9eada543.ngrok.io (トーネルによってアドレスが変わる)）

４）$ ng serve　でアプリをローカルでスタート ブラウザーでhttps://localhost:4200を開くことでエラーあればlocalhostを許可（SSLのセクションのようにサーティフィケートを設定してください）

５）ChromeでRemoteDeviceを選択（chrome://inspect）-> Port forwarding settingで4200を追加。詳しくはこちらでも見えます：　https://stackoverflow.com/questions/4779963/how-can-i-access-my-localhost-from-my-android-device

６）AndroidのChromeでhttps://localhost:4200 をアクセス許可する必要があるかもしれません。

７）シェクで動画スタートする


# 疑問

テストHLSストリームの元ファイルはAAC、H.264、1280 × 720で４Kではないがロードに時間がかかる
同時再生は可能でも遅いような気がするため、複数再生はおすすめできない


# PWA

詳しくはこちら：　https://web.dev/pwa-checklist/
Manifest設定でPWAとして使えるようになった。
Serivce workerなしではオフラインでアクセスできないため、プッシュ通知も使えない。
モバイルの場合：センサーが反応します。Orientationのみテスト実施(Android 9, Chrome; iOS 12.4, Safari)
デスクトップ：センサーないため、なしです。

# Orientation (Native Functions)

1年ほど前のセンサーテストプロジェクトから使ってる：https://github.com/silveridea/pwa-features
もしもこれを実施する場合はリポシトリーの説明通りで使えますがHTTPSでないとセンサーなどは反応しない。

OrientationなどをSafariで使うには設定でオンにするしかありません。その後は感知される：
https://medium.com/@firt/whats-new-on-ios-12-2-for-progressive-web-apps-75c348f8e945
Safari ー> 設定 -> モーション、オリエンテーションアクセス　オンにする

カメラやプッシュ通知も設定すれば使えるはず。


# 以前のアプリ

HLS Player (Sean Brage): https://github.com/bearguns/HLSPlayer
HLS.jsを使ったビデオプレイヤー

# HLSPlayer

HLS Player provides a real-world example of implementing [HLS](https://en.wikipedia.org/wiki/HTTP_Live_Streaming) video playback in a web application. [View the live application here.](https://hlsplayer-f71f2.firebaseapp.com/)

## Core Technologies
HLS Player is built with:

* [Angular 6](https://angular.io)
* [TypeScript](https://typescriptlang.org)
* [ngRx + RxJS](https://github.com/ngrx/platform)
* [Angular Material](https://material.angular.io)
* [HLS.js](https://github.com/video-dev/hls.js/tree/master) 

