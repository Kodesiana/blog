---
title: Yuk Belajar Docker Container!🐳 Chapter 3, 4, 5
categories: [Software Engineering]
tags: [cloud, tips, programming, tutorial]
date: 2021-09-19
slug: yuk-belajar-docker-container-chapter-3-4-5
---

Docker-Halo teman-teman *developers*! Hari ini kita akan lanjut lagi latihan kita menggunakan Docker. Bagi teman-teman
yang belum mengetahui apa itu Docker, silakan cek artikel sebelumnya mengenai Docker ya!

Pada artikel kali ini kita akan membahas mengenai bagaimana cara membuat Docker *image* sendiri, bagaimana cara
menjalankan aplikasi kita sebagai *container*, dan bagaimana cara menggunakan Docker Compose untuk menjalankan banyak
aplikasi sekaligus.

## Chapter 3 - Building Docker Images

Seperti yang sudah kita bahas sebelumnya, untuk menjalankan suatu *container*, kita membutuhkan *image* yang merupakan
*blueprint* dari *container* yang akan kita jalankan. *Image* ini bisa berasal dari *registry* yang sudah ada seperti
Docker Hub atau bisa kita buat sendiri sesuai dengan kebutuhan.

Untuk membangun suatu *Docker image*, kita membutuhkan suatu definisi atau *menifest* yang disebut sebagai `Dockerfile`.
`Dockerfile` merupakan sebuah file teks yang berisi urutan perintah yang akan dieksekusi oleh Docker machine untuk
menjelaskan suatu *image* atau sebuah *blueprint* untuk membangun *image*. `Dockerfile` disebut juga sebagai *build
context*.

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

Tanda `.` berarti lokasi `Dockerfile` terdapat pada direktori yang sama dengan *working directory* terminal saat ini.
Voila! Sekarang teman-teman sudah mempunyai *image* aplikasi Redis server yang siap berjalan di atas Docker!.

### Perintah-Perintah pada Dockerfile

Nah teman-teman mungkin akan bingung dengan maksud dari Dockerfile di atas, yuk kita pelajari apa arti dari tiap-tiap
perintah di atas!

- `FROM alpine`, baris ini menyatakan *base image* atau *image* yang akan menjadi dasar untuk membuat *image* baru kita.
  Kenapa kita perlu *base image?* Karena sering kali kita tidak mau membuat *container* dari awal (*from scratch*),
  melainkan kita ingin menggunakan basis yang sudah ada seperti Alpine Linux untuk menjalankan aplikasi kita.
- `RUN apk add --update gcc`, baris ini memerintahkan Docker untuk menjalankan perintah `apk add --update gcc` pada
  *container*. Bayangkan seperti kita menjalankan perintah ini pada terminal di komputer kita. Pada perintah ini kita
  akan menginstall `gcc`.
- `RUN apk add --update redis`, menginstall `redis`.
- `CMD ["redis-server"]`, perintah ini menyatakan perintah apa yang akan dieksekusi oleh Docker saat pertama kali
  menjalankan *container*. Mirip seperti aplikasi apa yang akan dieksekusi saat *startup*. Catatan: terdapat dua jenis
  perintah pada `Dockerfile` untuk mengeksekusi perintah saat *container* melakukan *startup*, yaitu `CMD` dan
  `ENTRYPOINT`.

### Proses Membangun Image

Nah kita sekarang sudah tau apa saja arti dari perintah-perintah di atas, tapi kita masih belum mengetahui sebenarnya
seperti apa proses pembuatan *image* oleh Docker. Sederhananya bisa kita buat seperti ini:

1. Docker akan mengeksekusi perintah-perintah pada `Dockerfile`
2. Setiap perintah pada `Dockerfile` akan menjadi sebuah *snapshot* yang akan menyimpan kondisi *file system* setelah
   mengeksekusi perintah tersebut.
