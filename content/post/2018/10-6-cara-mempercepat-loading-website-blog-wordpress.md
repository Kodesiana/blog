---
title: 6 Cara Mempercepat Loading Website/Blog WordPress🚀
categories: [Hacks]
tags: [tips, tutorial, internet]
date: 2018-06-18
slug: 6-cara-mempercepat-loading-website-blog-wordpress
---

Banyak cara untuk mempercepat loading website yang khususnya menggunakan WordPress sebagai CMS-nya. WordPress memiliki
banyak fitur yang memudahkan admin/owner untuk mempublikasikan artikel/posting ke dalam website/blog. WordPress juga
memiliki sistem *plugin* yang dapat menambahkan berbagai macam fitur pada website/blog.

Di sisi lain, banyaknya fitur ini menyebabkan loading website/blog berbasis WordPress ini akan terasa lambat.
Banyaknya *plugin, embed,* dan *theme* menyebabkan loading website/blog lebih lambat. Hal ini dapat diatasi dengan
beberapa cara sederhana.

## Metrik Kecepatan Website

Untuk menilai kecepatan/efisiensi suatu website/blog untuk dapat ditampilkan kepada penggunanya *(user),* terdapat dua
standar metrik, yaitu **Google PageSpeed** dan **Yahoo! YSlow**. **PageSpeed** merupakan analisis performa website dari
Google yang menganalisis berbagai faktor yang dapat menambah performa website\[2\]. Sama
seperti **PageSpeed**, **YSlow** juga menganalisis performa website dengan menganalisis berbagai faktor, tetapi versi
algoritma ini dikembangkan oleh Yahoo!\[1\].

