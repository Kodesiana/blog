---
title: Distributed Tracing dan Logging pada Microservice📳
category: Architecture
tags: [architecture, design pattern, microservice, tips, nodejs, programming]
date: 2022-01-08
slug: distributed-tracing-logging-pada-microservice
---

_Distributed tracing_ dan _logging_ menjadi salah satu kewajiban saat kita membuat aplikasi khususnya _backend_ yang menggunakan arsitektur _microservice_. Kenapa kita perlu _distributed tracind/logging_? Apa manfaatnya, dan bagaimana cara kita mengintegrasikan layanan _distributed tracing/logging?_

## Apa itu Distributed Tracing/Logging?

Distributed tracing dan logging merupakan metode yang digunakan untuk melakukan pelacakan dan pencatatan kejadian/_event_ pada suatu aplikasi terdistribusi, melalui proses yang disebut instrumentasi/_instrumentation_ yang bertujuan untuk menghasilkan agregasi _log_ yang bisa menampikan keseluruhan proses yang terjadi pada sistem [1].

![](https://media.giphy.com/media/aZ3LDBs1ExsE8/giphy.gif)

Yap, definisinya memang agak panjang, tapi tenang karena implementasinya mudah ko😁

Agar lebih mudah dipahami, kita akan coba ambil studi kasus dari sebuah microservice sebagai berikut.

1. Service Order, bertugas untuk membuat order baru saat user melakukan _checkout_.
2. Service Catalogue, bertugas untuk mencatat jumlah barang yang tersedia di gudang.
3. Service Basket, bertugas untuk menyimpan keranjang barang yang akan di _checkout_.
4. Service Notification, bertugas untuk mengirim notifikasi jika barang sudah berhasil di _checkout_.

Nah dari empat service di atas, misalnya ada sesorang yang ingin melakukan _checkout_. Maka prosesnya bisa kita buat seperti ini:

1. Frontend melakukan request ke service Order untuk melakukan _checkout_.
2. Service Order melakukan request ke service Basket dan Catalogue untuk mendapatkan keranjang belanja user dan cek ketersediaan barang.
3. Service Order menyimpan order tersebut dan mem-_publish event_ melalui _broker_ bahwa order berhasil dilakukan.
4. Service Catalogue akan mengurangi jumlah stok, service Basket akan mengosongkan keranjang, dan service Notification akan mengirimkan notifikasi ke user.

![](https://media.giphy.com/media/3o751YUaBEePF6VMJy/giphy.gif)

_Best case scenario_, semua proses di atas akan terjadi tanpa adanya _error_ atau _race conditions_. Tapi bagaimana jika suatu saat, terjadi _error_ misalnya,

- Sistem tidak bisa menemukan keranjang user
- Sistem tidak bisa menemukan data barang yang akan di-_checkout_
- Sistem tidak mengurangi stok saat order dibuat
- Notifikasi tidak dikirimkan ke user setelah _checkout_ selesai.

Nah sekarang bagaimana cara kita untuk melakukan _debugging_ jika salah satu dari masalah di atas terjadi? Salah satu cara yang langsung terpikirkan oleh kita adalah melihat _log_, bisa dari _console stdout_ atau dari file _log_. Sebelum kita membuka log, kita mungkin sadar, "gimana cara ngecek log nya? ini udah ketumpuk jauh sama transaksi lain😥"

Arsitektur _microservice_ biasanya dipilih karena lebih _maintainable_ dan _performant_, tetapi seperti yang teman-teman lihat pada kasus di atas, menggunakan arsitektur _microservice_ juga memiliki downside yaitu sulit untuk melakukan _debugging_ ketika terjadi _error_, khususnya di _production_.

Nah disinilah _distributed tracing/logging_ berperan untuk membantu kita untuk melakukan pelacakan dan pencatatan yang bisa mengkorelasikan tidak hanya log dari satu service, tapi semua service yang terlibat pada sebuah _request_. Keren ya?

> Oh iya, _tracing_ dan _logging_ merupakan salah satu bagian dari sifat **observability** pada _microservice_! Apa itu _observability?_ penulis akan bahas di artikel yang akan datang, stay tuned ya!😁

## Distributed Tracing/Logging menggunakan Elastic Stack

Setelah kita mempelajari apa saja manfaat yang bisa kita dapatkan dengan mengimplementasikan _distributed tracing/logging_, sekarang kita akan coba mengimplementasikan _distributed tracing/logging_ menggunakan Elastic Stack (Elasticsearch, Kibana, dan Elastic APM). Sebelumnya perlu diketahui bahwa layanan _observability_ seperti ini tidak hanya disediakan oleh Elastic, tapi masih banyak _tools_ lain seperti Zipkin, Datadog, Prometheus, Grafana, dan _tools_ yang bisa digunakan untuk _distributed tracing/logging_.

![](https://media.giphy.com/media/3o7bu2AvAH25xeV4rK/giphy.gif)

Untuk memudahkan proses uji coba, kita akan menggunakan studi kasus di atas yang sudah kita bahas dan penulis akan menggunakan NodeJS untuk membuat service-nya. Selain itu, penulis akan menggunakan Docker Compose untuk mempermudah proses _deployment_ service backend dan Elastic Stack-nya. Ditambah, penulis juga akan menggunakan RabbitMQ sebagai _message broker_. Kamu bisa lihat kodenya pada [repositori ini](https://github.com/Kodesiana/Artikel/tree/master/2022/distributed-logging-tracing).

> Kalau kamu tidak tahu apa itu Docker Compose, cek artikel [Yuk Belajar Docker Container!🐳 Chapter 5](https://www.kodesiana.com/post/yuk-belajar-docker-container-chapter-3-4-5/#chapter-5---docker-compose)

Clone [repositori ini](https://github.com/Kodesiana/Artikel) kemudian masuk ke direktori `2022/distributed-logging-tracing`. Selanjutnya ketikkan `docker-compose up --build`. Tunggu beberapa saat hingga semua status container dalam kondisi _running_.

Nah sekarang kamu sudah punya satu ekosistem _microservice_ yang dapat berkomunikasi melalui REST API dan juga _message broker_. Sebelum lanjut, kita perlu kenali dulu _sequence diagram_ dari sistem kita.

1. Frontend hit API `POST http://localhost:3003/create-order/my-order1`
2. `order-service` akan cek keranjang melalui hit API `GET http://basket_service:3001/basket/my-order1`
3. `order-service` akan cek stok melalui hit API `GET http://catalogue_service:3002/catalogue/my-order1`
4. `order-service` akan menyimpan order dan mem-_publish event_ bahwa order telah berhasil dibuat
5. Secara paralel, `catalogue-service` akan mengurangi jumlah stok barang, `basket-service` akan mengosongkan keranjang belanja user, dan `notification-service` akan mengirim notifikasi ke user
6. Proses order selesai

> Proses di atas merupakan gambaran saja, sampel aplikasi tidak benar-benar melakukan penyimpanan data dan mengirim notifikasi karena tujuan dari contoh ini adalah _tracing/logging_.

Untuk mencoba proses di atas, kita bisa menggunakan Postman atau `curl -Liv -X POST http://localhost:3003/create-order/my-order1`.

Setelah kamu mengirim _request_ ke service order, kamu bisa buka Kibana (http://localhost:5601) untuk melihat data _tracing/logging_. Kamu bisa menggunakan username `elastic` dan password `password` untuk masuk ke Kibana.

Klik _hamburger menu_, kemudian cari **Observability > APM**.

> Klik pada gambar untuk memperbesar.

![](https://blob.kodesiana.com/kodesiana-public-assets/posts/2022/1/apm-services.png)

Pada menu ini, kita bisa melihat services yang aktif pada cluster kita. Karena kita membuat _request_ ke service order, klik pada `order-service`.

![](https://blob.kodesiana.com/kodesiana-public-assets/posts/2022/1/apm-transactions.png)

Pada halaman ini kamu bisa melihat aktivitas service dan _metrics_-nya, seperti _latency, throughput_, dan _depdendencies_. Di sini kamu bisa lihat berapa lama waktu yang dibutuhkan oleh _service_ untuk melayani _request_, apa saja dependensi yang digunakan oleh _service_, dan berapa banyak _instance_ dari service kita yang aktif.

> Pembahasan lebih lanjut mengenai Elastic APM akan dibahas pada artikel yang akan datang!

Saat ini kita tertarik untuk melihat _trace_ dari _request_ ke `<order-service>/create-order/:name`, oleh karena itu, kita klik link tersebut pada tabel **Transactions**.

Pada bagian atas halaman akan muncul beberapa grafik yang berisi metrik dan filter, tapi yang kita ingin cari adalah _trace sample_. _Scroll_ ke bawah hingga menemukan bagian di bawah ini.

![](https://blob.kodesiana.com/kodesiana-public-assets/posts/2022/1/apm-trace.png)

Nah pada diagram Gantt di atas kita bisa lihat, ketika kita hit API `/create-order/my-order1`, service order melalukan hit API ke service `basket` dan `catalogue`. Selain itu, jika kita klik menu **Investigate > Trace logs**, kita akan mendapatkan _log_ dari semua service secara berurutan yang dihasilkan ketika kita hit API tersebut.

![](https://blob.kodesiana.com/kodesiana-public-assets/posts/2022/1/apm-logs.png)

**WOW**😯 semua log yang dihasilkan semua service kita bisa muncul dalam satu tempat! Sekarang ketika kita ingin melakukan _debugging_ atau melacak suatu _bug_ pada _production_, kita tidak perlu repot mencari _log_ dari banyak service dan mencocokan waktu atau ID, kita cukup mencari dari menu Elastic APM saja!

Kamu bisa lihat pada _log_ di atas, tidak nya _request_ melalui REST yang masuk ke _log_, tapi proses dari _event broker_ juga ikut masuk. _Log_ dari _event broker_ ini tidak akan langsung bisa kamu dapatkan, tetapi harus melalui pengaturan khusus.

Jadi, bagaimana cara kita services kita bisa mengirimkan data ke Elastic APM beserta dengan fitur _distributed tracing/logging?_

### Implementasi menggunakan NodeJS

Teman-teman bisa cek repositori dari sampel kode ini ya! Penulis akan bahas sepintas saja melalui potongan-potongan kode yang dikutip dari repositori.

> Penulis anggap teman-teman sudah memiliki pengetahuan dasar mengenai NodeJS dan packages.json, jadi kita bisa langsung bahas kode😄

Pada awalnya, kita perlu mengaktifkan agen APM pada aplikasi kita melalui kode berikut.

```js
const config = require('./config');
const apm = require('elastic-apm-node');

// start Elastic APM
apm.start({
  cloudProvider: 'none',
  serviceName: config.serviceName,
  serverUrl: config.apmServer,
});
```

`serviceName` merupakan nama service dan `apmServer` merupakan URL ke Elastic APM server. Karena kita menggunakan Docker Compose, URL nya akan menjadi `http://apm:8200` (cek file `config.js`).

Selanjutnyam, kita perlu menyiapkan _logging_ ke Elasticsearch. Untuk keperluan ini kita akan menggunakan _library_ `winston` dan `winston-elasticsearch`. Kode ini terdapat pada file `logger.js`

```js
const apm = require('elastic-apm-node');
const winston = require('winston');
const { ElasticsearchTransport, ElasticsearchTransformer } = require('winston-elasticsearch');
const config = require('./config');

// setup winston logger to ES & APM correlations
const logger = winston.createLogger({
  exitOnError: false,
  level: 'debug',
  transports: [
    new winston.transports.Console(),
    new ElasticsearchTransport({
      // we can import apm because it has been initialized beforehand
      apm: apm,
      indexPrefix: config.indexPrefix,
      clientOpts: config.esOptions,
      transformer: (logData) => {
        const transformed = ElasticsearchTransformer(logData);

        // inject service name
        transformed.service_name = config.serviceName;

        return transformed;
      },
    }),
  ],
});

module.exports = logger;
```

Pada kode di atas kita akan membuat sebuah `object` untuk _logging_ menggunakan `winston`, kemudian kita akan memasangkan _transport_ `ElasticsearchTransport` untuk meneruskan _log_ ke Elasticsearch. Untuk mengaktifkan _log correlations_ (menyambungkan _log_ dan _trace_), kita perlu meng-_inject_ objek `apm` ke dalam _transport_. Selain itu, kita juga perlu setting pengaturan Elasticsearch (`clientOpts`) dan meng-_inject_ nama service kita ke dalam _transport_ agar nantinya nama service muncul pada log.

Selesai! Dua proses di atas merupakan setting minimum untuk mengaktifkan _distributed tracing/logging_ dengan _log correlations_. Tapi kita masih kekurangan satu komponen, yaitu _handler_ untuk _event broker_ kita. _Out-of-the-box_, `elastic-apm-node` tidak support untuk melakukan _tracing_ dari RabbitMQ (atau medium _custom_ lain seperti Kafka) dan kita perlu setting sendiri.

Untuk merekam dan mengaktifkan _log correlations_ antar service melalui _event broker_, kita perlu membuat _custom transaction_. Intinya adalah kita perlu mengirimkan _transaction ID_ dari induk _request_ ke semua turunan _request_ yang ikut terlibat.

Contoh pada [order-app.js](https://github.com/Kodesiana/Artikel/blob/master/2022/distributed-logging-tracing/backend-service/order-app.js)

```js
channel.publish('order-confirmed', '', message, {
  headers: { 'x-elastic-apm-traceparent': apm.currentTraceparent },
});
```

Pada contoh di atas penulis menggunakan fitur _headers_ pada RabbitMQ untuk mengirimkan `currentTraceparent` yang berisi informasi _trace_ dari _request_ induk. Selanjutnya, bagian _consumer_ harus ikut menyertakan _trace parent_ ini agar proses pada _consumer_ dapat terdeteksi sebagai satu-kesatuan.

Contoh pada [notification-app.js](https://github.com/Kodesiana/Artikel/blob/master/2022/distributed-logging-tracing/backend-service/notification-app.js)

```js
await channel.consume(queue.queue, (msg) => {
  const apmTransaction = apm.startTransaction(config.exhangeName, 'rabbitmq', {
    childOf: msg.properties.headers['x-elastic-apm-traceparent'],
  });

  logger.info(`Received order-confirmed message: ${msg.content.toString()}`);
  logger.info('Notification sent to users.');

  apmTransaction.end();
});
```

Pada bagian _consumer_, kita perlu memanggil `startTransaction` untuk menandai transaksi baru (proses mengeksekusi kode baru, bukan _transaksi_ dalam artian bisnis) dan kita perlu meng-_inject_ _trace parent_ yang sudah kita kirim ke dalam transaksi ini.

Pada akhir _handler_, kita harus panggil `end` untuk menandakan bahwa kita telah selesai melakukan transaksi atau proses _handling/consuming_.

## Penutup

Wuhuu, pusing ya🤢

![](https://media.giphy.com/media/4JVTF9zR9BicshFAb7/giphy.gif)

Kali ini kita sudah membahas mengenai _distributed tracing/logging_ pada _microservice_, mulai dari masalah yang kita hadapi ketika melakukan _debugging_ aplikasi _microservice_, menganalisis studi kasus, hingga mengimplementasikan _distributed tracing/logging_ menggunakan Elastic Stack.

Tidak dapat dipungkiri bahwa teknologi akan selalu berkembang dan semakin banyak teknik-teknik yang perlu dikuasai oleh _developer_ agar dapat menghadirkan solusi yang optimal bagi bisnis dan juga memudahkan _developer_ untuk menjaga kualitas aplikasi yang optimal.

Semoga sharing penulis kali ini dapat bermanfaat ya! Oh iya, masih ada banyak sekali _desgin pattern_ dan _principles_ yang ingin penulis share dengan teman-teman, bahkan pada artikel ini kita tidak hanya belajar mengenai _distrbuted logging/tracing_, tapi kita juga sudah sedikit belajar mengenai _Application Performance Management (APM)_.

Penulis akan coba membuat seri artikel ini menjadi lebih rutin dan membahas _cutting edge technology_ yang bisa teman-teman implementasikan untuk men-_deliver_ produk yang lebih oke tentunya!😁

Terima kasih!

## Referensi

1. Richardson, Chris. 2021. Pattern: Distributed tracing (https://microservices.io/patterns/observability/distributed-tracing.html). Diakses 02 Januari 2022.
2. Elastic. 2022. Distributed tracing (https://www.elastic.co/guide/en/apm/get-started/current/distributed-tracing.html). Diakses 02 Januari 2022.
3. Hoppe, Thomas. 2021. winston-elasticsearch (https://www.npmjs.com/package/winston-elasticsearch). Diakses 02 Januari 2022.
4. RabbitMQ. 2022. Publish/Subscribe (https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html). Diakses 02 Januari 2022.