3. Docker akan meyimpan semua *snapshot* tersebut sebagai *layer* yang nantinya akan digabung menjadi suatu *container*
   utuh.
4. Docker akan menjakankan perintah sesuai pada `ENTRYPOINT` atau `CMD`.
5. Aplikasi akan mulai dijalankan.

Secara umum, ketika kita ingin membuat sebuah *image*, kita akan mengikuti urutan berikut:

1. Tentukan *base image*
2. Install *dependencies* dan *library* yang dibutuhkan aplikasi
3. Tentukan program atau perintah apa yang akan dijalankan saat *container* di mulai menggunakan perintah `ENTRYPOINT`
   atau `CMD`

### Image Tagging

Oke, kita sudah tau dasar-dasar mengenai Dockerfile, sekarang saatnya kita mulai belajar mengenai *tagging* atau
*versioning* *image* yang sudah kita buat. Versioning ini sangat penting untuk menjaga agar aplikasi yang kita buat
dapat kita lacak perkembangannya dan tidak salah mendistribusikan versi aplikasi.

Setiap *image* sebaiknya memiliki tag sesuai dengan versinya, misalnya pada contoh di atas teman-teman sudah menggunakan
tag *latest*. *latest* merupakan salah satu tag yang umum digunakan untuk menandakan versi terbaru dari aplikasi. Selain
itu, teman-teman juga bisa menggunakan skema SemVer atau tag lain untuk menandakan versi *image* yang dibuat.

Contoh:

```sh
docker build -t coba-redis:latest .
docker build -t backend-saya:1.0 .
docker build -t web-react:2.3-beta .
```

### Membuat Image yang Efisien

Ketika membuat suatu *image*, ukuran akhir *image* akan sesuai dengan ukuran *base image* ditambah dengan berbagai
*dependencies*, *libraries*, dan file-file yang teman-teman masukan ke dalam *image* tersebut. Sering kali teman-temen
membuat *image* menggunakan *base image* yang besar atau menginstall *packages* yang tidak diperlukan oleh aplikasi saat
*runtime* yang menyebabkan ukuran *image* menjadi besar.

Ada beberapa tips untuk membuat *image* yang efisien dari segi ukuran *image* dan juga lama waktu *build* *image*
tersebut, beberapa diantaranya yaitu:

1. Gunakan *base image* yang ramping, misalnya Alpine Linux.
2. Hanya install *packages* yang diperlukan untuk *runtime*, misalnya yang *packages* yang digunakan untuk melakukan
   *unit testing* tidak diperlukan untuk *production* sehingga bisa di hapus dari dependensi aplikasi.
3. Menggunakan teknik *multi-stage build*, teknik ini bertujuan untuk memcah proses pembuatan *image* menjadi proses
   yang lebih panjang tapi memiliki unit perubahan yang lebih kecil, sehingga proses pembuatan *image* bisa lebih cepat
   dengan menggunakan *caching* dan mengurangi jumlah *layer* yang tidak digunakan pada *image*.

## Chapter 4 - Using Docker in Real Applications

Nah kita sudah mengetahui bagaimana cara membuat sebuah *image*, tapi masih berupa image yang berasal dari *package
manager* Linux. Bagaimana caranya kalau kita ingin membuat *image* dari aplikasi kita sendiri?

Pada contoh ini kita akan menggunakan NodeJS untuk mempraktikan bagaimana cara mambuat *image* yang berupa aplikasi
*backend* sederhana yang akan memberikan output *Hello World* saat kita memanggil *route default*-nya. Kita akan
menggunakan *library* `express` untuk membuat server.

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

```text
node_modules
```

Setelah itu, jalankan perintah berikut.

```sh
docker build -t helloworld:latest .
docker run -p 9000:9000 -t helloworld:latest
```

