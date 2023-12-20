---
title: Mengenal Jamstack dan Serverless🥧
categories: Tips
tags: [tips, internet, cloud]
date: 2021-06-03
slug: mengenal-jamstack-dan-serverless
---

Sekarang ini ada banyak *framework* untuk membuat web, mulai dari CMS yang sudah ada sejak lama seperti Wordpress,
Joomla, dan Drupal hingga *framework* baru yang mengadopsi standar web modern seperti React, Vue, Angular, Gatsby, dan
Hugo. Dengan dukungan JavaScript yang semakin luas ditambah dengan komunitasnya yang semakin besar, JavaScript saat ini
menjadi salah satu bahasa pemrograman yang banyak disukai oleh developer.

Perubahan ini mendorong berbagai *stack* dan metode baru untuk menghadirkan aplikasi yang lebih cepat dibuat, lebih
mudah dimaintain, dan memiliki performa yang lebih tinggi. Munculnya metode seperti PWA dan *hybrid apps* membuat
aplikasi web semakin fleksibel dan mendekati aplikasi *native*.

## Perkembangan Teknologi Website

Jika kita melihat kembali ke tahun 2012, sebagian besar web masih menggunakan *server-side processing/rendering (SSR)*
yang artinya proses *render* atau pembuatan tampilan web dilakukan oleh server atau *backend*. Hal ini menyebabkan web
tradisional memerlukan proses navigasi atau *refresh* sebelum dapat memunculkan data baru. Hal ini kemudian ditangani
oleh *library* AJAX jQuery dan menjadi standar yang cukup lama untuk melakukan proses asinkron (asynchronous) pada
*frontend*. Artinya user tidak perlu menunggu halaman web untuk menampilkan data baru setelah *refresh*, melainkan user
dapat tinggal di halaman tersebut dan bahkan melakukan interaksi dan navigasi tanpa perlu menunggu respon dari
*backend*.

Konsep ini sekarang sudah banyak diimplementasikan untuk meningkatkan pengalaman user yang mengunjungi website kita,
khususnya untuk menyediakan web yang tidak membutuhkan waktu lama untuk dimuat oleh user dan dapat interaktif tanpa
perlu menunggu *backend* memberikan respons, dan bahkan bisa membuat *web apps* yang bisa diakses ketika komputer dalam
kondisi *offline*.

