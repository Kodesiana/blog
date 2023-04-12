---
title: Yuk Belajar Docker Container!🐳 Chapter 3, 4, 5
category: Programming
tags: [cloud, tips, programming, tutorial]
date: 2021-09-19
slug: yuk-belajar-docker-container-chapter-3-4-5
---

Docker-Halo teman-teman _developers_! Hari ini kita akan lanjut lagi latihan
kita menggunakan Docker. Bagi teman-teman yang belum mengetahui apa itu Docker,
silakan cek artikel sebelumnya mengenai Docker ya!

Pada artikel kali ini kita akan membahas mengenai bagaimana cara membuat Docker
_image_ sendiri, bagaimana cara menjalankan aplikasi kita sebagai _container_, dan
bagaimana cara menggunakan Docker Compose untuk menjalankan banyak aplikasi sekaligus.

## Chapter 3 - Building Docker Images

Seperti yang sudah kita bahas sebelumnya, untuk menjalankan suatu _container_,
kita membutuhkan _image_ yang merupakan _blueprint_ dari _container_ yang akan
kita jalankan. _Image_ ini bisa berasal dari _registry_ yang sudah ada seperti
Docker Hub atau bisa kita buat sendiri sesuai dengan kebutuhan.

Untuk membangun suatu _Docker image_, kita membutuhkan suatu definisi atau
_menifest_ yang disebut sebagai `Dockerfile`. `Dockerfile` merupakan sebuah file
teks yang berisi urutan perintah yang akan dieksekusi oleh Docker machine untuk
menjelaskan suatu _image_ atau sebuah _blueprint_ untuk membangun _image_.
`Dockerfile` disebut juga sebagai _build context_.

Contoh `Dockerfile`:

```docker
FROM alpine

RUN apk add --update gcc
RUN apk add --update redis

CMD ["redis-server"]
```

Selanjutnya, buka terminal dan jalankan perintah berikut.

```sh
docker build -t coba-redis:latest .
```

Tanda `.` berarti lokasi `Dockerfile` terdapat pada direktori yang sama dengan
_working directory_ terminal saat ini.
Voila! Sekarang teman-teman sudah mempunyai _image_ aplikasi Redis server yang
siap berjalan di atas Docker!.

### Perintah-Perintah pada Dockerfile

Nah teman-teman mungkin akan bingung dengan maksud dari Dockerfile di atas, yuk
kita pelajari apa arti dari tiap-tiap perintah di atas!

- `FROM alpine`, baris ini menyatakan _base image_ atau _image_ yang akan
  menjadi dasar untuk membuat _image_ baru kita. Kenapa kita perlu _base image?_
  Karena sering kali kita tidak mau membuat _container_ dari awal (_from
  scratch_), melainkan kita ingin menggunakan basis yang sudah ada seperti
  Alpine Linux untuk menjalankan aplikasi kita.
- `RUN apk add --update gcc`, baris ini memerintahkan Docker untuk menjalankan
  perintah `apk add --update gcc` pada _container_. Bayangkan seperti kita
  menjalankan perintah ini pada terminal di komputer kita. Pada perintah ini
  kita akan menginstall `gcc`.
- `RUN apk add --update redis`, menginstall `redis`.
- `CMD ["redis-server"]`, perintah ini menyatakan perintah apa yang akan
  dieksekusi oleh Docker saat pertama kali menjalankan _container_. Mirip
  seperti aplikasi apa yang akan dieksekusi saat _startup_. Catatan: terdapat
  dua jenis perintah pada `Dockerfile` untuk mengeksekusi perintah saat
  _container_ melakukan _startup_, yaitu `CMD` dan `ENTRYPOINT`.

### Proses Membangun Image

Nah kita sekarang sudah tau apa saja arti dari perintah-perintah di atas, tapi
kita masih belum mengetahui sebenarnya seperti apa proses pembuatan _image_ oleh
Docker. Sederhananya bisa kita buat seperti ini:

1. Docker akan mengeksekusi perintah-perintah pada `Dockerfile`
2. Setiap perintah pada `Dockerfile` akan menjadi sebuah _snapshot_ yang akan
   menyimpan kondisi _file system_ setelah mengeksekusi perintah tersebut.
3. Docker akan meyimpan semua _snapshot_ tersebut sebagai _layer_ yang nantinya
   akan digabung menjadi suatu _container_ utuh.
4. Docker akan menjakankan perintah sesuai pada `ENTRYPOINT` atau `CMD`.
5. Aplikasi akan mulai dijalankan.

