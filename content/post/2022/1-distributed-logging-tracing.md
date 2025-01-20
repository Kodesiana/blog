---
title: Distributed Tracing dan Logging pada Microservice📳
categories: [Software Engineering]
tags: [architecture, design pattern, microservice, tips, nodejs, programming]
date: 2022-01-08
slug: distributed-tracing-logging-pada-microservice
---

{{< button content="Soure Code" icon="brand-github" href="https://l.kodesiana.com/legacy-distributed-logging-tracing" >}}

*Distributed tracing* dan *logging* menjadi salah satu kewajiban saat kita membuat aplikasi khususnya *backend* yang
menggunakan arsitektur *microservice*. Kenapa kita perlu *distributed tracind/logging*? Apa manfaatnya, dan bagaimana
cara kita mengintegrasikan layanan *distributed tracing/logging?*

## Apa itu Distributed Tracing/Logging?

Distributed tracing dan logging merupakan metode yang digunakan untuk melakukan pelacakan dan pencatatan
kejadian/*event* pada suatu aplikasi terdistribusi, melalui proses yang disebut instrumentasi/*instrumentation* yang
bertujuan untuk menghasilkan agregasi *log* yang bisa menampikan keseluruhan proses yang terjadi pada sistem [1].

![Gambar](https://media.giphy.com/media/aZ3LDBs1ExsE8/giphy.gif)

Yap, definisinya memang agak panjang, tapi tenang karena implementasinya mudah ko😁

Agar lebih mudah dipahami, kita akan coba ambil studi kasus dari sebuah microservice sebagai berikut.

1. Service Order, bertugas untuk membuat order baru saat user melakukan *checkout*.
2. Service Catalogue, bertugas untuk mencatat jumlah barang yang tersedia di gudang.
3. Service Basket, bertugas untuk menyimpan keranjang barang yang akan di *checkout*.
4. Service Notification, bertugas untuk mengirim notifikasi jika barang sudah berhasil di *checkout*.

Nah dari empat service di atas, misalnya ada sesorang yang ingin melakukan *checkout*. Maka prosesnya bisa kita buat
seperti ini:

1. Frontend melakukan request ke service Order untuk melakukan *checkout*.
2. Service Order melakukan request ke service Basket dan Catalogue untuk mendapatkan keranjang belanja user dan cek
   ketersediaan barang.
3. Service Order menyimpan order tersebut dan mem-*publish event* melalui *broker* bahwa order berhasil dilakukan.
4. Service Catalogue akan mengurangi jumlah stok, service Basket akan mengosongkan keranjang, dan service Notification
   akan mengirimkan notifikasi ke user.

![Gambar](https://media.giphy.com/media/3o751YUaBEePF6VMJy/giphy.gif)

*Best case scenario*, semua proses di atas akan terjadi tanpa adanya *error* atau *race conditions*. Tapi bagaimana jika
suatu saat, terjadi *error* misalnya,

- Sistem tidak bisa menemukan keranjang user
- Sistem tidak bisa menemukan data barang yang akan di-*checkout*
- Sistem tidak mengurangi stok saat order dibuat
- Notifikasi tidak dikirimkan ke user setelah *checkout* selesai.

Nah sekarang bagaimana cara kita untuk melakukan *debugging* jika salah satu dari masalah di atas terjadi? Salah satu
cara yang langsung terpikirkan oleh kita adalah melihat *log*, bisa dari *console stdout* atau dari file *log*. Sebelum
kita membuka log, kita mungkin sadar, "gimana cara ngecek log nya? ini udah ketumpuk jauh sama transaksi lain😥"

Arsitektur *microservice* biasanya dipilih karena lebih *maintainable* dan *performant*, tetapi seperti yang teman-teman
lihat pada kasus di atas, menggunakan arsitektur *microservice* juga memiliki downside yaitu sulit untuk melakukan
*debugging* ketika terjadi *error*, khususnya di *production*.

Nah disinilah *distributed tracing/logging* berperan untuk membantu kita untuk melakukan pelacakan dan pencatatan yang
bisa mengkorelasikan tidak hanya log dari satu service, tapi semua service yang terlibat pada sebuah *request*. Keren
ya?

> Oh iya, *tracing* dan *logging* merupakan salah satu bagian dari sifat **observability** pada *microservice*! Apa itu
> *observability?* penulis akan bahas di artikel yang akan datang, stay tuned ya!😁

## Distributed Tracing/Logging menggunakan Elastic Stack

Setelah kita mempelajari apa saja manfaat yang bisa kita dapatkan dengan mengimplementasikan *distributed
tracing/logging*, sekarang kita akan coba mengimplementasikan *distributed tracing/logging* menggunakan Elastic Stack
(Elasticsearch, Kibana, dan Elastic APM). Sebelumnya perlu diketahui bahwa layanan *observability* seperti ini tidak
hanya disediakan oleh Elastic, tapi masih banyak *tools* lain seperti Zipkin, Datadog, Prometheus, Grafana, dan *tools*
yang bisa digunakan untuk *distributed tracing/logging*.

![Gambar](https://media.giphy.com/media/3o7bu2AvAH25xeV4rK/giphy.gif)

Untuk memudahkan proses uji coba, kita akan menggunakan studi kasus di atas yang sudah kita bahas dan penulis akan
menggunakan NodeJS untuk membuat service-nya. Selain itu, penulis akan menggunakan Docker Compose untuk mempermudah
proses *deployment* service backend dan Elastic Stack-nya. Ditambah, penulis juga akan menggunakan RabbitMQ sebagai
*message broker*.

> Kalau kamu tidak tahu apa itu Docker Compose, cek artikel
> [Yuk Belajar Docker Container!🐳 Chapter 5](https://www.kodesiana.com/post/yuk-belajar-docker-container-chapter-3-4-5/#chapter-5---docker-compose)

Clone repositori kemudian masuk ke direktori `2022/distributed-logging-tracing`. Selanjutnya ketikkan
`docker-compose up --build`. Tunggu beberapa saat hingga semua status container dalam kondisi *running*.

Nah sekarang kamu sudah punya satu ekosistem *microservice* yang dapat berkomunikasi melalui REST API dan juga *message
broker*. Sebelum lanjut, kita perlu kenali dulu *sequence diagram* dari sistem kita.

1. Frontend hit API `POST http://localhost:3003/create-order/my-order1`
2. `order-service` akan cek keranjang melalui hit API `GET http://basket_service:3001/basket/my-order1`
3. `order-service` akan cek stok melalui hit API `GET http://catalogue_service:3002/catalogue/my-order1`
4. `order-service` akan menyimpan order dan mem-*publish event* bahwa order telah berhasil dibuat
5. Secara paralel, `catalogue-service` akan mengurangi jumlah stok barang, `basket-service` akan mengosongkan keranjang
   belanja user, dan `notification-service` akan mengirim notifikasi ke user
6. Proses order selesai

> Proses di atas merupakan gambaran saja, sampel aplikasi tidak benar-benar melakukan penyimpanan data dan mengirim
> notifikasi karena tujuan dari contoh ini adalah *tracing/logging*.

Untuk mencoba proses di atas, kita bisa menggunakan Postman atau
`curl -Liv -X POST http://localhost:3003/create-order/my-order1`.

Setelah kamu mengirim *request* ke service order, kamu bisa buka Kibana (<http://localhost:5601>) untuk melihat data
*tracing/logging*. Kamu bisa menggunakan username `elastic` dan password `password` untuk masuk ke Kibana.

Klik *hamburger menu*, kemudian cari **Observability > APM**.

> Klik pada gambar untuk memperbesar.

![Elastic APM](https://assets.kodesiana.com/posts/2022/1/apm-services.png)

Pada menu ini, kita bisa melihat services yang aktif pada cluster kita. Karena kita membuat *request* ke service order,
klik pada `order-service`.

![APM Transactions](https://assets.kodesiana.com/posts/2022/1/apm-transactions.png)

Pada halaman ini kamu bisa melihat aktivitas service dan *metrics*-nya, seperti *latency, throughput*, dan
*depdendencies*. Di sini kamu bisa lihat berapa lama waktu yang dibutuhkan oleh *service* untuk melayani *request*, apa
saja dependensi yang digunakan oleh *service*, dan berapa banyak *instance* dari service kita yang aktif.

> Pembahasan lebih lanjut mengenai Elastic APM akan dibahas pada artikel yang akan datang!

Saat ini kita tertarik untuk melihat *trace* dari *request* ke `<order-service>/create-order/:name`, oleh karena itu,
kita klik link tersebut pada tabel **Transactions**.

Pada bagian atas halaman akan muncul beberapa grafik yang berisi metrik dan filter, tapi yang kita ingin cari adalah
*trace sample*. *Scroll* ke bawah hingga menemukan bagian di bawah ini.

![APM Trace](https://assets.kodesiana.com/posts/2022/1/apm-trace.png)

Nah pada diagram Gantt di atas kita bisa lihat, ketika kita hit API `/create-order/my-order1`, service order melalukan
hit API ke service `basket` dan `catalogue`. Selain itu, jika kita klik menu **Investigate > Trace logs**, kita akan
mendapatkan *log* dari semua service secara berurutan yang dihasilkan ketika kita hit API tersebut.

![APM Logs](https://assets.kodesiana.com/posts/2022/1/apm-logs.png)

**WOW**😯 semua log yang dihasilkan semua service kita bisa muncul dalam satu tempat! Sekarang ketika kita ingin
melakukan *debugging* atau melacak suatu *bug* pada *production*, kita tidak perlu repot mencari *log* dari banyak
service dan mencocokan waktu atau ID, kita cukup mencari dari menu Elastic APM saja!

Kamu bisa lihat pada *log* di atas, tidak nya *request* melalui REST yang masuk ke *log*, tapi proses dari *event
broker* juga ikut masuk. *Log* dari *event broker* ini tidak akan langsung bisa kamu dapatkan, tetapi harus melalui
pengaturan khusus.

Jadi, bagaimana cara kita services kita bisa mengirimkan data ke Elastic APM beserta dengan fitur *distributed
tracing/logging?*

### Implementasi menggunakan NodeJS

Teman-teman bisa cek repositori dari sampel kode ini ya! Penulis akan bahas sepintas saja melalui potongan-potongan kode
yang dikutip dari repositori.

> Penulis anggap teman-teman sudah memiliki pengetahuan dasar mengenai NodeJS dan packages.json, jadi kita bisa langsung
> bahas kode😄

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

`serviceName` merupakan nama service dan `apmServer` merupakan URL ke Elastic APM server. Karena kita menggunakan Docker
Compose, URL nya akan menjadi `http://apm:8200` (cek file `config.js`).

Selanjutnyam, kita perlu menyiapkan *logging* ke Elasticsearch. Untuk keperluan ini kita akan menggunakan *library*
`winston` dan `winston-elasticsearch`. Kode ini terdapat pada file `logger.js`

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

Pada kode di atas kita akan membuat sebuah `object` untuk *logging* menggunakan `winston`, kemudian kita akan
memasangkan *transport* `ElasticsearchTransport` untuk meneruskan *log* ke Elasticsearch. Untuk mengaktifkan *log
correlations* (menyambungkan *log* dan *trace*), kita perlu meng-*inject* objek `apm` ke dalam *transport*. Selain itu,
kita juga perlu setting pengaturan Elasticsearch (`clientOpts`) dan meng-*inject* nama service kita ke dalam *transport*
agar nantinya nama service muncul pada log.

Selesai! Dua proses di atas merupakan setting minimum untuk mengaktifkan *distributed tracing/logging* dengan *log
correlations*. Tapi kita masih kekurangan satu komponen, yaitu *handler* untuk *event broker* kita. *Out-of-the-box*,
`elastic-apm-node` tidak support untuk melakukan *tracing* dari RabbitMQ (atau medium *custom* lain seperti Kafka) dan
kita perlu setting sendiri.

Untuk merekam dan mengaktifkan *log correlations* antar service melalui *event broker*, kita perlu membuat *custom
transaction*. Intinya adalah kita perlu mengirimkan *transaction ID* dari induk *request* ke semua turunan *request*
yang ikut terlibat.

Contoh pada `order-app.js`

```js
channel.publish('order-confirmed', '', message, {
  headers: { 'x-elastic-apm-traceparent': apm.currentTraceparent },
});
```

Pada contoh di atas penulis menggunakan fitur *headers* pada RabbitMQ untuk mengirimkan `currentTraceparent` yang berisi
informasi *trace* dari *request* induk. Selanjutnya, bagian *consumer* harus ikut menyertakan *trace parent* ini agar
proses pada *consumer* dapat terdeteksi sebagai satu-kesatuan.

Contoh pada `notification-app.js`

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

Pada bagian *consumer*, kita perlu memanggil `startTransaction` untuk menandai transaksi baru (proses mengeksekusi kode
baru, bukan *transaksi* dalam artian bisnis) dan kita perlu meng-*inject* *trace parent* yang sudah kita kirim ke dalam
transaksi ini.

Pada akhir *handler*, kita harus panggil `end` untuk menandakan bahwa kita telah selesai melakukan transaksi atau proses
*handling/consuming*.

## Penutup

Wuhuu, pusing ya🤢

![Gamber](https://media.giphy.com/media/4JVTF9zR9BicshFAb7/giphy.gif)

Kali ini kita sudah membahas mengenai *distributed tracing/logging* pada *microservice*, mulai dari masalah yang kita
hadapi ketika melakukan *debugging* aplikasi *microservice*, menganalisis studi kasus, hingga mengimplementasikan
*distributed tracing/logging* menggunakan Elastic Stack.

Tidak dapat dipungkiri bahwa teknologi akan selalu berkembang dan semakin banyak teknik-teknik yang perlu dikuasai oleh
*developer* agar dapat menghadirkan solusi yang optimal bagi bisnis dan juga memudahkan *developer* untuk menjaga
kualitas aplikasi yang optimal.

Semoga sharing penulis kali ini dapat bermanfaat ya! Oh iya, masih ada banyak sekali *desgin pattern* dan *principles*
yang ingin penulis share dengan teman-teman, bahkan pada artikel ini kita tidak hanya belajar mengenai *distrbuted
logging/tracing*, tapi kita juga sudah sedikit belajar mengenai *Application Performance Management (APM)*.

Penulis akan coba membuat seri artikel ini menjadi lebih rutin dan membahas *cutting edge technology* yang bisa
teman-teman implementasikan untuk men-*deliver* produk yang lebih oke tentunya!😁

Terima kasih!

## Referensi

1. Richardson, Chris. 2021. [Pattern: Distributed tracing](https://microservices.io/patterns/observability/distributed-tracing.html). Diakses 02 Januari 2022.
2. Elastic. 2022. [Distributed tracing](https://www.elastic.co/guide/en/apm/get-started/current/distributed-tracing.html). Diakses 02 Januari 2022.
3. Hoppe, Thomas. 2021. [winston-elasticsearch](https://www.npmjs.com/package/winston-elasticsearch). Diakses 02 Januari 2022.
4. RabbitMQ. 2022. [Publish/Subscribe](https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html). Diakses 02 Januari 2022.