Sekarang teman-teman bisa membuka browser kemudian membuka alamat http://localhost:9000 untuk
melihat server yang kita buat menggunakan NodeJS dapat dibuka seperti aplikasi pada umumnya. Sebelum kita lanjut dengan
pembahasan lebih dalam, yuk kita pahami dulu bagaimana aplikasi kita bisa dijalankan menggunakan Docker.

Proses ini diawali dengan membuat proyek NPM baru menggunakan perintah `npm init`, kemudian kita membuat sebuah server
sederhana menggunakan `express`. Pada titik ini kita sudah bida menjalankan server kita menggunakan perintah `npm start`
atau `node index.js`, tetapi kita akan lakukan tahap selanjutnya yaitu membuat `Dockerfile` untuk membuat *image* dari
aplikasi yang akan kita jalankan.

`Dockerfile` yang kita buat berisi urutan perintah sebagai berikut:

1. Gunakan *base image* NodeJS pada Linux Alpine.
2. Ubah *working directory* menjadi `/usr/app`.
3. Salin file `package.json` ke *working directory*.
4. Jalankan perintah `npm install` untuk menginstall *library* yang dibutuhkan oleh aplikasi kita sesuai dengan
   `package.json`.
5. Salin sisa file yang ada di dalam folder relatif terhadap *working directory* teman-teman menjalankan perintah
   `docker build` ke folder relatif terhadap *working directory* pada *image* (kecuali file/folder yang terdapat pada
   file `.dockerignore`).
6. Jalankan perintah `node index.js` saat *container* dijalankan.

Teman-teman mungkin bertanya:

> Q: Kenapa kita memisahkan proses menyalin file `package.json` dan *source code* aplikasi kita? Akan lebih cepat kalau
> jadi satu proses kan?
>
> Betul perintahnya akan menjadi lebih sedikit, tapi ingat Docker akan menggunakan *cache* saat membuat *image*. *Source code*
> aplikasi yang kita buat akan lebih sering berubah daripada isi file `package.json` yang berisi definisi
> *library* dan versi aplikasi. Dengan memisahkan dua proses ini, kita bisa memanfaatkan *cache* pada Docker untuk
> mempercepat proses *build image*.
>
> Q: Kenapa menggunakan perintah `node index.js`, kenapa tidak pakai `npm start`?
>
> Hal ini disebabkan karena `npm` akan mencegah program yang kita buat dari menerima *OS signal*, misalnya SIGTERM dan
> SIGKILL. Artinya kita tidak akan bisa mengimplementasikan tenkik *graceful shutdown* atau bisa menyebabkan aplikasi
> kita menggantung hingga dipaksa berhenti oleh Docker. Kita akan pelajari mengenai *graceful shutdown* di artikel yang
> lain!

Wah tidak terasa teman-teman sekarang sudah bisa membuat *image* dari aplikasi sendiri menggunakan NodeJS. Proses ini
sebagian besar sama apabila teman-teman ingin membuat *image* dari aplikasi teman-teman, pastikan *base image*,
*packages*, dan aplikasi teman-teman *support* untuk menggunakan Docker ya!

### Advanced Multi Stage Build

Nah selain cara-cara di atas, ada cara lain lho untuk membuat *image* yang lebih efisien lagi! Berikut adalah contoh
menggunakan *multi stage build* yang lebih kompleks.

Docker file ini penulis gunakan di salah satu proyek Kodesiana yang sedang dalam tahap pengembangan😁 yaitu KF-EdgeML.

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

- Kita menggunakan dua *base image*, yaitu `node:14-alpine` dan `node-14:slim`. *Image* Alpine akan kita gunakan untuk
  menginstall dan *compile* TypeScript menjadi JavaScript. Dua *image* ini dipakai karena versi Alpine memiliki lebih
  banyak *package* bawaan seperti `npm` yang dibutuhkan untuk menjalankan *script* untuk *compile source code* aplikasi
  TypeScript.
