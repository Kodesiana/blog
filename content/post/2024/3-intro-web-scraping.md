---
title: "Web Scraping dengan Scrapy🕷️"
categories: Tutorial
tags: [tutorial, web, data mining, text mining, scraping]
series: [Web Scraping dan Analisis Harga Rumah]
date: 2024-02-10
slug: web-scraping-dengan-scrapy
---

{{< button content="Soure Code" icon="brand-github" href="https://github.com/fahminlb33/bogor-house-price" >}}

*Web scraping* merupakan salah satu metode untuk melakukan akuisisi data dari *website* publik. Pada [artikel sebelumnya](kodesiana.com) penulis pernah menyinggung mengenai *web scraping* dan pada artikel ini penulis akan membahas secara komprehensif bagaimana cara membuat sebuah *web scraper* untuk mendapatkan data dari sebuah *website*.

Pada artikel ini kita akan membuat sebuah *web scraper* untuk mengambil data *listing* perumahan di daerah Bogor dari laman Rumah123.com. Data dari *scraper* ini juga akan kita gunakan pada artikel yang akan datang, jadi jangan lupa diikuti ya!

Oke sebelum kita mulai, apa sih **web scraping** itu?

*Web scraping* secara umum adalah proses ekstraksi data dari suatu *website*. Dalam konteks akuisisi data, *web scraping* merujuk pada proses mengekstrak data misalnya *listing* dari suatu *website* secara otomatis.

Terdapat dua kata kunci yang perlu kita pahami, *website* dan *scraping*.