![Gambar](https://source.unsplash.com/v9FQR4tbIq8)

Selain itu, sekarang ini banyak pula *framework* dan *tools* untuk membuat *static site* atau laman/web statis.
Berkembangnya tren website statis merupakan hasil dari perkembangan teknologi di atas dan usaha untuk meningkatkan
pengalaman user saat menggunakan website. Dengan menggunakan aset statis, website dapat sepenuhnya disimpan dalam
*cache* dan dapat lebih cepat diakses oleh user. Selain memberikan user pengalaman yang lebih menyenangkan di website
kita, sebagai perusahaan yang meng-hosting web pun mendapat keuntungan yaitu biaya komputasi server yang berkurang dan
bandwidth yang lebih sedikit ke server karena website kita bisa sepenuhnya dikirim melalui CDN.

Pola-pola desain dan arsitektur website modern seperti ini banyak dikenal sebagai **Jamstack**.

## Apa itu Jamstack?

> JAM merupakan singkatan dari JavaScript, API, & Markup.

Jika kita *breakdown*, sebuah sistem yang mengikuti Jamstack akan memiliki tiga komponen yaitu JavaScript, API, dan
Markup.

- JavaScript, bertugas untuk menangani interaksi user pada web menggunakan *library* atau *framework* apapun.
- API, operasi pada sisi server yang disajikan dalam bentuk API agar dapat digunakan oleh web melalui HTTP (misalnya
  REST).
- Markup, web bisa disajikan sebagai *static site*, misalnya membuat website dari Markdown menggunakan **Static Site
  Generator** seperti Hugo dan Jekyll.

Nah dari definisi di atas kita bisa simpulkan bahwa website modern dapat menangani interaksi user pada sisi klien tanpa
perlu di-*render* dari server, sehingga website yang dibuat menjadi lebih responsif dan interaktif.

Pada Jamstack website dibangun oleh dua komponen utama, yaitu:

- **Frontend** yang merupakan website yang dibuat interaktif seperti SPA atau PWA atau website statis yang dibuat
  menggunakan *Static Site Generator* atau dibuat sendiri dari awal. Intinya *frontend* yang dibuat terpisah dari sisi
  server dan tidak terjadi proses apapun untuk menampilkan *frontend*. Misalnya untuk menampilkan sebuah tabel, kita
  tidak lagi merender tabel tersebut pada server, melainkan *frontend* kita akan melakukan HTTP request ke API pada
  *backend* dan merender datanya pada browser untuk menampilkan isi tabelnya.
- **Backend** merupakan bagian dari sistem yang bertugas untuk memproses data dan permintaan dari *frontend*. Jika kita
  bandingkan dengan *framework* seperti Laravel dan CI, maka *backend* ini adalah bagian `Controller` pada arsitektur
  MVC. Pada Jamstack, tugas *backend* adalah memproses permintaan dari *frontend* tanpa melakukan render data yang
  diberikan. Hal ini membuat proses data lebih cepat dan memberikan fleksibilitas integrasi yang lebih luas ke sistem
  lain dan pihak ketiga.

Bisa disimpulkan, dengan menggunakan model Jamstack, kita membuat dua aplikasi yang berbeda dan tidak saling memiliki
ketergantungan. Saat kita membuat perubahan pada *frontend*, maka *backend* tidak perlu diubah karena perubahan tersebut
terisolasi pada *frontend*. Dengan demikian, proses kolaborasi dan pengembangan sistem dapat dilakukan lebih cepat.

Beberapa keuntungan menggunakan Jamstack yaitu:

1. Performa aplikasi yang lebih cepat, karena *user* bisa menggunakan web kita seperti halnya aplikasi *native* yang
   bahkan bisa di *cache* dan di *load* dalam sekejap.
2. Keamanan yang lebih tinggi karena penggunaan API sekarang tidak terikat dengan endpoint *backend* dan memiliki
   keamanan yang lebih tinggi karena aksesnya diatur oleh klien.
3. Biaya server yang lebih murah karena tidak membutuhkan banyak CPU dan RAM, kita bahkan bisa menggunakan CDN untuk
   meng-host website Jamstack. Ingat web Jamstack tidak memiliki pemrosesan pada server sehingga bisa disajikan melalui
   CDN murni.
4. Lebih mudah untuk dikembangkan oleh developer karena sekarang *frontend* tidak terikat dengan *backend*, keduanya
   bisa saling bekerja mengikuti kontrak API antara kedua sistem.

Wah ternyata banyak ya manfaat dari Jamstack! Blog Kodesiana.com juga saat ini sudah menggunakan Jamstack, lho! Sejak
awal Maret 2021 penulis mengubah website Kodesiana.com menggunakan model Jamstack menggunakan tool Hugo dan tema Fuji.
Meskipun penulis bukan *frontend developer*, menggunakan Hugo bukanlah suatu proses yang membutuhkan waktu banyak untuk
belajar, cukup ikuti tutorial dan template dan cling... web kamu bisa langsung jadi dalam lima menit.

![Gambar](https://source.unsplash.com/a-view-of-a-lake-surrounded-by-trees-and-snow-tS9s-qSzEgU)

## Apa itu Serverless?

Serverless merupakan model *cloud service* yang menyediakan jasa komputasi bagi kliennya saat dibutuhkan saja
(*on-demand*), sehingga proses komputasi yang dilakukan lebih efisien dan lebih murah. Model ini banyak digemari oleh
developer karena harganya yang ekonomis dan lebih mudah untuk dikembangkan karena sifatnya yang berdiri
sendiri/*standalone* dan tidak terikat kondisi data (*stateless*).

Misalnya kamu ingin membuat sebuah API untuk menerima isian form, daripada harus membuat *full blown backend app*
"backend beneran yang menggunakan pola MVC/CRUD lengkap dengan akses database, controller, otentikasi, dan lainnya" akan
lebih mudah kalau kamu cukup membuat sebuah API yang menerima data JSON kemudian menyimpannya ke database dengan
otentikasi Basic, tidak perlu membuat *full backend* misalnya menggunakan Laravel untuk menyimpan data dari sebuah form
saja.

### Functions dan Lambda Apps

Salah satu layanan yang ditawarkan oleh banyak penyedia jasa *cloud* adalah Functions (Azure Function) dan Lambda (AWS
Lambda), yaitu layanan untuk mengeksekusi kode tertentu tanpa perlu mengurusi arsitektur rumit dibelakangnya. Misal kita
ambil contoh API untuk menyimpan data dari form ke database.

Pada aplikasi *backend* biasa, kita mungkin akan membuat sistem seperti ini:

```text
Website -> Form POST -> Backend (Laravel/CI/ExpressJS/ASP.NET) -> Database
```

Jika kita menggunakan aplikasi *backend* biasa, kita perlu membuat *deployment* untuk merilis kode dari SCM ke *apps
service* di *cloud*, kemudian perlu membuat kode yang cukup panjang juga untuk mengikuti pola seperti MVC hingga bisa
akses ke database. Tapi jika fungsi yang digunakan hanya satu yaitu menyimpan data dari form, punya sebuah backend
khusus akan menjadi *overkill*, karena fungsi yang sederhana tadi harus running di atas server dan biayanya pun akan
sama seperti aplikasi *backend* lain yang lebih kompleks.

Dengan menggunakan layanan serverless, kita bisa buat sistem seperti ini:

```text
Website -> Form POST -> Functions -> Database
```

Skemanya masih sama, tapi perbedaan utamanya adalah pada aplikasi *stateless* dan *serverless* khususnya pada *Functions
App*, kita tidak perlu membuat kode *backend* yang panjang sebagai sebuah project, tapi kita cukup menggunakan potongan
kode yang digunakan untuk menyimpan data langsung ke database, tanpa perlu membuat kode untuk mengatur *routing* dan
proses lain pada *backend* biasa.

Selain itu, Function app yang kita buat hanya akan dikenakan biaya selama aplikasinya berjalan, artinya jika fungsi yang
kita buat tidak digunakan, maka aplikasi kita tidak dikenakan biaya. Dengan kata lain, dengan menggunakan Functions,
kita bisa menghemat waktu untuk membuat suatu API dan juga menghemat biaya penggunaan layanan *cloud*.

Nah kalau kamu punya banyak API yang bersifat *stateless*, kamu mungkin ingin mencoba untuk beralih ke layanan
*serverless* seperti Azure Functions dan AWS Lambda untuk API kamu karena harganya yang lebih murah dan juga lebih
cepat.

## Jamstack + Serverkess?

Wah kita sudah belajar banyak mengenai Jamstack dan Serverless, mungkin kamu belum melihat benang merah mengenai
hubungan Jamstack dan Severless, sekarang waktunya kita *recap* kenapa Jamstack sangat cocok dengan layanan Serverless.

Misalnya kita akan membuat sebuah blog menggunakan model Jamstack. Blog ini harus memiliki fungsi blog pada umumnya
seperti manajemen posting dan terdapat form untuk mengirim tanggapan dari user. Bagaimana cara membuat blog tersebut
menggunakan Jamstack dan Serverless?

Kita akan ambil contoh blog Kodesiana.com

Kodesiana.com dibuat menggunakan Hugo, yaitu suatu *tool* untuk membuat *static site* dari file *Markdown*. Selain itu,
Kodesiana.com juga punya form untuk mengirim *feedback* (saat ini masih dalam proses develop).

Penulis menggunakan workflow sebagai berikut.

1. Manajemen artikel: `ketik dalam format Markdown -> Commit ke GitHub -> CI/CD ke Azure Static Web Apps`.
2. Form *feedback*: `website -> Form POST -> Azure Functions -> Azure Cosmos DB`.

Dengan menggunakan layanan GitHub, GitHub Actions, Azure Static Web Apps, Azure Functions, dan Azure Cosmos DB, penulis
tidak mengeluarkan uang sepeserpun untuk biaya layanan SCM dan *deployment*, karena semua layanan tersebut memiliki
*free tier* yang bisa digunakan oleh semua orang.

Jika penulis menggunakan model web tradisional, maka penulis pasti akan perlu membayar untuk Azure AppService, karena
*backend* biasa harus berjalan di atas server yang aktif diatur sendiri.

Misalnya kita ingin menambahkan fitur baru di website kita, maka kita hanya perlu membuat Functions baru di *cloud
provider* yang kita gunakan dan fitur tersebut bisa langsung *live* dalam hitungan detik dan tidak akan memengaruhi
fungsi lain yang sudah kita buat karena Functions bersifat terisolasi.

## Wah menarik ya, gimana caranya tuh?

Penulis akan lanjutkan tulisan ini di pekan depan atau mungkin dua pekan lagi karena penulis akan melaksanakan UTS.
Nanti kita akan belajar cara menggunakan tool Hugo, GitHub, dan Azure untuk membuat website Jamstack.

Stay tuned ya teman-teman!

## Referensi

1. Netlify. 2021. Jamstack (https://jamstack.org). Diakses 18 April 2021.
2. Duarte, Pedro. 2019. Jamstack (https://jamstack.wtf). Diakses 18 April 2021.