- Mengupdate NPM ke versi 7.22.0, kita tentukan versi spesifik agar Docker bisa membuat *layer* ini menjadi *cache*
  sehingga tidak pelru mengupdate NPM terus menerus setiap kali *build image*.
- Menyalin `package.json` dan `package-lock.json` kemudian menginstall semua *library* yang diperlukan. Di sini kita
  juga menyalin file `package-lock.json` agar versi *library* yang kita install sama persis dengan yang kita gunakan
  pada *local machine*.
- Salin *source code* aplikasi dan melakukan build `npm run build`.
- Menghapus *development dependency* seperti `jest`, `babel`, dan *library* lain yang tidak akan digunakan saat
  *production*. Hal ini penting untuk mengurangi file sampah yang tidak akan digunakan nantinya (`npm ci --production`).
- Membuat *image* baru menggunakan *base image* `node:14-slim` yang akan digunakan sebagai *image* akhir untuk
  menjalankan aplikasi. Versi `slim` ini memiliki ukuran yang lebih kecil dibandingkan `alpine` tetapi tidak memiliki
  `package` tambahan seperti Alpine.
- Menyalin file-file dan `node_modules` yang sudah dibersihkan dari tahap *build* sebelumnya masuk ke tahap *runtime*.
  Sampai di sini kita sudah memiliki semua file dan *library* yang dibutuhkan oleh aplikasi kita.
- Terakhir adalah menjalankan perintah `node bin/serve.js` untuk menjalankan server saat *container* dijalankan.

Trik di atas penulis gunakan untuk menghasilkan *image* yang benar-benar hanya berisi aplikasi dan tidak membawa
*library* dan file-file yang tidak krusial untuk aplikasi. Dengan menggunakan tenkik di atas *image* yang penulis buat
bisa berkurang dari 632,13 MB (Alpine) menjadi 174,1 MB! (Alpine + slim)

Tentu teman-teman harus mempertimbangkan terlebih dahulu apakah *base image* yang akan digunakan oleh teman-teman memang
bisa digunakan untuk *build* dan *runtime*, karena tidak semua proyek bisa menggunakan teknik ini! Be smart!

## Chapter 5 - Docker Compose

*Well done* temen-temen! Sekarang kita sudah ada di akhir pembahasan mengenai Docker di *Chapter 5 - Docker Compose*.
Apa sih Docker Compose itu dan kenapa kita perlu Docker Compose?

Saat kita membuat sebuah aplikasi, biasanya kita butuh aplikasi pendukung lain agar aplikasi kita bisa berjalan, yaitu
basis data. Pada contoh ini kita akan membuat aplikasi yang akan menghitung berapa kali kita membuka halaman aplikasi
kita. Basis data yang akan kita gunakan adalah Redis, teman-teman bisa menggunakan basis data lain jika mau.

Buka kembali file `index.js` yang sebelumnya teman-teman buat, kemudian ganti dengan kode berikut. Jangan lupa untuk
install *package* `redis` ya!

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

Nah pada kode di atas kita mencoba untuk mengkoneksikan ke Redis pada `localhost` port 6379. Kita akan lihat skenario
saat kita menjalankan dua *container*, satu untuk aplikasi kita dan satu lagi untuk Redis.

Jalankan kode berikut:

- Terminal 1: `docker run redis`
- Terminal 2: `docker build -t helloredis:latest .` dan `docker run -t helloredis:latest`

Setelah kedua *container* berjalan, buka http://localhost:4001. Pada tahap ini teman-teman akan
mendapatkan pesan *error* pada konsol terminal 2 yang akan menampilkan pesan koneksi yang ditolak ke server Redis.
Kenapa?

Saat menjalankan dua *container* berbeda, maka jaringan virtual Docker akan mengisolasi kedua *container* tersebut
sehingga mereka tidak bisa saling berkomunikasi. Salah satu cara untuk membuka koneksi antara dua *container* melalui
jaringan adalah dengan menggunakan Docker network yang bisa kita gunakan melalui Docker Compose.