- *Website* secara umum kita kenal adalah halaman-halaman yang bisa kita akses melalui suatu domain. Misalnya *website* [Kodesiana.com](https://www.kodesiana.com) memiliki banyak artikel dan halaman-halaman seperti kategori dan pencarian
- *Scraping* merupakan proses ekstraksi data yang dalam konteks ini ekstraksi dari suatu *website*

Selain *scraping* ada istilah lain yang perlu kita tahu yaitu *crawling*. *Crawling* merupakan proses menjelajahi tautan atau *link* pada suatu halaman *website*. Teman-teman tentunya perlu klik pada tautan ke artikel ini baik dari halaman beranda maupun dari langganan email, bukan? Tidak mungkin teman-teman mengingat URL artikel ini dan mengetiknya manual di peramban/*browser*. Tautan-tautan atau *link* ini disebut sebagai *hyperlink*.

{{< unsplash "photo-1595872506700-a69023116568" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzI4OTYyMjA0fA" "Photo by Mario Mendez on Unsplash" "CAPTION HERE" >}}

Nah sekarang kita tahu bahwa *web scraping* merupakan proses ekstraksi data dari *website* secara otomatis dengan cara menjelajahi tautan atau *link* pada laman *website*, pertanyaan selanjutnya adalah **bagaimana proses ekstraksi tersebut terjadi?**

Sekarang coba kita bayangkan proses *scraping* secara manual. Misalnya penulis ingin mencari tahu harga "Samsung Galaxy Tab S6 Lite" di Tokopedia, penulis akan melakukan:

1. Membuat sebuah *spreadsheet* untuk mencatat data
2. Membuat nama-nama kolom misalnya nama toko, jumlah terjual, *rating*, dan harga
3. Penulis membuka laman Tokopedia, kemudian melakukan pencarian dengan kata kunci "samsung galaxy tab s6 lite"
4. Akan muncul hasil pencarian berupa *grid* yang berisikan foto, judul, nama toko, *rating*, dan jumlah terjual
5. Berdasarkan data barang yang ada, penulis akan catat satu per satu data dari hasil pencarian ke *spreadsheet*
6. Setelah semua barang dicatat, lanjut ke halaman kedua
7. Lakukan proses 5-6 hingga didapatkan jumlah data yang cukup

Nah daripada melakukan proses tersebut secara manual yang pastinya akan memakan banyak waktu, kita bisa mengotomatisasi proses ekstraksi data tersebut dengan cara membuat *web scraper*. Proses yang sama akan kita implementasi dengan menggunakan pemrograman, pada kasus ini kita akan belajar membuat *scraper* menggunakan bahasa pemrograman Python dan *library* `scrapy`.

Tapi tunggu dulu!

Berbeda dengan manusia yang bisa mengidentifikasi informasi secara visual, komputer menginterpretasi sebuah *website* berdasarkan strukturnya. Lalu bagaimana struktur sebuah *website* itu?

## Fundamental *Website*🌏

Sebuah *website* tentunya perlu dibuat menggunakan *koding* dan teman-teman pasti sudah familiar dengan istilah HTML, CSS, dan JS. Bagi yang belum familiar, kita akan sedikit bahas kembali mengenai tiga fundamental *website* ini.

### *Hypertext Markup Language (HTML)* 🧱

*Hypertext Markup Language (HTML)* mendefinisikan **struktur** dan **konten** sebuah halaman *website*. Sama seperti kita membuat sebuah karya tulis ilmiah yang biasanya berisi beberapa bab seperti pendahuluan yang berisi latar belakang, rumusan masalah, dan tujuan penelitian; pada sebuah *website* struktur dan kontennya didefinisikan menggunakan *tag HTML*.

Konten pada suatu *website* **pasti** berada di antara sebuah elemen, yang terdiri atas *opening tag*, konten, dan *closing tag*.

![anatomy of html tag](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics/grumpy-cat-small.png)

Pada konteks *web scraping*, kita menginginkan konten yang berada diantara *opening* dan *closing tag*. Secara umum sebuah *website* akan memiliki sangat banyak tag yang digunakan untuk memberikan struktur pada halaman *website*, sehingga hal ini juga menjadi tantangan tersendiri dalam membuat sebuah *web scraper*, yaitu bagaimana cara mendapatkan data yang kita mau dan membuang *tag* yang tidak diperlukan.

### *Cascading Style Sheets (CSS)* 💄

Jika HTML bertanggung jawab untuk memberikan struktur dan konten pada halaman *website*, *Cascading Style Sheets (CSS)* bertugas untuk memberikan gaya atau *style* pada halaman *website*. Jika HTML adalah tembok rumah, maka CSS adalah cat rumah yang memberikan warna dan estetika.

Dalam praktiknya *web developers* akan menggunakan banyak CSS untuk membuat tampilan yang estetik dan umumnya juga, gaya atau *style* ini akan dikelompokkan menjadi kelas-kelas yang nantinya bisa diterapkan ke elemen-elemen HTML sesuai kebutuhan.

Contoh kode CSS:

```css
h1 {
  font-weight: bold;
}

.merah {
  color: rgb(255, 0, 0);
}
```

Secara umum *style* dapat diterapkan ke elemen HTML dengan dua cara,

1. Menerapkan *style* ke tag HTML, contohnya semua tag `h1` akan memiliki gaya *font bold*
2. Membuat sebuah kelas *style*, contohnya `merah`. Ketika sebuah elemen memiliki atribut kelas `merah`, maka teksnya akan menjadi warna merah

### *JavaScript (JS)* 🎠

Bagian terakhir dari fundamental *website* adalah JavaScript. Setelah kita mempunyai struktur, konten, dan gaya, maka komponen terakhir yang kita perlukan adalah fungsi interaktif dalam halaman *website* (*interactivity*). Jika HTML dan CSS adalah *markup*, maka JavaScript adalah *programming language*.

> HTML/CSS juga bahasa pemrograman!!!🤬
> *Say what you want, but is HTML/CSS turing complete? No?*

Contohnya adalah kolom pencarian artikel Kodesiana.com. Ketika teman-teman menginputkan teks pada kolom pencarian, teman-teman akan mendapatkan hasil pencarian secara *real-time*. Pada kasus ini, kolom pencarian dibuat menggunakan HTML (elemen `input`), kemudian diberikan gaya *corner-radius* menggunakan CSS, dan interaksi ketika pengguna menuliskan teks pada kolom input maka akan dilakukan pencarian.

Dalam konteks *web scraping*, kita *biasanya* tidak perlu mengekstrak data dari kode JavaScript karena tentu saja, ini adalah kode untuk interaksi, bukan konten. Konten hanya ada dalam HTML*.

> *Kita akan bahas mengenai konsep ini pada subbab terakhir artikel ini karena ada beberapa kasus tersendiri di mana JavaScript ini diperlukan.

### Contoh Laman Sederhana📃

Nah kita sudah bahas konsep dasar sebuah *website*, sekarang kita akan coba lihat contoh kode sebuah halaman *web*. Pada contoh ini kita akan lihat sebuah kode HTML dan CSS sederhana tanpa JS.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Fundamental HTML</title>
  <style>
    h1 {
      font-weight: bold;
    }

    .merah {
      color: rgb(255, 0, 0);
    }
  </style>
</head>

<body>
  <h1>Kodesiana.com</h1>
  <img src="https://picsum.photos/200" alt="Lorem ipsum.">

  <p class="merah">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ligula dui, ultrices eu mattis nec, luctus sed
    turpis. Aliquam mollis turpis eu rutrum condimentum. Curabitur vitae mauris arcu. Praesent scelerisque odio diam,
    vitae placerat turpis tristique sit amet. Quisque quis lorem ut purus ullamcorper ultricies vel at lacus. Curabitur
    hendrerit dolor eu facilisis semper. In dapibus diam lorem, a iaculis arcu laoreet et. Quisque tincidunt venenatis
    quam in molestie. Integer lacinia rutrum diam, sit amet imperdiet arcu convallis nec.
  </p>

  <ul> <!-- ini komentar -->
    <li>Koding</li>
    <li><i>DevOps</i></li>
    <li>Machine Learning</li>
  </ul>

  <p>Kunjungi <a href="https://www.kodesiana.com">Kodesiana</a> untuk membaca artikel lain!</p>
</body>

</html>
```

Jika teman-teman salin dan simpan kode di atas dalam file .html, teman-teman akan melihat halaman sebagai berikut (gambar mungkin berbeda).

![contoh halaman website sederhana](https://kodesianastorage.blob.core.windows.net/kodesiana-public-assets/posts/2024/scraping/sample-page_comp.png)

> Laman web sederhana. Sumber: Penulis

Jika kita amati antara kode dan visual halaman di peramban, terdapat beberapa elemen HTML yang kita gunakan,

1. `<style>`, blok elemen ini digunakan untuk mendefinisikan kode CSS (biasanya kode CSS disimpan pada berkas .css menggunakan elemen `<link>`)
2. `<h1>`, elemen ini menyatakan *heading* atau judul/subbab
3. `<img>`, elemen ini digunakan untuk menampilkan gambar yang berlokasi di atribut `src`
4. `<p>`, elemen ini digunakan untuk menyatakan teks paragraf. Perlu diingat sering kali karena alasan struktur dan estetika, teks bisa saja ditempatkan pada elemen seperti `<span>` atau `<i>`
5. `<ul>` (kepanjangannya *unordered list*) berisi `<li>` (*list item*), elemen ini digunakan untuk membuat *bullet points*. Pada contoh ini terjadi *nesting* atau penggunaan elemen HTML di dalam elemen lain

Nah dari kelima contoh elemen ini kita sudah memiliki sedikit gambaran bagaimana sebuah *website* dibangun. Tahap selanjutnya adalah, bagaimana cara kita bisa memilih tag mana yang mengandung data yang ingin kita simpan dan bagaimana cara mengekstrak datanya?

### DevTools atau Inspector💻

Cara paling mudah untuk menginspeksi elemen-elemen sebuah halaman *website* adalah dengan menggunakan DevTools atau Inspector yang disediakan oleh peramban. Pada contoh ini penulis akan menggunakan Microsoft Edge DevTools untuk melakukan inspeksi. Jangan khawatir, teman-teman bisa menggunakan peramban apapun seperti Firefox, Chrome, Safari, Brave, Opera dan lainnya karena fitur ini **pasti ada** di semua peramban.

Cara mengaksesnya adalah klik kanan pada halaman *web*, kemudian pilih **Inspect**.

![DevTools Inspector](https://kodesianastorage.blob.core.windows.net/kodesiana-public-assets/posts/2024/scraping/devtools_comp.png)

> Chromium DevTools. Sumber: Penulis

DevTools berfungsi untuk membantu *web developer* untuk *debugging* halaman *web*-nya. DevTools menyediakan berbagai *tools* seperti Element Inspector dan Computed Styles untuk membantu kita membuat *selector*.

### Selectors🔍

Apa itu *selector*?

*Selector* adalah suatu aturan untuk menargetkan elemen HTML pada *Document Object Model (DOM)*. Pada tampilan *Inspect Elements* di atas kita bisa lihat kode HTML dari halaman yang kita buka dan keseluruhan struktur HTML ini disebut sebagai DOM.

![Document Object Model (DOM)](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/DOM-model.svg/428px-DOM-model.svg.png)

> Document Object Model (DOM). Sumber: ‍Birger Eriksson dari [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:DOM-model.svg)

Secara umum terdapat dua cara yang lazim digunakan untuk memilih elemen pada DOM, yaitu *CSS selector* dan XPath. Pada jendela **DevTools**, buka kolom pencarian dengan cara tekan CTRL+F.

Beberapa contoh sintaks *CSS selector*:

| Selector             | Contoh                 | Keterangan                                                                                                                                                           |
|----------------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `.class`             | `.merah`               | Memilih semua elemen dengan `class="merah"`                                                                                                                          |
| `.class1.class2`     | `.teks.merah`          | Memilih semua elemen dengan atribut `class` yang berisi `teks` dan `merah`                                                                                           |
| `#id`                | `#input_nama`          | Memilih elemen dengan `id="input_nama"`                                                                                                                              |
| `element element`    | `ul li`                | Memilih semua `<li>` di dalam `<ul>`                                                                                                                                 |
| `[attribute*=value]` | `[href*="google.com"]` | Memilih semua elemen yang memiliki atribut `href` yang berisi kata "google.com". Aturan ini bisa ditambah prefix elemen untuk memilih berdasarkan elemen dan atribut |

Beberapa contoh sintaks XPath:

| Selector | Contoh | Keterangan |
|----------|--------|------------|
| `/` | `/body/p` | Memilih elemen `<p>` dari relatif terhadap root DOM |
| `//` | `//p` | Memilih semua elemen dengan tag `<p>` di manapun lokasinya dalam DOM |
| `//element/*` | `//ul/*` | Memilih semua elemen yang berada di dalam `<ul>` di manapun lokasinya di dalam DOM
| `//element/elemen` | `//ul/li` | Memilih semua elemen `<li>` yang berada di dalam `<ul>` di manapun lokasinya dalam DOM |
| `//elemen[@attribute=value]` | `//p[@class="merah"]` | Memilih semua elemen `<p>` dengan atribut `class="merah"` di manapun lokasinya dalam DOM |

Beberapa contoh pengaplikasian *CSS selector* pada halaman HTML yang sudah dibuat sebelumnya:

Contoh 1: pencarian berdasarkan tag HTML `<img>`

![CSS selector 1](https://kodesianastorage.blob.core.windows.net/kodesiana-public-assets/posts/2024/scraping/css-example-1_comp.png)

Contoh 2: pencarian berdasarkan tag `<p>` yang memiliki atribut `class` yang berisi kata "merah"

![CSS selector 2](https://kodesianastorage.blob.core.windows.net/kodesiana-public-assets/posts/2024/scraping/css-example-2_comp.png)

> Jangan lupa latihan untuk membuat *selector* 🫡

Dengan modal pengetahuan *selector* ini, kita akan coba membuat *scraper* menggunakan Scrapy untuk menunduh data harga rumah dari *website* Rumah123.com. Pada artikel ini penulis akan fokus menggunakan XPath saja karena penulis lebih nyaman menggunakan XPath.

## Scrapy⛏️

[Scrapy](https://scrapy.org/) merupakan *framework* Python untuk melakukan *web scraping*. Scrapy mampu melakukan pencarian menggunakan *CSS selector* dan XPath. Selain itu Scrapy juga mendukung pemrosesan parallel dan *pipeline* untuk mengolah data *scraping* secara *real time* sebelum disimpan.

### Komponen Scrapy🛒

Scrapy memiliki setidaknya lima komponen penting yang perlu kita pahami untuk dapat membuat sebuah *web scraper*.

#### Spider

*Spider* merupakan komponen utama dalam Scrapy yang berfungsi untuk mengatur bagaimana proses *scraping* dilakukan. Pada *spider* kita bisa mengatur URL apa saja yang akan di-*crawl* dan bagaimana proses *scraping* dilakukan untuk setiap URL yang di-*crawl* hingga menghasilkan data yang diinginkan.

#### Selectors

*Selectors* adalah kelas yang menyediakan fungsi pencarian menggunakan *CSS selector* dan XPath. Secara umum kita bisa mengakses *selector* ketika *spider* berhasil membaca sebuah halaman.

#### Items

*Items* adalah sebuah kelas atau `dict` yang menampung output data dari proses *scraping*. Scrapy bisa  menerima *item* berupa `dict` atau kelas turunan dari `scrapy.item.Item`. Jika kita menggunakan kelas turunannya, kita bisa menggunakan fungsi pemrosesan data yang lebih komprehensif seperti *item loaders* dan *item pipeline*, tetapi pada artikel ini kita akan menggunakan `dict` sederhana untuk mempersingkat kode yang perlu dibuat.

#### Feed export

Ketika proses *scraping* menghasilkan *item*, tahap selanjutnya adalah menyimpan *items* tersebut ke sebuah file menggunakan *feed exporter*. *Exporter* bawaan dari Scrapy adalah JSON, *JSON lines*, CSV, dan XML.

#### Shell

*Scrapy shell* merupakan layanan interaktif untuk menguji kode *scraping* secara *real time*. Pada pembahasan sebelumnya kita bisa menggunakan DevTools atau Inspector untuk menguji pencarian menggunakan *CSS selector* dan XPath, tetapi kadang sintaks pencarian yang kita buat tidak selalu bisa digunakan di Scrapy karena perbedaan struktur HTML (pembahasan selanjutnya di subbab *Dynamic JS Content*), maka dari itu kita bisa mencoba kode Scrapy secara *real time* menggunakan *scrapy shell*.

Penulis biasanya mengguanakan DevTools untuk membuat sintaks pencarian, kemudian menggunakan *scrapy shell* untuk mencoba mengeksekusi pencarian sebelum akhirnya dilakukan *scraping* secara penuh.

Nah sampai di sini kita sudah membahas banyak mengenai teori dari *framework* `scrapy`, selanjutnya kita akan membuat *web scraper* untuk laman Rumah123 dan kita akan mengekstrak informasi *listing* rumah di daerah Bogor.

### Membuat Spider🗃️

Tahap pertama dari membuat *web scraper* adalah menyiapkan proyek terlebih dahulu. Anda bisa menggunakan Python atau Anaconda untuk membuat *virtual environment*. Jalankan perintah berikut untuk meng-*install* `scrapy`.

`pip install scrapy` atau `conda install scrapy`

Tunggu hingga proses *install* selesai, kemudian jalankan perintah berikut untuk membuat *project* baru.

```bash
scrapy startproject harga_rumah
```

Jika proses ini berhasil, kita akan mendapatkan folder baru yaitu `harga_rumah` dengan isi direktori sebagai berikut.

```plain
harga_rumah/
    scrapy.cfg
    harga_rumah/
        __init__.py
        items.py
        middlewares.py
        pipelines.py
        settings.py       # pengaturan proyek seperti User-Agent dan lainnya
        spiders/          # lokasi spider yang akan kita buat
            __init__.py
```

> Kita akan bahas mengenai struktur ini pada bagian selanjutnya.

Setelah kita memiliki folder proyek *scraping*, tahap selanjutnya adalah membuat *spider* baru.

```bash
scrapy genspider rumah123 rumah123.com
```

Sampai di tahap ini seharusnya kita akan mendapatkan file `rumah123.py` di dalam folder `spiders`. Kita akan membuat kode *scraper* kita pada file ini.

### Konfigurasi Dasar Spider

Sebelum kita lanjut membuat kode untuk melakukan *scraping*, ada beberapa konfigurasi yang perlu kita atur. Buka file `settings.py` kemudian isikan dengan kode berikut.

> Sebagian besar kode berikut sudah ada dalam file `settings.py`, cukup ganti bagian yang sesuai saja, tidak perlu di ganti semuanya.

```python
BOT_NAME = "harga_rumah"

SPIDER_MODULES = ["harga_rumah.spiders"]
NEWSPIDER_MODULE = "harga_rumah.spiders"

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

ROBOTSTXT_OBEY = True
COOKIES_ENABLED = True

CONCURRENT_REQUESTS = 1
RETRY_TIMES = 5
DOWNLOAD_DELAY = 3

SPIDER_MIDDLEWARES = {
    # "harga_rumah.middlewares.HargaRumahSpiderMiddleware": 543,
}

DOWNLOADER_MIDDLEWARES = {
    # "harga_rumah.middlewares.HargaRumahDownloaderMiddleware": 543,
}

CLOSESPIDER_ERRORCOUNT = 3
EXTENSIONS = {
    "scrapy.extensions.closespider.CloseSpider": 500,
}

AUTOTHROTTLE_ENABLED = True
AUTOTHROTTLE_START_DELAY = 5
AUTOTHROTTLE_MAX_DELAY = 120
AUTOTHROTTLE_TARGET_CONCURRENCY = 1

REQUEST_FINGERPRINTER_IMPLEMENTATION = "2.7"
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"

FEED_EXPORT_ENCODING = "utf-8"
FEEDS = {
    "rumah123.json": {
        "format": "jsonlines"
    },
}
```

Penjelasan kode:

- `BOT_NAME`, `SPIDER_MODULES`, `NEWSPIDER_MODULE` merupakan konfigurasi bawaan `scrapy` untuk mengidentifikasi nama *bot* dan lokasi *spider*. Jangan ubah bagian ini
- `USER_AGENT` mengatur *User-Agent* yang akan digunakan ketika melakukan *scraping*. Secara umum *User-Agent* digunakan untuk mengidentifikasi jenis klien yang mengakses server. Pada contoh ini kita menggunakan *User-Agent* Microsoft Edge sehingga server akan merekam aktivitas *scraping* seperti dilakukan oleh Edge
- `ROBOTSTXT_OBEY` merupakan fitur Scrapy untuk mematuhi aturan dari `robots.txt`. Robots.txt merupakan standar yang menyatakan apa saja URL yang boleh dicari oleh *bot*. Secara umum kita bisa mengabaikan robots.txt pada kasus tertentu misalnya ingin melakukan *scraping* pada halaman yang perlu login
- `COOKIES_ENABLED` mengaktifkan kuki untuk setiap *request* yang dilakukan oleh *scraper*
- `CONCURRENT_REQUEST` menentukan berapa banyak *worker* yang akan melakukan *request* ke server. Pada kasus ini kita menggunakan nilai 1 agar proses *scraping* hanya dilakukan satu persatu. Kita bisa meningkatkan nilai ini tetapi ada kemungkinan server akan memblokir *scraper* kita (pelajari lebih lanjut di subbab CAPTCHA)
- `RETRY_TIMES` menentukan berapa kali *scraper* bisa melakukan percobaan *scraping* kembali jika proses *scraping* gagal, misalnya karena masalah koneksi internet atau lainnya
- `DOWNLOAD_DELAY` menentukan berapa lama waktu tunggu antara satu dan *request* lainnya. Misalnya jika *CONCURRENT_REQUEST=1* dan *DOWNLOAD_DELAY=3*, berarti setelah proses *scraping* selesai, Scrapy akan menunggu tiga detik sebelum melanjutkan *scraping*  halaman selanjutnya
- `SPIDER_MIDDLEWARES`, `DOWNLOADER_MIDDLEWARES` mengatur *middleware* yang akan digunakan oleh *spider*. *Middleware* adalah kode yang dieksekusi ketika proses *crawl* dan berfungsi untuk mengubah, menambah, dan mengatur proses *crawl*. Pada kasus ini kita tidak menggunakan *middleware* tambahan
- `CLOSESPIDER_ERRORCOUNT`, `EXTENSIONS` mengaktifkan integrasi dengan `CloseSpider`, ekstensi ini berfungsi untuk menghentikan proses *scraping* apabila terjadi tiga kali *error*
- `AUTOTHROTTLE_` konfigurasi ekstensi `AutoThrottle`. Ekstensi ini berfungsi untuk mengurangi kecepatan *scraping* ketika server mengirimkan *error*. Intinya adalah ekstensi ini untuk mencegah server memblokir aktivitas *scraping* karena indikasi kecepatan akses yang terlalu cepat
- `REQUEST_FINGERPRINTER_IMPLEMENTATION`, `TWISTED_REACTOR` konfigurasi internal Scrapy. Jangan diubah
- `FEED_EXPORT_ENCODING`, `FEEDS` mengatur *output feed* atau lokasi output data yang di-*scraping*. Pada kasus ini kita akan menyimpan hasil *scraping* pada file `rumah123.json` dengan format *JSON lines*, artinya satu baris JSON untuk setiap data

Sampai di sini kita sudah mengatur *behavior spider* yang nantinya akan kita gunakan untuk melakukan *scraping*. Tahap selanjutnya kita akan membuat *spider* untuk mengekstrak data dari halaman menggunakan XPath.

### Mengekstrak Data dari Website📌

Pada tahap sebelumnya kita sudah membuat *spider* dengan nama file `rumah123.py`. Sekarang kita akan membuat kode untuk mengekstrak data dari halaman Rumah123.com. Sebelum itu, file `rumah123.py` akan memiliki kode berikut.

```python
import scrapy

class Rumah123Spider(scrapy.Spider):
    name = "rumah123"
    allowed_domains = ["rumah123.com"]
    start_urls = ["https://rumah123.com"]

    def parse(self, response):
        pass
```

Potongan kode di atas menjelaskan bahwa kita akan melakukan *scraping* dimulai dari `https://rumah123.com` dan proses *scraping* hanya dibolehkan untuk domain `rumah123.com`. Hal ini diperlukan untuk membatasi agar *scraper* tidak menjelajahi halaman yang tidak relevan.

> Catatan: *Website* pasti akan selalu diperbarui. Kita sudah bisa melihat bagaimana Facebook, Google, Instagram, Twitter, dan berbagai *platform* lain berubah setiap tahunnya. Perubahan-perubahan ini tentunya memerlukan perubahan kode HTML, CSS, dan JS yang berarti setiap kali ada perubahan pada suatu halaman *website*, sekecil apapun, maka bisa jadi *scraper* yang sudah kita buat bisa menjadi tidak bekerja secara tiba-tiba. Jika ada perubahan, kita harus menyesuaikan kembali kode *scraper* kita.

Tahap pertama yang akan kita lakukan untuk membuat *scraper* adalah mengimpor *library* yang akan kita gunakan,

```python
import os
import re
import datetime
from urllib.parse import urlparse, urljoin

import scrapy
```

Selanjutnya kita akan mengatur `start_url`. Variabel ini berfungsi untuk mengatur URL awal yang akan di-*crawl* oleh `scrapy`. Bagaimana cara kita mengetahui URL awal untuk di-*crawl?* Kita perlu membuka halaman yang akan kita *scrape*.

Pada kasus ini kita akan mencari properti di daerah Bogor. URL untuk halaman *listing* ini adalah https://www.rumah123.com/jual/bogor/rumah.

![*Listing* properti di daerah Bogor Rumah123.com](https://assets.kodesiana.com/posts/2024/scraping/rumah123_listing.png)

> Sumber: Penulis.

Sekarang kita coba perhatikan perubahan URl ketika kita membuka halaman kedua. Ketika kita buka halaman kedua, URL berubah menjadi https://www.rumah123.com/jual/bogor/rumah/**?page=2**. Sekarang coba buka halaman ketiga, apakah *query params* berubah menjadi `page=3`?

Sekarang kita sudah memiliki pola bagaimana Rumah123.com melakukan paginasi. Sekarang kita bisa menggunakan fakta ini untuk mengatur URL awal *scraping*. Pada kasus ini kita akan melakukan *scraping* pada 500 halaman *listing*.

Ubah `start_url` menjadi:

```python
start_urls = [
  f"https://www.rumah123.com/jual/bogor/rumah/?page={x}" for x in range(1, 500)
]
```

Sekarang `scrapy` akan melakukan *scraping* pada URL berikut.

1. https://www.rumah123.com/jual/bogor/rumah/?page=1
2. https://www.rumah123.com/jual/bogor/rumah/?page=2
3. ...
4. https://www.rumah123.com/jual/bogor/rumah/?page=499

Setelah kita mengatur URL awal yang akan kita *scrape*, tahap selanjutnya akan mengekstrak setiap properti yang muncul pada halaman *listing*.

#### Implementasi Fungsi `parse`

Fungsi `parse` pada `scrapy` akan dieksekusi setiap kali `scrapy` selesai melakukan *crawling* pada suatu URL. Pada kasus ini kita sudah membuat daftar URL yang akan kita jelajahi, yaitu halaman *listing* properti. Tetapi informasi yang ditampilkan pada halaman ini tidak selengkap jika dibandingkan dengan kita membuka halaman detail properti.

Coba kita perhatikan informasi yang ada pada halaman detail properti.

![Detail properti bagian 1](https://assets.kodesiana.com/posts/2024/scraping/rumah123_detail1.png)

![Detail properti bagian 2](https://assets.kodesiana.com/posts/2024/scraping/rumah123_detail2.png)

> Sumber: Penulis

Berdasarkan contoh halaman detail properti ini, ada banyak informasi yang bisa kita ekstrak, misalnya:

1. Harga dan cicilan
2. Alamat
3. Gambar properti
4. *Overview* properti (Cash Keras, Perumahan/Komplek)
5. Deskripsi
6. Spesifikasi (kamar tidur, kamar mandi, dll.)
7. Fasilitas (jalur telepon, keamanan, dll.)
8. Agen properti
9. Waktu terakhir kali properti diperbarui

Tentu masih ada informasi lain seperti lokasi *maps*, waktu diperbarui, dan lainnya yang bisa kita ekstrak, tetapi pada kasus ini kita akan coba mengekstrak informasi di atas dari halaman detail properti ini.

Untuk memudahkan kita mengekstrak informasi tersebut, kita akan memisahkan proses ekstraksi untuk setiap komponen tersebut menjadi fungsi-fungsi terpisah. Seperti yang sudah dijelaskan sebelumnya, kita perlu memerintahkan `scrapy` untuk meng-*crawl* halaman detail properti karena sementara ini kita baru meng-*crawl* halaman *listing* saja.

Pada file `rumah123.py`, tambahan kode berikut.

```python
def is_property_page(self, url):
  # cek URL memiliki kata "/properti" dan tidak memiliki kata "perumahan-baru"
  return "/properti" in url and "/perumahan-baru" not in url

def parse(self, response):
  # lakukan scraping data jika URL ini adalah halaman detail properti
  if self.is_property_page(response.url):
    yield {
      'id': self.extract_id(response),
      'price': self.extract_price(response),
      'installment': self.extract_installment(response),
      'address': self.extract_address(response),
      'tags': self.extract_tags(response),
      'description': self.extract_description(response),
      'specs': self.extract_specs(response),
      'facilities': self.extract_facilities(response),
      'agent': self.extract_property_agent(response),
      'images': list(self.extract_images(response)),
      'url': response.url,
      'last_modified': self.extract_last_modified(response).isoformat(),
      'scraped_at': datetime.datetime.now().isoformat(),
    }

  # mencari semua URL pada tag <a>
  for property_url in response.xpath("//a/@href").getall():
    # cek apakah URL ini merupakan halaman detail properti
    if self.is_property_page(property_url):
      yield response.follow(property_url)
```

Pada fungsi di atas kita menggunakan *keyword* `yield` menjadikan fungsi `parse` sebagai *generator*. Intinya adalah setiap kali `scrapy` melakukan *crawl*, jika kita mendeteksi halaman detail properti (ditandai dengan adanya kata `/properti` kecuali kata `perumahan-baru`) maka kita akan melakukan *scraping* dan mengembalikan `dict` yang berisi data.

Setelah itu akan dicari semua URL pada halaman dan kemudian dilakukan pengecekan kembali apakah URL tersebut adalah halaman detail properti, jika iya kita akan menggunakan fungsi `response.follow()` untuk menginstruksikan `scrapy` agar men-*crawl* URL tersebut.

#### Ekstrak ID Properti

Setiap data pasti memiliki sebuah ID atau kode unik yang mengidentifikasi satu objek dengan objek lainnya, seperti halnya NIK bersifat unik untuk semua penduduk di Indonesia. Tujuannya adalah agar nanti setelah proses *scraping* kita bisa mendeteksi duplikasi data meskipun `scrapy` sudah memiliki fitur deduplikasi URL (kadang ada yang lolos duplikasi). Pada kasus ini ID properti bisa kita ekstrak dari URL.

```plain
Contoh:
https://www.rumah123.com/properti/bogor/hos15772001/

ID: hos15772001
```

Kita bisa menggunakan kode berikut untuk mengekstrak bagian terakhir dari URL.

```python
def extract_id(self, response):
  return os.path.basename(os.path.normpath(response.url))
```

Fungsi `os.path.normpath` akan menormalisasi URL dengan menghapus karakter "/" terakhir pada URL dan fungsi `os.path.basename` akan mengembalikan segmen URL terakhir yang merupakan ID properti.

#### Ekstrak Harga

```python
def extract_price(self, response):
  # ekstrak harga, contoh: "Rp 2,7 Miliar"
  price = response.xpath(
    "//div[@class='r123-listing-summary__price']/span/text()"
  ).get()

  # memecah harga berdasarkan spasi menjadi ["Rp", "2,7", "Miliar"]
  components = price.split(" ")

  # mengambil unsur
  unit = components[2].lower()
  price = float(components[1].replace(",", ""))

  # check unit
  if "miliar" in unit:
    return price * 1000
  elif "juta" in unit:
    return price
  else:
    # jika tidak ditemukan satuannya, return None
    return None
```

![DevTools ekstraksi harga](https://assets.kodesiana.com/posts/2024/scraping/extract_harga_comp.png)

> Lokasi elemen yang mengandung harga. Sumber: Penulis.

Proses ekstraksi data harga terdiri atas tiga tahap,

1. Mengekstrak harga menggunakan XPath, dari sini kita akan mendapatkan informasi harga berupa teks, misalnya "Rp 2,7 Miliar"
2. Memecah teks berdasarkan spasi, kemudian mengambil nilai dan satuannya (miliar/juta)
3. Mengonversi `string` menjadi `float` dan mengalikan dengan 1000 jika satuannya adalah miliar agar satuannya menjadi juta

#### Ekstrak Cicilan

```python
def extract_installment(self, response):
  # ekstrak elemen cicilan, contoh: "Cicilan: 12 Jutaan per bulan"
  installment_per_month = response.xpath(
    "//div[@class='r123-listing-summary__installment']/text()"
  ).get()

  # jika tidak ditemukan cicilan, return None
  if len(installment_per_month) == 0:
    return None

  # ambil angka dari teks menggunakan Regex
  return float(re.findall(r"\d+", installment_per_month)[0])
```

Proses ekstrak nilai cicilan ini tidak jauh berbeda dengan proses ekstrak harga properti, perbedaannya pada kasus ini kita punya informasi tambahan yaitu cicilan selalu dalam satuan juta, sehingga tidak perlu melakukan konversi skala satuan.

Selain itu, pada kasus ini juga nilai cicilan selalu dalam bentuk bilangan bulat, maka dari itu kita bisa menggunakan *regular expression (regex)* untuk memilih angka pada teks (`\d` artinya pilih semua digit/angka dan `+` artinya satu atau lebih karakter).

#### Ekstrak Gambar Properti

```python
def extract_images(self, response):
  for current_src in response.xpath("//img/@src").getall():
    if "/customer/" in current_src:
      yield current_src
```

Proses ekstraksi gambar dapat dilakukan dengan mudah juga, kita cukup mencari semua elemen `<img>` dan mengambil nilai atribut `src`. Tetapi tidak semua gambar perlu kita simpan karena gambar pada laman *website* bisa berupa logo, ikon, maupun gambar lain yang tidak relevan.

Maka dari itu kita akan memilih hanya gambar yang memiliki kata "customer" pada URL nya saja yang akan kita simpan.

#### Ekstrak Alamat

```python
def extract_address(self, response):
  return response.xpath(
      "//div[@class='r123-listing-summary__header-container-address']/text()"
  ).get()
```

Proses ekstraksi alamat dapat dilakukan dengan satu XPath saja.

#### Ekstrak *Overview/Tags*

```python
def extract_tags(self, response):
  tags = response.xpath("//div[@class='ui-listing-overview__badge-wrapper']/div/div/text()").getall()
  return [f.strip() for f in tags]
```

Proses ekstraksi *overview* atau *tags* juga dapat dilakukan dengan sangat mudah menggunakan XPath. Pada kasus ini kita juga akan menggunakan *list comprehension* untuk menghilangkan spasi di awal maupun di akhir teks menggunakan fungsi `strip()`.

#### Ekstrak Deskripsi

```python
def extract_description(self, response):
  # mengambil elemen p yang berisi kumpulan deskripsi
  desc_div = response.xpath(
    "//p[@class='listing-description-v2__title']/following-sibling::div/div/div/div/text()"
  ).getall()

  # jika tidak ada deskripsi, return None
  if len(desc_div) == 0:
    return None

  # gabungkan semua baris deskripsi menjadi satu string
  return "\n".join(desc_div)
```

Pada proses ekstraksi deskripsi ini kita akan menggunakan fungsi `following-sibling`, gunanya adalah kita ingin memilih elemen yang merupakan *sibling* atau bersebelahan dengan elemen yang dipilih.

Contoh:

```html
<p class="listing-description-v2__title">Deskripsi</p>
<div class="block relative ui-molecules-toggle">
  <div style="max-height:75px" class="ui-molecules-toggle__content relative">
    <div>
      <div
        style="line-height:24px;white-space:pre-line;word-break:break-word;color:#0d1a35;font-weight:400;text-align:justify"
        class="ui-atomic-text ui-atomic-text--styling-default ui-atomic-text--typeface-primary content-wrapper">Hallo
        Bp/Ibu,<br>Kami dari rumahbaru Bogor Raya <br>Specialis :<br>-Bogor Raya<br>-Summarecon Bogor<br>-Sentul
        City<br>-Bogor Nirvana Residence<br>-Bogor Selatan<br>-Bogor Barat<br>-Sukaraja <br><br>#WTS #Dijual<br>Bisa
        KPR Bank, Dibantu sampai Approved<br><br>Lokasi : @Summarecon Bogor<br>Dekat Tol JOGORAWI / Akses Langsung
        Dari Tol Ke Lokasi<br>Dekat Summarecon Mall Bogor<br>Dekat Pasar Modern Summarecon Bogor<br>Dekat FNB
        Summarecon Bogor<br>Dekat Aeon Mall<br>Dekat EMC Hospital<br>Dekat Kota Bogor<br>Dekat Tempat
        Wisata<br><br>Tanpa Diundi Langsung Pilih &amp; Booking<br>Proses KPR Bank dibantu sampai
        Akad<br><br>Rumahbaru Bogor Raya<br>Jual | Beli | Sewa | KPR Specialist</div>
    </div><button class="listing-description-v2__button">Tanya lebih lanjut</button>
  </div>
  <div role="button" tabindex="0" class="relative ui-molecules-toggle__selector ui-molecules-toggle__selector--bottom">
    <div class="ui-molecules-expand-text__toggle flex" style="margin-top: 20px;"><span
        class="ui-atomic-text ui-atomic-text--styling-heading-6 ui-atomic-text--typeface-primary"
        style="color: rgb(41, 81, 163); font-weight: 500; text-align: left;">Muat lebih banyak</span><i
        class="rui-icon ui-atomic-icon rui-icon-arrow-down-small"
        style="color: rgb(41, 81, 163); font-size: 16px; height: 16px; margin-left: 5px;"></i></div>
  </div>
</div>
```

Sintaks XPath `//p[@class='listing-description-v2__title']/following-sibling::div/div/div/div/text()` akan memilih elemen `<p class="listing-description-v2__title">Deskripsi</p>` sebagai acuan dan `following-sibling` akan memilih teks pada elemen `div/div/div/div` yang berisi teks deskripsi.

Karena elemen-elemen dalam tag `<div>` ini dipisahkan oleh tag `<br>`, maka `scrapy` akan memilih setiap teks dalam elemen `<div>` dan kita perlu menyatukan kembali teksnya menggunakan fungsi `join()`. Tag `<br>` berarti *break* atau alinea baru pada paragraf.

#### Ekstrak Spesifikasi Properti

```python
def extract_specs(self, response):
  # get all specs
  specs_div = response.xpath("//div[@class='listing-specification-v2__item']")

  # extract all facilities
  specs = {}
  for spec in specs_div:
    # get the row
    row = spec.xpath("./span/text()").getall()
    if len(row) != 0:
      continue

    # get the key and value
    specs[row[0]] = row[1]

  # return all facilities
  return specs
```

Proses ekstraksi spesifikasi properti ini sedikit lebih kompleks karena kita akan menggunakan dua selector berbeda untuk mengekstrak data spesifikasi. Spesifikasi properti pada laman terdapat dalam bentuk tabel atau spesifiknya *key-value*, misalnya kamar tidur=3.

Tahap pertama adalah melakukan pemilihan elemen menggunakan XPath `//div[@class='listing-specification-v2__item']` untuk mengambil semua `<div>` yang mengandung spesifikasi. Kemudian XPath kedua `./span/text()` digunakan untuk mengambil data di dalam `<span>` dan kemudian teks tersebut dimasukkan ke dalam `dict` dengan *key* adalah indeks pertama dan *value* adalah indeks kedua.

#### Ekstrak Fasilitas

```python
def extract_facilities(self, response):
  # get all facilities
  facilities = response.xpath("//div[@class='ui-facilities-portal-dialog__item']/span/text()").getall() + \
                response.xpath("//div[@class='ui-facilities-portal__item']/span/text()").getall()

  # return all facilities
  return [f.strip() for f in facilities]
```

Proses ekstraksi ini dilakukan dua kali karena ternyata Rumah123 memiliki dua versi laman yang berbeda. Karena adanya dua versi `<div>` maka kita perlu melakukan *scraping* menggunakan dua XPath. Karena nilai kembalian dari fungsi `getall()` adalah `list`, kita bisa menggunakan operator `+` untuk menggabungkan kedua hasil *scraping*.

#### Ekstrak Agen Properti

```python
def extract_property_agent(self, response):
  # get host URL
  base_url = '{uri.scheme}://{uri.netloc}'.format(uri=urlparse(response.url))

  # to store the agent data
  agent = {}

  # extract property agent
  agent_elem = response.xpath(
    "//a[@class='r123o-m-listing-inquiry__wrapper-agent']"
  )

  if len(agent_elem) != 0:
    agent["name"] = agent_elem.xpath("./@title").get().strip()
    agent["url"] = urljoin(base_url, agent_elem.xpath("./@href").get().strip())

  # extract phone
  agent_phone = response.xpath(
    "//a[contains(@class, 'ui-organism-listing-inquiry-r123__phone-button')]/@value"
  ).get()

  if agent_phone is not None:
      agent["phone"] = agent_phone.strip()

  # extract agent company
  company_elem = response.xpath(
    "//a[@class='r123o-m-listing-inquiry__wrapper-organization']"
  )

  if len(company_elem) != 0:
      agent["company"] = {
          "name": company_elem.xpath("./@title").get().strip(),
          "url": urljoin(base_url, company_elem.xpath("./@href").get().strip()),
      }

  # return agent
  return agent
```

Bagian ini adalah bagian yang paling kompleks karena kita ingin mengekstrak banyak informasi dalam satu fungsi.

Tahap pertama adalah mengekstrak informasi *host*, di sini kita menggunakan `urlparse` untuk membuat *host*. Tahap selanjutnya adalah menggunakan XPath untuk mencari elemen `<a>` yang mengandung informasi agen. Jika elemen ditemukan, tahap selanjutnya adalah menggunakan XPath pada elemen tadi untuk mengekstrak nama dan URL ke agen tersebut.

Setelah nama agen didapatkan, selanjutnya kita akan mengekstrak informasi kontak nomor telepon. Setelah itu, kita bisa menggunakan metode yang sama seperti sebelumnya untuk mengekstrak informasi perusahaan manajer properti.

#### Ekstrak Waktu Pemutakhiran Data Properti

```python
MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei",
    "Juni", "Juli", "Agustus", "September", "Oktober",
    "November", "Desember"
]

def extract_last_modified(self, response):
  # get the last modified div
  last_modified = response.xpath(
      '//div[@class="r123-listing-summary__header-container-updated"]/text()[2]'
  ).get()

  # parse as date
  date_parts = last_modified.split(" ")
  date_parts[1] = str(MONTHS.index(date_parts[1]) + 1)

  return datetime.datetime.strptime(" ".join(date_parts), "%d %m %Y")
```

Bagian ini adalah data terakhir yang akan kita ekstrak yaitu tanggal perubahan terakhir dari informasi properti ini. Secara umum proses yang dilakukan untuk mengekstrak informasi ini sama seperti proses *scraping* sebelumnya, perbedaannya adalah kita melakukan konversi nama bulan menjadi angka dan kemudian menggunakan fungsi `strptime` untuk mengubah tanggal tadi menjadi objek `DateTime`.

Akhirnya kita sudah selesai membuat *scraper* Rumah123.com😁 Prosesnya sangat panjang tetapi akhirnya kita bisa mendapatkan data yang kita perlukan. Selanjutnya kita akan coba untuk menjalankan *scraper* yang sudah kita buat untuk mengunduh data properti di daerah Bogor.

### Menjalankan Spider💾

Setelah kita membuat *scraper* kita bisa mulai melakukan *scraping* dan mengunduh data *listing* properti ke komputer kita. Pastikan teman-teman sudah mengikuti semua tutorial di atas dan kode *scraping* sudah lengkap (teman-teman juga bisa mengakses kode *scraping* pada GitHub di bagian awal artikel).

Untuk menjalankan proses *scraping*, buka *terminal* pada lokasi proyek `scrapy`, kemudian jalankan perintah berikut.

```bash
$ scrapy crawl rumah123

2024-01-20 18:33:22 [scrapy.utils.log] INFO: Scrapy 2.11.0 started (bot: harga_rumah)
2024-01-20 18:33:22 [scrapy.utils.log] INFO: Versions: lxml 4.9.3.0, libxml2 2.11.6, cssselect 1.2.0, parsel 1.8.1, w3lib 2.1.2, Twisted 22.10.0, Python 3.11.7 | packaged by conda-forge | (main, Dec 15 2023, 08:38:37) [GCC 12.3.0], pyOpenSSL 23.3.0 (OpenSSL 3.2.0 23 Nov 2023), cryptography 41.0.7, Platform Linux-5.15.133.1-microsoft-standard-WSL2-x86_64-with-glibc2.35
2024-01-20 18:33:22 [scrapy.addons] INFO: Enabled addons:
[]
2024-01-20 18:33:22 [asyncio] DEBUG: Using selector: EpollSelector
2024-01-20 18:33:22 [scrapy.utils.log] DEBUG: Using reactor: twisted.internet.asyncioreactor.AsyncioSelectorReactor
2024-01-20 18:33:22 [scrapy.utils.log] DEBUG: Using asyncio event loop: asyncio.unix_events._UnixSelectorEventLoop
2024-01-20 18:33:22 [scrapy.extensions.telnet] INFO: Telnet Password: 2c090074765f245c
...
2024-01-20 18:33:22 [scrapy.core.engine] INFO: Spider opened
2024-01-20 18:33:22 [scrapy.core.scheduler] INFO: Resuming crawl (10 requests scheduled)
2024-01-20 18:33:22 [scrapy.extensions.logstats] INFO: Crawled 0 pages (at 0 pages/min), scraped 0 items (at 0 items/min)
2024-01-20 18:33:22 [scrapy.extensions.telnet] INFO: Telnet console listening on 127.0.0.1:6023
2024-01-20 18:33:23 [scrapy.core.engine] DEBUG: Crawled (200) <GET https://www.rumah123.com/robots.txt> (referer: None)
2024-01-20 18:33:29 [scrapy.core.engine] DEBUG: Crawled (200) <GET https://www.rumah123.com/properti/bogor/hos10692294/> (referer: https://www.rumah123.com/jual/bogor/rumah/?page=297)
2024-01-20 18:33:29 [scrapy.core.scraper] DEBUG: Scraped from <200 https://www.rumah123.com/properti/bogor/hos10692294/>
{'id': 'hos10692294', 'price': 350.0, 'installment': 1.0, 'address': 'Caringin, Bogor', 'tags': [], 'description': 'Hunian Kekinian Modern Griya Lestari Tanpa DP Cukup 3 Juta All in Sampai Akad\nCiderum,Caringin, Bogor\nLuas Tanah 77\nLuas Bangunan 43\nKamar tidur : 2\nKamar Mandi : 1\nHarga :350 Juta \nlistrik : 1300\nMilikilah Segera sebelum kehabisan\nUntuk Informasi \nHub : +62 812-8800-7xxx', 'specs': {'Kamar Tidur': '2', 'Kamar Mandi': '1', 'Luas Tanah': '77 m²', 'Luas Bangunan': '43 m²', 'Tipe Properti': 'Rumah', 'Sertifikat': 'SHM - Sertifikat Hak Milik', 'Daya Listrik': '1300 Watt', 'Kondisi Perabotan': 'Furnished', 'Garasi': '1', 'Jumlah Lantai': '1', 'Tahun Dibangun': '2021', 'Kondisi Properti': 'Baru', 'ID Iklan': 'hos10692294'}, 'facilities': ['Keamanan', 'Masjid', 'Taman'], 'agent': {'name': 'bayu  septiana', 'url': 'https://www.rumah123.com/agen-properti/independent-property-agent/bayu-septiana-1180815/', 'phone': '+6281388113771'}, 'images': ['https://picture.rumah123.com/r123-images/720x420-crop/customer/1180815/2022-07-23-11-43-07-cd02b9e0-da58-4cf7-b070-37d8ce69addb.jpg', 'https://picture.rumah123.com/r123-images/360x401-inside/customer/1180815/2022-07-23-11-42-54-3f4c36fc-6eec-4a7f-b15e-dc7b31901a37.jpg', 'https://picture.rumah123.com/r123-images/360x401-inside/customer/1180815/2022-07-23-11-42-58-43c4d05b-6191-46a6-9cdb-64a729988ac6.jpg', 'https://picture.rumah123.com/r123-images/360x401-inside/customer/1180815/2022-07-23-11-42-59-044e1731-cfe0-471f-9c52-63699e58d3b3.jpg', 'https://picture.rumah123.com/r123-images/360x401-inside/customer/1180815/2022-07-23-11-43-00-e8e45da8-c906-4fdc-b26c-a53e3c110f29.jpg'], 'url': 'https://www.rumah123.com/properti/bogor/hos10692294/', 'last_modified': '2024-01-04T00:00:00', 'scraped_at': '2024-01-20T18:33:29.506614'}
2024-01-20 18:33:29 [scrapy.dupefilters] DEBUG: Filtered duplicate request: <GET https://www.rumah123.com/properti/bogor/hos10692294/#top> - no more duplicates will be shown (see DUPEFILTER_DEBUG to show all duplicates)
...
```

Setelah teman-teman mengeksekusi perintah di atas, teman-teman akan mendapatkan file `rumah123.json` di folder yang sama dengan proyek *scraper*. Jika teman-teman tekan CTRL+C maka proses *scraping* akan berhenti dan teman-teman bisa melihat hasil *scraping*-nya.

Sampai di sini teman-teman mungkin menyadari satu hal yaitu proses *scraping* dilakukan dengan **sangat lambat**. Hal ini memang dilakukan dengan sengaja, ingat pada bagian konfigurasi kita hanya mengunakan `CONCURRENT_REQUESTS = 1` dan `DOWNLOAD_DELAY = 3` yang berarti setiap kali satu proses *scraping* selesai, `scrapy` akan menunggu selama tiga detik sebelum melanjutkan proses *scraping*.

Tapi kenapa harus begitu?

## Melakukan Scraping secara Masif📈

Pada pembahasan sebelumnya kita sudah berhasil menjalankan proses *scraping* dan mendapatkan sedikit data pada file JSON, tetapi proses *scraping* tersebut berjalan dengan sangat lambat dan tentunya untuk *website* yang bersifat masif, lambatnya proses *scraping* ini akan menjadi penghalang untuk kita bisa mendapatkan data yang kita butuhkan. Selain itu penulis juga menyatakan bahwa proses lambat tersebut memang sengaja, tapi kenapa?

### *Resumable Jobs*⏯️

Pada contoh sebelumnya kita bisa mengentikan proses *scraping* dengan cara menekan CTRL+C pada *terminal*. Kemudian jika kita ingin melanjutkan proses *scraping*, kita bisa menjalankan perintah yang sama yaitu `scrapy crawl rumah123`. Tapi tunggu dulu, jika kita perhatikan ketika kita menjalankan perintah yang sama, `scrapy` akan mengulang proses *scraping* dari awal dan tidak melanjutkan proses *scraping* terakhir.

Hal ini tentu merepotkan jika kita ingin melakukan *scraping* dari *website* dengan data yang banyak. Seperti pada kasus ini Rumah123 memiliki hingga 1000 halaman *listing*, jika dalam satu halaman ada 10 properti, artinya Rumah123 memiliki 10.000 properti. Karena proses *scraping* dapat memakan waktu yang lama, kita ingin agar proses *scraping* ini dapat dihentikan dan dilanjutkan kapanpun.

Untungnya `scrapy` mendukung proses seperti ini! Daripada menggunakan perintah `scrapy crawl rumah123`, kita bisa menggunakan perintah:

```bash
scrapy crawl rumah123 -s JOBDIR=crawls/rumah123
```

Argumen `-s JOBDIR=crawls/rumah123` berfungsi untuk memerintahkan `scrapy` untuk menggunakan sistem *jobs* dan menyimpan informasi *crawl* ke dalam folder `crawls/rumah123` ketika proses *scraping* dihentikan menggunakan tombol CTRL+C. Ketika kita ingin melanjutkan proses *scraping*, kita bisa menggunakan perintah yang sama untuk melanjutkan proses *scraping* dan kita tidak akan mendapatkan data duplikat pada hasil output JSON.

### CAPTCHA🤖

CAPTCHA pasti sudah tidak asing lagi bagi teman-teman, sering kali ketika kita melakukan pendaftaran, *login*, atau berkomentar ke sebuah *web app* kita akan diminta untuk melakukan verifikasi CAPTCHA. Salah satu bentuk CAPTCHA yang sering kita kenal adalah reCAPTCHA milik Google yang mengharuskan kita untuk memilih foto yang berisi lampu lalu lintas, sepeda, atau mobil. Tetapi apakah teman-teman tahu apa alasan banyak *website* menggunakan CAPTCHA?

CAPTCHA memiliki kepanjangan *Completely Automated Public Turing test to tell Computers and Humans Apart*. Dari kepanjangannya saja sudah jelas bahwa tujuan dari CAPTCHA ini adalah untuk membedakan mana *traffic* yang masuk ke *website* merupakan aktivitas manusia atau aktivitas komputer.

Kenapa hal ini perlu kita ketahui ketika membuat sebuah *web scraper*?

Karena sebagai pemilik *website*, kita tentunya tidak mau ada yang melakukan *abuse* pada sistem misalnya melakukan *spamming* dengan mengirim banyak komentar terus-menerus atau memberikan *rating* yang banyak untuk meningkatkan visibilitas suatu barang di *marketplace*.

{{< unsplash "photo-1684862030284-6b24307ebd4a" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzI4OTYyMDM0fA" "Photo by Karen Grigorean on Unsplash" "a person pointing at a large display of pictures" >}}

Hubungan CAPTCHA dengan *web scraping* adalah proses *web scraping* merupakan aktivitas *bot* yang berarti kemungkinan besar *scraper* yang sudah kita buat tadi akan diblokir oleh *website* melalui fungsi *firewall*. Biasanya aktivitas *scraping* sangat mudah dideteksi dan ditanggulangi bagi pemilik *website*, cukup dengan mengintegrasikan layanan seperti CloudFlare maka *website* tersebut akan terlindungi dari *bot* dan *scraper* yang secara umum bisa mengakses ratusan halaman dalam hitungan menit.

Inilah salah satu pembeda antara *traffic* dari manusia/*user* dan *bot*, *traffic* yang dihasilkan oleh manusia biasanya lambat, kita tidak mungkin membuka 100 halaman dalam waktu satu menit dan lanjut buka 100 halaman selanjutnya kan? Maka dari itu pada artikel ini penulis menggunakan *concurrency* yang rendah untuk menghindari munculnya CAPTCHA pada proses *scraping*.

```plain
2024-01-14 14:03:34 [scrapy.core.engine] DEBUG: Crawled (200) <GET https://www.rumah123.com/robots.txt> (referer: None)
2024-01-14 14:03:36 [scrapy.core.engine] DEBUG: Crawled (200) <GET https://www.rumah123.com/jual/bogor/rumah/?page=1> (referer: None)
2024-01-14 14:03:36 [scrapy.core.engine] DEBUG: Crawled (200) <GET https://www.rumah123.com/jual/bogor/rumah/?page=6> (referer: None)
.
.
.
2024-01-14 14:03:44 [scrapy.downloadermiddlewares.retry] DEBUG: Retrying <GET https://www.rumah123.com/properti/bogor/hos15094743/> (failed 1 times): 429 Unknown Status
2024-01-14 14:03:44 [scrapy.downloadermiddlewares.retry] DEBUG: Retrying <GET https://www.rumah123.com/properti/bogor/hos15094603/> (failed 1 times): 429 Unknown Status
2024-01-14 14:03:44 [scrapy.downloadermiddlewares.retry] DEBUG: Retrying <GET https://www.rumah123.com/properti/bogor/hos13674939/> (failed 1 times): 429 Unknown Status
```

> Contoh blokir yang dilakukan oleh Rumah123 jika terdeteksi *traffic* yang terlalu cepat (HTTP 429 Too Many Request). Sumber: Penulis.

Selain dengan menggunakan level *concurrency* yang rendah, kita juga sudah mengimplementasikan `AutoThrottle`, plugin ini berfungsi untuk melambatkan proses *scraping* jika didapatkan server memblokir akses. Tentu cara ini merupakan cara yang naif karena bisa saja IP kita di blokir meskipun sudah menggunakan *concurrency* yang rendah. Maka dari itu ada banyak cara lain misalnya menggunakan *proxy*, memutar *User-Agent*, dan teknik-teknik lain untuk menghindari proteksi *website* terhadap *web scraping*. Mengenai detailnya teman-teman bisa cari mengenai trik-trik tersebut di Google ya!

> tl;dr; gunakan *concurrency* yang rendah (1-2 item per detik) dan juga gunakan VPN untuk menghindari IP kita diblokir oleh *website* tujuan. Selain itu kita juga bisa menggunakan layanan seperti [Zyte](https://www.zyte.com/) atau menggunakan rotasi *proxy*.

### *Dynamic JS Content* ⏳

Sebelum kita membahas mengenai *dynamic JS content*, kita perlu tau bagaimana *website* modern bekerja. Kebanyakan *website* sebelum tahun 2010 umumnya menggunakan server PHP dan proses *rendering* atau pembuatan struktur *website* terjadi di sisi server (disebut juga *server side rendering (SSR)*).

Seiring perkembangan zaman, banyak *website* mulai mengimplementasikan *client side rendering (CSR)* yaitu teknik untuk membuat struktur halaman di sisi klien menggunakan JavaScript. Pada pembahasan awal kita tahu bahwa HTML menyatakan struktur *website* dan struktur tersebut diekspresikan sebagai *Domain Object Model (DOM)*. Apa jadinya jika struktur tersebut tidak tersedia tetapi dibuat secara dinamis pada klien?

Scrapy tentunya tidak akan bisa melakukan *scraping* karena tidak ada DOM yang bisa dicari karena `scrapy` tidak memiliki fitur untuk mengeksekusi kode JavaScript untuk menghasilkan konten dinamis seperti halnya peramban/*browser*.

Solusinya adalah `scrapy` memiliki integrasi ke dua *library* untuk menghasilkan output halaman dinamis tersebut. Solusi pertama adalah menggunakan *library* `scrapy-splash` untuk melakukan *pre-rendering* atau dengan menggunakan *headless browser* dengan *library* `scrapy-playwright`. Teman-teman bisa mempelajari mengenai dua *library* ini pada dokumentasi Scrapy.

Tapi tenang saja teman-teman, sebagian besar *website* masih mengadopsi SSR, hanya sedikit *website* yang sudah beralih ke CSR. Jika teman-teman tidak yakin perlu menggunakan teknik *pre-rendering* atau tidak, coba gunakan *scrapy shell* untuk melakukan percobaan apakah *website* yang dituju menggunakan SSR atau CSR.

## Penutup👓

Wah panjang sekali ya perjalanan kita untuk membuat satu *web scraper*🥲

Kita sudah belajar mengenai bagaimana sebuah *website* dapat dibangun menggunakan HTML, CSS, dan JS dan bagaimana kita bisa memanipulasi *Document Object Model (DOM)* menggunakan XPath dan *CSS selector* untuk memilih elemen-elemen HTML yang mengandung data untuk kita *scraping*.

Selain itu kita sudah belajar menggunakan `scrapy` untuk dapat membuat sebuah *web scraper* Rumah123 dan menyimpan data properti rumah di daerah Bogor. Kita juga sudah membahas bagaimana cara melakukan *scraping* secara masif dengan menggunakan *resumable jobs* dan kendala yang bisa kita temui seperti CAPTCHA dan *dynamic JS content*.

Sampai di sini dulu perjalanan kita, di artikel selanjutnya kita akan menggunakan dataset yang sudah kita kumpulkan melalui *scraping* ini untuk melakukan prediksi harga rumah.

Stay tuned!

## Referensi📚

1. “Getting started with the web - Learn web development | MDN.” Diakses: 14 Januari 2024. [Daring]. Tersedia pada: https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web
2. “CSS Selectors Reference.” Diakses: 14 Januari 2024. [Daring]. Tersedia pada: https://www.w3schools.com/cssref/css_selectors.php
3. “CSS selectors - Learn web development | MDN.” Diakses: 14 Januari 2024. [Daring]. Tersedia pada: https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors
4. “XPath Syntax.” Diakses: 14 Januari 2024. [Daring]. Tersedia pada: https://www.w3schools.com/xml/xpath_syntax.asp
5. “Scrapy | A Fast and Powerful Scraping and Web Crawling Framework.” Diakses: 14 Januari 2024. [Daring]. Tersedia pada: https://scrapy.org/
6. F. Noor Fiqri, “Pemodelan Daerah Potensial Pertanian di Indonesia sebagai Usaha Restorasi Ekonomi pada Masa Pandemi COVID-19 menggunakan Metode Hierarchical Clustering.” Zenodo, September 2020. doi: 10.5281/zenodo.10526308.
7. “Scrapy 2.11 documentation — Scrapy 2.11.0 documentation.” Diakses: 20 Januari 2024. [Daring]. Tersedia pada: https://docs.scrapy.org/en/latest/