Secara umum, ketika kita ingin membuat sebuah _image_, kita akan mengikuti
urutan berikut:

1. Tentukan _base image_
2. Install _dependencies_ dan _library_ yang dibutuhkan aplikasi
3. Tentukan program atau perintah apa yang akan dijalankan saat _container_ di
   mulai menggunakan perintah `ENTRYPOINT` atau `CMD`

### Image Tagging

Oke, kita sudah tau dasar-dasar mengenai Dockerfile, sekarang saatnya kita mulai
belajar mengenai _tagging_ atau _versioning_ _image_ yang sudah kita buat.
Versioning ini sangat penting untuk menjaga agar aplikasi yang kita buat dapat
kita lacak perkembangannya dan tidak salah mendistribusikan versi aplikasi.

Setiap _image_ sebaiknya memiliki tag sesuai dengan versinya, misalnya pada
contoh di atas teman-teman sudah menggunakan tag _latest_. _latest_ merupakan
salah satu tag yang umum digunakan untuk menandakan versi terbaru dari aplikasi.
Selain itu, teman-teman juga bisa menggunakan skema SemVer atau tag lain untuk
menandakan versi _image_ yang dibuat.

Contoh:

```sh
docker build -t coba-redis:latest .
docker build -t backend-saya:1.0 .
docker build -t web-react:2.3-beta .
```

### Membuat Image yang Efisien

Ketika membuat suatu _image_, ukuran akhir _image_ akan sesuai dengan ukuran
_base image_ ditambah dengan berbagai _dependencies_, _libraries_, dan file-file
yang teman-teman masukan ke dalam _image_ tersebut. Sering kali teman-temen
membuat _image_ menggunakan _base image_ yang besar atau menginstall _packages_
yang tidak diperlukan oleh aplikasi saat _runtime_ yang menyebabkan ukuran
_image_ menjadi besar.

Ada beberapa tips untuk membuat _image_ yang efisien dari segi ukuran _image_
dan juga lama waktu _build_ _image_ tersebut, beberapa diantaranya yaitu:

1. Gunakan _base image_ yang ramping, misalnya Alpine Linux.
2. Hanya install _packages_ yang diperlukan untuk _runtime_, misalnya yang
   _packages_ yang digunakan untuk melakukan _unit testing_ tidak diperlukan
   untuk _production_ sehingga bisa di hapus dari dependensi aplikasi.
3. Menggunakan teknik _multi-stage build_, teknik ini bertujuan untuk memcah
   proses pembuatan _image_ menjadi proses yang lebih panjang tapi memiliki unit
   perubahan yang lebih kecil, sehingga proses pembuatan _image_ bisa lebih
   cepat dengan menggunakan _caching_ dan mengurangi jumlah _layer_ yang tidak
   digunakan pada _image_.

## Chapter 4 - Using Docker in Real Applications

Nah kita sudah mengetahui bagaimana cara membuat sebuah _image_, tapi masih
berupa image yang berasal dari _package manager_ Linux. Bagaimana caranya kalau
kita ingin membuat _image_ dari aplikasi kita sendiri?

Pada contoh ini kita akan menggunakan NodeJS untuk mempraktikan bagaimana cara
mambuat _image_ yang berupa aplikasi _backend_ sederhana yang akan memberikan
output _Hello World_ saat kita memanggil _route default_-nya. Kita akan
menggunakan _library_ `express` untuk membuat server.

Buka terminal, kemudian buat proyek NPM baru.

```sh
npm init --yes
npm install express
```

Selanjutnya buat file `index.js` kemudian isi dengan kode berikut.

```js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World.');
});

app.listen(9000, () => {
  console.log('Listening on port 9000');
});
```

Setelah itu, buat file `Dockerfile` seperti di bawah ini.

```docker
FROM node:alpine

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["node", "index.js"]
```

Setelah itu buat file `.dockerignore` seperti di bawah ini.

```
node_modules
```

Setelah itu, jalankan perintah berikut.

```sh
docker build -t helloworld:latest .
docker run -p 9000:9000 -t helloworld:latest
```