Pada folder yang sama, buat file baru `docker-compose.yml` dan isikan dengan kode berikut.

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

Setelah itu, jalankan perintah `docker-compose up`. Buka http://localhost:4001 dan sekarang
teman-teman harusnya bisa melihat *counter* yang dimulai dari angka nol. Setiap kali teman-teman me-refresh halaman
tersebut, *counter* akan terus naik.

Hmm, ko bisa?

File `docker-compose.yml` mendefinisikan *services* atau layanan atau *container* apa saja yang akan kita jalankan dalam
satu grup. Pada contoh ini kita akan menjalankan *service* Redis dan aplikasi kita. Pada *service* Redis, kita cukup
melampirkan nama *image*, sedangkan untuk aplikasi yang akan kita buat, kita tidak perlu menggunakan nama *image*, kita
bisa menggunakan `Dockerfile` yang kita punya sebagai pengganti *image*.

Pada bagian `host` Redis, kita set menjadi `redis-server`. Nilai ini sama dengan nilai yang kita buat pada
`docker-compose.yml`. Pada Docker Compose, untuk mengakses *services* lain pada satu *network*, kita bisa menggunakan
nama *service* tersebut untuk menggantikan alamat IP dari *service* tersebut.

Nah, sampai di sini teman-teman sudah berhasil menggunakan Docker Compose untuk menjalankan aplikasi server dan basis
data Redis. Tapi kode di atas belum dapat kita gunakan untuk *production* karena kita masih menggunakan `host` yang di
*hardcode*, bagaimana jika kita ingin mengganti *host* yang berbeda pada kode kita?

### Environment Variable

Salah satu cara untuk menggunakan data dinamis pada aplikasi menggunakan *container* adalah melalui *environment
variable*. Teman-teman pasti sudah familiar dengan konsep ini jadi kita akan langsung lihat contoh penggunaan
*environment variable* pada Docker Compose dan NodeJS.

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

Sekarang saat kita menjalankan Docker Compose, maka properti `host` dan `port` yang digunakan pada aplikasi kita akan
sesuai dengan *environment variable* yang kita set pada `docker-compose.yml`, sehingga kita tidak perlu meng-*hardcode*
`host` dan `port` ke dalam *source code*.

### Restart Policy dan Graceful Shutdown

*Restart policy* mengatur apa yang harus dilakukan ketika *container* pada Docker Compose berhenti, sedangkan *graceful
shutdown* merupakan teknik untuk "mematikan" aplikasi secara sewajarnya, artinya sebelum aplikasi berhenti, aplikasi
perlu melakukan proses pembersihan seperti menutup koneksi ke basis data, menyimpan semua perubahan dari *user*,
menghentikan server, dan lain-lain.

Terdapat empat pilihan *restart policy* pada Docker Compose, yaitu:

- `no`, artinya *container* yang mengalami *crash* atau dimatikan manual (melalui `docker stop`) tidak akan secara
  otomatis dijalankan kembali.
- `always`, artinya *container* yang mengalami *crash* atau dimatikan manual akan selalu dijalankan kembali.
- `on-failure`, artinya *container* akan dijalankan kembali apabila *exit code* dari proses terakhir dalam *container*
  bukan nol yang menandakan suatu *error*. Jika *container* dimatikan secara manual, maka *container* tersebut tidak
  akan dijalankan kembali secara otomatis.
- `unless-stopped`, artinya *container* akan dijalankan kembali apabila dimatikan secara manual, tetapi tidak akan
  dijalankan kembali apabila aplikasi memberikan *exit kode* bukan nol (tidak akan *restart* aplikasi meskipun *crash*
  karena *error*).

## Referensi

1. nodepractices. 2021. [Bootstrap container using node command instead of npm](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/docker/bootstrap-using-node.md). Diakses 19 September 2021.
