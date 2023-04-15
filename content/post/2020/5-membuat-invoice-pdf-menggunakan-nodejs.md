---
title: Membuat Invoice PDF menggunakan NodeJS📄
category: Programming
tags: [nodejs, tutorial, tips]
date: 2020-09-22
slug: membuat-invoice-pdf-menggunakan-nodejs
---

> Source code: <https://github.com/Kodesiana/Artikel/tree/master/2020/nodejs-invoice-pdf>

Invoice PDF merupakan salah satu hal yang paling sering dihadapi saat membuat sebuah sistem informasi seperti aplikasi
*point of sale*, peminjaman perpustakaan, laporan keuangan, dan lain-lain. Meskipun terlihat sederhana, ternyata proses
pembuatan PDF ini membutuhkan tenaga ekstra untuk dapat diimplementasikan dengan sempurna dengan sistem kita.

Ternyata proses pembuatan PDF tidak semudah yang kita bayangkan. Jika kita bisa dengan mudah membuat PDF dengan cara
mengonversi file Word ke PDF, jika ingin dilakukan menggunakan program hal ini bisa jauh lebih sulit dilakukan.

![Gambar](https://source.unsplash.com/iJMitgqRaZ8/1200x657)

Hl ini karena fakta pembuatan PDF yang menurut kita mudah, ternyata prosesnya lebih rumit, tidak semudah membangun
website menggunakan HTML dan CSS.

Untuk membuat sebuah file PDF, setidaknya ada empat cara yang dapat dilakukan, yaitu:

- Menulis file sesuai spesifikasi PDF/A secara manual, pilihan ini tentunya sangat tidak efisien, karena kita harus
  mengolah struktur PDF secara manual melalui API tingkat rendahnya.
- Menggunakan konsep GDI, beberapa *library* menyediakan kemampuan untuk membuat PDF seperti Anda menggambar pada
  kanvas, misalnya *library* PdfSharp.
- Render web menjadi PDF, metode ini adalah cara yang paling cepat, seperti kita menyimpan sebuah web menjadi PDF pada
  browser.
- Menggunakan *library* berbayar, misalnya menggunakan Adobe Acrobat. Pilihan ini biasanya menjadi pilihan terakhir,
  karena, berbayar. Kita tidak mau pakai aplikasi bajakan di program kita😁 Support *developer*!

Pada tutorial ini kita akan menggunakan teknik ketiga, yaitu melakukan *render* halaman HTML menjadi PDF. Pada dasarnya
kita akan membuka file PDF ini pada browser kemudian menyimpannya sebagai PDF.

Tetapi daripada membuka sebuah browser lengkap dengan fitur tab dan menunya, kita akan menggunakan *headless browser*,
yaitu browser yang tidak menampilkan jendelanya dan untuk berinteraksi dengan browser tersebut dapat dilakukan
menggunakan protokol komunikasi yang didukung oleh browser tersebut (misalnya WebDriver Protocol).

## Puppeteer

*Puppeteer* merupakan *library* JavaScript yang menyediakan API untuk mengontrol aplikasi Chromium, bisa dibilang kamu
menggunakan Google Chrome tetapi melalui kode program.

![Gambar](https://source.unsplash.com/BbOXC95sxlE/1200x657)

Dengan menggunakan *library* ini kamu bisa melakukan hampir semua kegiatan yang bisa kamu lakukan pada Chrome, membuat
tab baru, pergi ke URL, melakukan *scraping* data, dan tentunya, menyimpan halaman sebagai PDF.

**Notes!** Selain *puppeteer*, penulis juga biasa menggunakan Selenium WebDriver. Chromium adalah versi Chrome yang
tidak memiliki integrasi dengan layanan Google (proyek sumber dari Chrome). Puppeteer akan mengunduh Chromium secara
otomatis sebagai *optional dependecies* saat kamu melakukan **npm install**.

### Membuat package.json

Buka terminal (cmd, pwsh, bash, sh, atau apa pun yang kamu suka), kemudian buat sebuah folder baru. Misalnya
`D:\coba-pdf`.

Buat package.js dengan cara mengeksekusi *npm init -y*.

Install *puppeteer* dan *mustache* dengan cara mengeksekusi *npm install puppeteer mustache*.

![Init npm](https://blob.kodesiana.com/kodesiana-public-assets/posts/2020/5/image.png)

PowerShell 7 Core di Windows Terminal.

Selanjutnya buka editor kesayangan kamu, di sini penulis akan menggunakan Visual Studio Code.

### Membuat template invoice PDF

Buat sebuah file baru, beri nama halaman.html, kemudian ketik kode di bawah ini.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice</title>

    <style>
      .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        font-size: 16px;
        line-height: 24px;
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        color: #555;
      }

      .invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
      }

      .invoice-box table td {
        padding: 5px;
        vertical-align: top;
      }

      .invoice-box table tr td:nth-child(2) {
        text-align: right;
      }

      .invoice-box table tr.top table td {
        padding-bottom: 20px;
      }

      .invoice-box table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
      }

      .invoice-box table tr.information table td {
        padding-bottom: 40px;
      }

      .invoice-box table tr.heading td {
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
      }

      .invoice-box table tr.item td {
        border-bottom: 1px solid #eee;
      }

      .invoice-box table tr.item.last td {
        border-bottom: none;
      }

      .invoice-box table tr.total td:nth-child(2) {
        border-top: 2px solid #eee;
        font-weight: bold;
      }
    </style>
  </head>

  <body>
    <div class="invoice-box">
      <table cellpadding="0" cellspacing="0">
        <tr class="top">
          <td colspan="2">
            <table>
              <tr>
                <td class="title">
                  <img src="https://www.sparksuite.com/images/logo.png" style="width:100%; max-width:300px;" />
                </td>

                <td>
                  Invoice #: {{nomor}}<br />
                  Tanggal: {{tanggal}}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr class="information">
          <td colspan="2">
            <table>
              <tr>
                <td>{{alamat}}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr class="heading">
          <td>Metode Pembayaran</td>
          <td>Jumlah</td>
        </tr>

        {{#pembayaran}}
        <tr class="item">
          <td>{{metode}}</td>
          <td>{{jumlah}}</td>
        </tr>
        {{/pembayaran}}

        <tr class="heading">
          <td>Barang</td>
          <td>Harga</td>
        </tr>

        {{#barang}}
        <tr class="item">
          <td>{{item}}</td>
          <td>{{harga}}</td>
        </tr>
        {{/barang}}

        <tr class="total">
          <td></td>
          <td>Total: {{total}}</td>
        </tr>
      </table>
    </div>
  </body>
</html>
```

Kode dikutip dari: https://github.com/sparksuite/simple-html-invoice-template.
Setelah kamu membuat file ini, kamu bisa buka file ini untuk melihat contoh invoice yang akan dibuat.

Bagian kode yang ditandai merupakan sintak dari *library* [mustache](https://www.npmjs.com/package/mustache). Anda bisa
mengubah data-data yang nantinya akan muncul pada invoice Anda dengan menggunakan *template* ini.

### Membuat fungsi pembuatan invoice PDF

Selanjutnya, buat file *index.js*, kemudian ketikan kode berikut.

```js
const fs = require('fs');
const puppeteer = require('puppeteer');
const mustache = require('mustache');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlBody = fs.readFileSync('./halaman.html', 'utf-8');
  const data = {
    nomor: 112,
    tanggal: '21 September 2020',
    alamat: 'Bogor, Jawa Barat',
    pembayaran: [{ metode: 'Tunai', jumlah: 'Rp2.000.000' }],
    barang: [
      { item: 'nVidia GeForce 3090 RTX', harga: 'Rp1.000.000' },
      { item: 'AMD Ryzen 7', harga: 'Rp1.000.000' },
    ],
    total: 'Rp2.000.000',
  };

  await page.setContent(mustache.render(htmlBody, data));
  const pdf = await page.pdf({ format: 'A4' });
  fs.writeFileSync('./invoice.pdf', pdf);

  page.close();
  browser.close();
})();
```

Kode di atas pada dasarnya akan melakukan beberapa proses berikut:

1. Membuat jendela Chromium baru.
2. Membuat tab baru.
3. Membaca template HTML, kemudian me-*render* isinya dengan data.
4. Mengubah *body* tab yang dibuka dengan HTML yang telah di render.
5. Menyimpan tab sebagai PDF (*Buffer*).
6. Menyimpan *buffer* sebagai file.
7. Menutup tab dan window.

Anda dapat mengubah template dan juga data yang Anda perlukan pada kode di atas. Sebagai contoh akan digunakan data
statis.

## Container dengan Docker

Jika Anda ingin menggunakan kode ini pada Docker, ada beberapa hal yang perlu Anda perhatikan. Karena kita menggunakan
teknik *headless browser*, maka kita harus memastikan bahwa browser tersebut bisa berjalan di dalam container.

![Gambar](https://source.unsplash.com/l93tk44HErI/1200x657)

Buat file Dockerfile seperti di bawah ini.

```docker
FROM node:12-buster-slim

WORKDIR /usr/src/app
RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux\_signing\_key.pub | apt-key add - \
     && sh -c 'echo "deb \[arch=amd64\] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/\* \
     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
     && chmod +x /usr/sbin/wait-for-it.sh

COPY package.json\* /usr/src/app/
RUN npm install
COPY . .

ENTRYPOINT ["node", "index.js"]
```

Dockerfile di atas berisi instruksi untuk menginstall *shared library* yang nantinya akan digunakan oleh *headless
browser* di *puppeteer*. Untuk informasi lebih lanjut, cek repositori puppeteer
[di sini](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker).

Ubah potongan kode pada file index.js menjadi:

```js
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});
```

Potongan kode di atas berfungsi untuk menonaktifkan mode *sandbox* dan penggunaan */dev/shm*. Setelah perubahan ini
selesai, Anda bisa mengeksekusi perintah berikut pada terminal untuk memulai *container*.

```bash
docker build -t coba-pdf:1.0 .
docker run -it -v D:/coba-pdf/output:/usr/src/app/output coba-pdf:1.0
```

> **Perhatian!** Gunakan *docker volume* atau *absolute path* saat menjalan kan *container* agar kamu bisa mengakses
> file PDF yang dibuat.

Akan lebih baik kalau proses ini juga menggunakan
[CI/CD](https://kodesiana.com/post/azure-devops-untuk-otomatisasi-project-kamu/) dan
[build script](https://kodesiana.com/post/cake-build-script-untuk-build-proyek-net/).

Pastikan Anda memberikan memori yang cukup untuk *container* ini. Penulis menyarankan memori setidaknya 512MB. Akan
lebih baik lagi jika Anda menggunakan *puppeteer* dalam mode *remote* sehingga *container* tidak perlu menjalankan
Chromium di dalamnya, tetapi ini akan menjadi bahasan di posting yang lain😁

## Aplikasi Web Pdtache

Untuk memudahkan kamu membuat invoice PDF, daripada harus membuat kode seperti di atas dan menyiapkan kontainer sendiri,
kamu bisa pakai aplikasi **Pdtache**. Aplikasi ini berupa *web app* yang dibuat menggunakan TypeScript dan NodeJS 12.

Aplikasi ini bisa membuat PDF dari template HTML baik dari URL file template atau dari *source* HTML nya langsung, hasil
PDF bisa disimpan ke Minio atau langsung diunduh. Pokoknya semua yang kamu butuhkan untuk membuat PDF dengan template
semuanya bisa dilakukan oleh aplikasi ini.

Aplikasi ini bersifat *open source* dan kamu bisa lihat *source code*\-nya di repositori GitHub penulis.

Repositori Pdtache: https://github.com/fahminlb33/Pdtache

Aplikasi ini selain bisa digunakan melalui *web*, kamu juga bisa membuat PDF melalui API yang disediakan oleh Pdtache.
Ikuti petunjuk pada dokumentasi API yang terdapat di repositori kode untuk informasi lebih lanjut.

## Wrapping It Up

Sampai di sini kamu sudah berhasil untuk membuat PDF dengan menggunakan *library puppeteer* dan *mustache*. Contoh ini
masih versi sederhana, dengan mengeksekusi *node* atau *docker* untuk menghasilkan satu file PDF.

Kamu dapat menggabungkan kode ini dengan menggunakan *library* seperti *express* dan *restify* untuk membuat REST API
yang dapat diakses untuk menghasilkan file PDF. Untuk mempermudah proses pembuatan PDF ini, kamu juga bisa menggunakan
*Pdtache* buatan penulis untuk memudahkan proses pembuatan PDF.

Semoga artikel kali ini bermanfaat untuk kamu! **#NgodingItuMudah**