Sekarang teman-teman bisa membuka browser kemudian membuka alamat
[http://localhost:9000](http://localhost:9000) untuk melihat server yang kita
buat menggunakan NodeJS dapat dibuka seperti aplikasi pada umumnya. Sebelum kita
lanjut dengan pembahasan lebih dalam, yuk kita pahami dulu bagaimana aplikasi
kita bisa dijalankan menggunakan Docker.

Proses ini diawali dengan membuat proyek NPM baru menggunakan perintah
`npm init`, kemudian kita membuat sebuah server sederhana menggunakan `express`.
Pada titik ini kita sudah bida menjalankan server kita menggunakan perintah
`npm start` atau `node index.js`, tetapi kita akan lakukan tahap selanjutnya
yaitu membuat `Dockerfile` untuk membuat _image_ dari aplikasi yang akan kita
jalankan.

`Dockerfile` yang kita buat berisi urutan perintah sebagai berikut:

1. Gunakan _base image_ NodeJS pada Linux Alpine.
2. Ubah _working directory_ menjadi `/usr/app`.
3. Salin file `package.json` ke _working directory_.
4. Jalankan perintah `npm install` untuk menginstall _library_ yang dibutuhkan
   oleh aplikasi kita sesuai dengan `package.json`.
5. Salin sisa file yang ada di dalam folder relatif terhadap _working directory_
   teman-teman menjalankan perintah `docker build` ke folder relatif terhadap
   _working directory_ pada _image_ (kecuali file/folder yang terdapat pada file
   `.dockerignore`).
6. Jalankan perintah `node index.js` saat _container_ dijalankan.

Teman-teman mungkin bertanya:

> Q: Kenapa kita memisahkan proses menyalin file `package.json` dan _source code_
> aplikasi kita? Akan lebih cepat kalau jadi satu proses kan?
>
> Betul perintahnya akan menjadi lebih sedikit, tapi ingat Docker akan
> menggunakan _cache_ saat membuat _image_. _Source code_ aplikasi yang kita
> buat akan lebih sering berubah daripada isi file `package.json` yang berisi
> definisi _library_ dan versi aplikasi. Dengan memisahkan dua proses ini, kita
> bisa memanfaatkan _cache_ pada Docker untuk mempercepat proses _build image_.

> Q: Kenapa menggunakan perintah `node index.js`, kenapa tidak pakai `npm start`?
>
> Hal ini disebabkan karena `npm` akan mencegah program yang kita buat dari
> menerima _OS signal_, misalnya SIGTERM dan SIGKILL. Artinya kita tidak akan
> bisa mengimplementasikan tenkik _graceful shutdown_ atau bisa menyebabkan
> aplikasi kita menggantung hingga dipaksa berhenti oleh Docker. Kita akan
> pelajari mengenai _graceful shutdown_ di artikel yang lain!

Wah tidak terasa teman-teman sekarang sudah bisa membuat _image_ dari aplikasi
sendiri menggunakan NodeJS. Proses ini sebagian besar sama apabila teman-teman
ingin membuat _image_ dari aplikasi teman-teman, pastikan _base image_,
_packages_, dan aplikasi teman-teman _support_ untuk menggunakan Docker ya!

### Advanced Multi Stage Build

Nah selain cara-cara di atas, ada cara lain lho untuk membuat _image_ yang lebih
efisien lagi! Berikut adalah contoh menggunakan _multi stage build_ yang lebih
kompleks.

Docker file ini penulis gunakan di salah satu proyek Kodesiana yang sedang dalam
tahap pengembangan😁 yaitu KF-EdgeML.

```docker
# Base image for building
FROM node:14-alpine AS build

# Change working directory
WORKDIR /app

# Update NPM
RUN npm install -g npm@7.22.0

# Copy package manifest
COPY ["package.json", "package-lock.json*", "./"]

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Build and pack app for production
RUN npm run build

# Remove devDependencies
RUN npm ci --production

# Base image for runtime
FROM node:14-slim AS runtime

# Setup default environment variables
ENV PORT=8000

# Change working directory
WORKDIR /app

# Copy built app and server script
COPY --from=build /app/bin ./bin
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Expose port
EXPOSE $PORT

# Bootstrap app
CMD ["node", "bin/serve.js"]
```

Wah ko panjang sekali ya `Dockerfile` ini? Yuk kita bahas satu persatu!

- Kita menggunakan dua _base image_, yaitu `node:14-alpine` dan `node-14:slim`.
  _Image_ Alpine akan kita gunakan untuk menginstall dan _compile_ TypeScript
  menjadi JavaScript. Dua _image_ ini dipakai karena versi Alpine memiliki lebih
  banyak _package_ bawaan seperti `npm` yang dibutuhkan untuk menjalankan
  _script_ untuk _compile source code_ aplikasi TypeScript.
- Mengupdate NPM ke versi 7.22.0, kita tentukan versi spesifik agar Docker bisa
  membuat _layer_ ini menjadi _cache_ sehingga tidak pelru mengupdate NPM terus
  menerus setiap kali _build image_.
- Menyalin `package.json` dan `package-lock.json` kemudian menginstall semua
  _library_ yang diperlukan. Di sini kita juga menyalin file `package-lock.json`
  agar versi _library_ yang kita install sama persis dengan yang kita gunakan
  pada _local machine_.
- Salin _source code_ aplikasi dan melakukan build `npm run build`.
- Menghapus _development dependency_ seperti `jest`, `babel`, dan _library_ lain
  yang tidak akan digunakan saat _production_. Hal ini penting untuk mengurangi
  file sampah yang tidak akan digunakan nantinya (`npm ci --production`).
- Membuat _image_ baru menggunakan _base image_ `node:14-slim` yang akan
  digunakan sebagai _image_ akhir untuk menjalankan aplikasi. Versi `slim` ini
  memiliki ukuran yang lebih kecil dibandingkan `alpine` tetapi tidak memiliki
  `package` tambahan seperti Alpine.
- Menyalin file-file dan `node_modules` yang sudah dibersihkan dari tahap
  _build_ sebelumnya masuk ke tahap _runtime_. Sampai di sini kita sudah
  memiliki semua file dan _library_ yang dibutuhkan oleh aplikasi kita.
- Terakhir adalah menjalankan perintah `node bin/serve.js` untuk menjalankan
  server saat _container_ dijalankan.

Trik di atas penulis gunakan untuk menghasilkan _image_ yang benar-benar hanya
berisi aplikasi dan tidak membawa _library_ dan file-file yang tidak krusial
untuk aplikasi. Dengan menggunakan tenkik di atas _image_ yang penulis buat bisa
berkurang dari 632,13 MB (Alpine) menjadi 174,1 MB! (Alpine + slim)

Tentu teman-teman harus mempertimbangkan terlebih dahulu apakah _base image_
yang akan digunakan oleh teman-teman memang bisa digunakan untuk _build_ dan
_runtime_, karena tidak semua proyek bisa menggunakan teknik ini! Be smart!

## Chapter 5 - Docker Compose

_Well done_ temen-temen! Sekarang kita sudah ada di akhir pembahasan mengenai
Docker di _Chapter 5 - Docker Compose_. Apa sih Docker Compose itu dan kenapa
kita perlu Docker Compose?

Saat kita membuat sebuah aplikasi, biasanya kita butuh aplikasi pendukung lain
agar aplikasi kita bisa berjalan, yaitu basis data. Pada contoh ini kita akan
membuat aplikasi yang akan menghitung berapa kali kita membuka halaman aplikasi
kita. Basis data yang akan kita gunakan adalah Redis, teman-teman bisa
menggunakan basis data lain jika mau.

Buka kembali file `index.js` yang sebelumnya teman-teman buat, kemudian ganti
dengan kode berikut. Jangan lupa untuk install _package_ `redis` ya!

```js
const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient({
  host: 'localhost',
  port: 6379,
});

client.set('counter', 0);

app.get('/', (req, res) => {
  client.get('counter', (err, counter) => {
    res.send('Counter: ' + counter);
    client.set('counter', parseInt(counter) + 1);
  });
});

app.get('/shutdown', (req, res) => {
  process.exit(0);
});

app.listen(4001, () => {
  console.log('Listening on port 4001');
});
```

Nah pada kode di atas kita mencoba untuk mengkoneksikan ke Redis pada
`localhost` port 6379. Kita akan lihat skenario saat kita menjalankan dua
_container_, satu untuk aplikasi kita dan satu lagi untuk Redis.

Jalankan kode berikut:

- Terminal 1: `docker run redis`
- Terminal 2: `docker build -t helloredis:latest .` dan `docker run -t helloredis:latest`

Setelah kedua _container_ berjalan, buka
[http://localhost:4001](http://localhost:4001). Pada tahap ini teman-teman akan
mendapatkan pesan _error_ pada konsol terminal 2 yang akan menampilkan pesan
koneksi yang ditolak ke server Redis. Kenapa?

Saat menjalankan dua _container_ berbeda, maka jaringan virtual Docker akan
mengisolasi kedua _container_ tersebut sehingga mereka tidak bisa saling
berkomunikasi. Salah satu cara untuk membuka koneksi antara dua _container_
melalui jaringan adalah dengan menggunakan Docker network yang bisa kita gunakan
melalui Docker Compose.

Pada folder yang sama, buat file baru `docker-compose.yml` dan isikan dengan
kode berikut.

```yaml
version: '3.2'
services:
  redis-server:
    image: redis

  web:
    build: .
    ports:
      - 4001:4001
    restart: always
```

Kemudian ubah kode pada file `index.js` sebagai berikut.

```js
const client = redis.createClient({
  host: 'redis-server',
  port: 6379,
});
```

Setelah itu, jalankan perintah `docker-compose up`. Buka
[http://localhost:4001](http://localhost:4001) dan sekarang teman-teman harusnya
bisa melihat _counter_ yang dimulai dari angka nol. Setiap kali teman-teman
me-refresh halaman tersebut, _counter_ akan terus naik.

Hmm, ko bisa?

File `docker-compose.yml` mendefinisikan _services_ atau layanan atau
_container_ apa saja yang akan kita jalankan dalam satu grup. Pada contoh ini
kita akan menjalankan _service_ Redis dan aplikasi kita. Pada _service_ Redis,
kita cukup melampirkan nama _image_, sedangkan untuk aplikasi yang akan kita
buat, kita tidak perlu menggunakan nama _image_, kita bisa menggunakan
`Dockerfile` yang kita punya sebagai pengganti _image_.

Pada bagian `host` Redis, kita set menjadi `redis-server`. Nilai ini sama
dengan nilai yang kita buat pada `docker-compose.yml`. Pada Docker Compose,
untuk mengakses _services_ lain pada satu _network_, kita bisa menggunakan
nama _service_ tersebut untuk menggantikan alamat IP dari _service_ tersebut.

Nah, sampai di sini teman-teman sudah berhasil menggunakan Docker Compose untuk
menjalankan aplikasi server dan basis data Redis. Tapi kode di atas belum dapat
kita gunakan untuk _production_ karena kita masih menggunakan `host` yang di
_hardcode_, bagaimana jika kita ingin mengganti _host_ yang berbeda pada kode kita?

### Environment Variable

Salah satu cara untuk menggunakan data dinamis pada aplikasi menggunakan
_container_ adalah melalui _environment variable_. Teman-teman pasti sudah
familiar dengan konsep ini jadi kita akan langsung lihat contoh penggunaan
_environment variable_ pada Docker Compose dan NodeJS.

`docker-compose.yml`

```yaml
version: '3.2'
services:
  redis-server:
    image: redis

  page-counter:
    build: .
    environment:
      - REDIS_HOST=redis-server
      - REDIS_PORT=6379
    ports:
      - 4001:4001
    restart: always
```

`index.js`

```js
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
```

Sekarang saat kita menjalankan Docker Compose, maka properti `host` dan `port`
yang digunakan pada aplikasi kita akan sesuai dengan _environment variable_ yang
kita set pada `docker-compose.yml`, sehingga kita tidak perlu meng-_hardcode_
`host` dan `port` ke dalam _source code_.

### Restart Policy dan Graceful Shutdown

_Restart policy_ mengatur apa yang harus dilakukan ketika _container_ pada
Docker Compose berhenti, sedangkan _graceful shutdown_ merupakan teknik untuk
"mematikan" aplikasi secara sewajarnya, artinya sebelum aplikasi berhenti,
aplikasi perlu melakukan proses pembersihan seperti menutup koneksi ke basis
data, menyimpan semua perubahan dari _user_, menghentikan server, dan lain-lain.

Terdapat empat pilihan _restart policy_ pada Docker Compose, yaitu:

- `no`, artinya _container_ yang mengalami _crash_ atau dimatikan manual
  (melalui `docker stop`) tidak akan secara otomatis dijalankan kembali.
- `always`, artinya _container_ yang mengalami _crash_ atau dimatikan manual
  akan selalu dijalankan kembali.
- `on-failure`, artinya _container_ akan dijalankan kembali apabila _exit code_
  dari proses terakhir dalam _container_ bukan nol yang menandakan suatu
  _error_. Jika _container_ dimatikan secara manual, maka _container_ tersebut
  tidak akan dijalankan kembali secara otomatis.
- `unless-stopped`, artinya _container_ akan dijalankan kembali apabila
  dimatikan secara manual, tetapi tidak akan dijalankan kembali apabila aplikasi
  memberikan _exit kode_ bukan nol (tidak akan _restart_ aplikasi meskipun
  _crash_ karena _error_).

## Referensi

1. nodepractices. 2021. Bootstrap container using node command instead of npm
   (https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/docker/bootstrap-using-node.md).
   Diakses 19 September 2021.