Kedua metrik ini biasa digunakan untuk mengukur performa website/blog. Penulis menggunakan layanan
[GTmetrix](https://gtmetrix.com) untuk mengukur dua skor metrik tersebut.

![Skor GTmetrix Kodesiana.com](https://assets.kodesiana.com/posts/2018/10/42081974795_f1df5d9997_o_d.jpg)

Skor GTmetrix Kodesiana.com

Gambar di atas merupakan contoh laporan skor metrik **PageSpeed** dan **YSlow** website Kodesiana.com. Selain nilai
metrik **PageSpeed** dan **YSlow**, faktor lain seperti *front-end* dan *back-end* juga perlu diperhatikan. Anda dapat
membaca artikel pada [blog GTmetrix](https://gtmetrix.com/blog/pagespeed-and-yslow-are-half-the-battle/) berikut untuk
informasi lebih lanjut.

## Mempercepat Loading Website

Dalam seri tutorial ini, penulis akan memberikan tutorial untuk mempercepat loading website/blog berbasis WordPress
menggunakan beberapa plugin. Dengan konfigurasi yang tepat, plugin ini dapat mempercepat loading website/blog Anda
secara signifikan.

Secara garis besar, Anda akan melakukan perubahan berikut pada website/blog Anda.

1. Membuat subdomain sebagai host CDN CSS/JS (melalui cPanel).
2. Konfigurasi caching W3 Total Cache.
3. Integrasi subdomain CDN dengan W3 Total Cache.
4. Konfigurasi manual minify W3 Total Cache.
5. Mengalihkan CSS/JS melalui CDN W3 Total Cache.
6. Menghapus CSS/JS yang tidak digunakan menggunakan WP Asset Clean Up.

### Konfigurasi Subdomain CDN dari cPanel

Sebelum memulai proses untuk mempercepat website/blog, Anda akan mengonfigurasi subdomain sebagai CDN untuk file CSS/JS
dari website/blog Anda. CDN adalah jaringan server yang bertindak sebagai proxy dan data center yang terpisah secara
geografis\[3\]. Untuk performa terbaik, Anda perlu membeli jasa CDN seperti MaxCDN atau sejenisnya, tetapi pada tutorial
ini penulis akan membuat subdomain sebagai pengganti *dedicated CDN*. Teknik ini bukanlah cara terbaik untuk mempercepat
loading website/blog, tetapi sudah cukup apabila Anda memiliki server yang cepat.

Buka cPanel kemudian buat subdomain baru. Pada contoh ini penulis membuat subdomain `https://cdn.kodesiana.com`
dengan *target folder* */public_html*. Pastikan *target folder* adalah folder yang sama dengan website/blog Anda. Folder
ini dapat berbeda sesuai server yang Anda gunakan.

![Membuat Subdomain untuk CDN](https://assets.kodesiana.com/posts/2018/10/42081975495_b7048e52dc_o_d.png)

Membuat Subdomain untuk CDN

![Entri Subdomain Baru untuk CDN](https://assets.kodesiana.com/posts/2018/10/42081975995_7123438da0_o_d.png)

Entri Subdomain Baru untuk CDN

Setelah Anda membuat subdomain baru, selanjutnya Anda buka **DNS Zone Editor** kemudian hapus semua entri *A* dan *TXT*
yang ada pada entri baru Anda. Kemudian buat entri CNAME yang mengarah pada domain utama Anda. Pada contoh ini
entri *cdn.kodesiana\_\_.com* hanya memiliki *CNAME* yang mengarah ke *kodesiana.com*.

![Setting DNS Zone untuk Subdomain CDN](https://assets.kodesiana.com/posts/2018/10/42265141514_d81f4ce9fb_o_d.png)

Setting DNS Zone untuk Subdomain CDN

Pada tahap ini, apabila Anda membuka subdomain baru Anda pada browser, Anda akan melihat website/blog Anda.

### W3 Total Cache ([unduh](https://wordpress.org/plugins/w3-total-cache/))

Tahap selanjutnya adalah menginstall plugin **W3 Total Cache.** Plugin ini berguna untuk membuat *cache* yang dapat
meringankan server untuk melakukan *render* HTML/CSS/JS yang akan ditampilkan kepada user. Selain *caching*, plugin ini
juga dapat melakukan *minifying* dan *CDN integration*. Plugin ini merupakan pokok utama untuk mempercepat loading
website/blog.

#### Konfigurasi Cache

Buka **Performance > General Settings,** kemudian ubah pengaturan sebagai berikut. Setelah Anda selesai, klik **Save all
settings**.

| Section        | Setting    | Value               |
| -------------- | ---------- | ------------------- |
| Page Cache     | Page Cache | Enable              |
| Page Cache     | Method     | Disk: Enhanced      |
| Minify         | Minify     | Enable              |
| Minify         | Mode       | Manual              |
| Minify         | Cache Mode | Disk                |
| Opcode Cache   |            | Opcode: Zend Opcode |
| Database Cache |            | Disable             |
| Object Cache   |            | Disable             |
| Browser Cache  |            | Enable              |
| CDN            | CDN        | Enable              |
| CDN            | Type       | Generic Mirror      |

#### Konfigurasi CDN

Buka **Performance > CDN**. kemudian pada bagian **Configuration: Objects**, tambahkan subdomain yang sebelumnya telah
dibuat. Setelah Anda selesai, klik **Save all settings**.

![Pengaturan CDN](https://assets.kodesiana.com/posts/2018/10/42265140234_a571898563_o_d.jpg)

#### Konfigurasi Minification

Buka **Performance > Minify,** kemudian klik tombol **Help** pada bagian atas W3 Total Cache.

![Tombol Help untuk Menambahkan Entri JS/CSS](https://assets.kodesiana.com/posts/2018/10/41173606200_9e424281cd_o_d.jpg)

Tombol Help untuk Menambahkan Entri JS/CSS

Pada bagian **JavaScript,** pilih semua file JS yang ada pada satu template, pada contoh ini penulis memilih semua file
JS (ada 13 file) pada template *All Templates.*

![Pilihan Entri JS](https://assets.kodesiana.com/posts/2018/10/42081975325_fc49232fe4_o_d.jpg)

Selanjutnya pada bagian **Cascading Style Sheets**, pilih semua CSS pada satu template, pada contoh ini penulis memilih
semua file CSS (ada 8 file) pada template *All Templates*. Setelah semua file JS dan CSS dipilih, klik **Save & close**.

![Pilihan Entri CSS](https://assets.kodesiana.com/posts/2018/10/42265140414_fd908061ee_o_d.jpg)

Sekarang Anda akan mengatur urutan loading JS dan CSS pada website/blog Anda. Anda perlu melakukan prioritas JS dan CSS
mana yang perlu di-*load* terlebih dahulu dan mana yang tidak perlu. Selain itu, Anda juga perlu mengatur JS dan CSS
mana saja yang akan di-*load* pada website/blog Anda.

Cara mengatur urutan loading JS/CSS pada W3 Total Cache:

![Mengatur Urutan Load JS/CSS](https://assets.kodesiana.com/posts/2018/10/42081980655_6dbae2ef11_o_d.jpg)

Anda dapat melakukan *drag-n-drop* pada item JS/CSS untuk mengatur urutan *loading-nya.* Secara umum, Anda harus
mengikuti aturan berikut:

1. jQuery harus paling atas.
2. JS/CSS bawaan WordPress.
3. JS/CSS tema.
4. JS Google Analytics dan AdSense.
5. JS/CSS plugin.

Urutan tersebut sangat penting agar website/blog Anda dapat beroperasi secara normal. Apabila Anda salah mengatur urutan
JS/CSS, website/blog Anda mungkin tidak dapat ditampilkan dengan baik. Setelah Anda selesai, klik **Save all settings**.

Apabila Anda pusing untuk mengatur JS/CSS mana yang perlu di-load lebih dulu/tidak, Anda dapat mematikan opsi **Minify:
Enable** menjadi **Disable** kemudian melangkahi tahap ini dan lanjut ke tahap selanjutnya.

### WP Asset Clean Up ([unduh](https://wordpress.org/plugins/wp-asset-clean-up/))

Tahap selanjutnya adalah menginstall plugin **WP Asset Clean Up**. Plugin ini berguna untuk membuang *(unload)* file
CSS/JS yang tidak digunakan pada website/blog.

Buka **WP Asset Clean Up > Settings**, kemudian centang pada kotak **Manage in the Dashboard?** kemudian klik **Save
Changes**.

Buka **WP Asset Clean Up > Home Page**, kemudian Anda akan melihat banyak file CSS/JS yang tampil. Ceklis pada kotak
untuk mencegah CSS/JS tersebut *di-load* pada *front page*. Hal ini bertujuan untuk meringankan loading *front page*.
Anda dapat mencentang kotak *wp-embed* untuk menonaktifkan *WordPress Embed* pada *home page*.

![Pengaturan WP Asset Clean Up](https://assets.kodesiana.com/posts/2018/10/42983399971_714659d7fc_o_d.jpg)

Anda dapat menyesuaikan CSS/JS apa saja yang digunakan oleh website/blog Anda melalui plugin ini. Harap berhati-hati
karena salah setting dapat menyebabkan website/blog Anda tidak beroperasi dengan baik.

## TIP: Pilih Hosting yang Bagus

Setelah Anda membaca artikel ini, Anda akan mengetahui bahwa semua cara yang dijelaskan di atas tidak menggunakan server
pihak ketiga selain server yang Anda gunakan sendiri. Hasil di atas dapat dicapai asalkan Anda memiliki server/hosting
yang bagus, agar tidak terjadi *bottleneck*.

[![DomaiNesia](https://static.domainesia.com/assets/images/afiliasi/banner-1.png)](https://www.domainesia.com/?aff=4175)

Server yang bagus akan menghasilkan performa yang lebih bagus pula. Kodesiana.com menggunakan layanan hosting dari
**DomaiNesia** yang sudah terbukti merupakan hosting terbaik di Indonesia. Harga yang kompetitif dan layanan yang
profesional, membuat **DomaiNesia** menjadi pilihan terbaik untuk hosting Indonesia.

Anda bisa mendaftar melalui [link berikut](https://www.domainesia.com/?aff=4175) atau menggunakan kupon **KODESIANA20**
untuk mendapatkan diskon 20% untuk hosting pertama Anda di **DomaiNesia!**

## Penutup

Pada akhir tutorial ini, Anda dapat melakukan uji pada website GTmetrix untuk melihat skor metrik **PageSpeed**
dan **YSlow** Anda. Kodesiana.com memiliki skor yang tinggi dan waktu loading yang relatif cepat (~3,6 detik) setelah
melakukan tutorial di atas.

Apabila Anda mengalami kesulitan, jangan malu bertanya lewat komentar!

## Referensi

1. Duran, Marcel. 2018. [YSlow](http://yslow.org). Diakses 18 Juni 2018.
2. Google. 2018. [About PageSpeed Insight](https://developers.google.com/speed/docs/insights/about).
   Diakses 18 Juni 2018.
3. Wikipedia. 2018. [Content Delivery Network](https://en.wikipedia.org/wiki/Content_delivery_network).
   Diakses 18 Juni 2018.
