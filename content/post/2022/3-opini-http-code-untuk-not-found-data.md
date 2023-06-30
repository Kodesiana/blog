---
title: 'Opini: HTTP 404 atau 200 pada Kondisi Data Tidak Ditemukan💡'
categories: Programming
tags: [programming]
date: 2022-02-01
slug: opini-http-code-pada-kondisi-data-tidak-ditemukan
---

HTTP code merupakan salah satu komponen dasar yang wajib dipahami oleh developer khususnya saat membuat REST API.
Menurut RFC7231, terdapat sekitar 36 kode HTTP standar yang bisa dikembalikan oleh sebuah server, tetapi tidak menutup
kemungkinan apabila kita ingin mengirim kode lain sesuai keinginan kita. Dari sekian banyak kode HTTP yang tersedia,
kadang kita bingung untuk memilih kode mana yang benar secara semantik dan praktik, karena tidak semua tutorial yang ada
di internet memberikan penjelasan dibelakang penggunaan suatu metode saat pembuatan REST API.

## Mengenal Kode HTTP Standar

Sebelum kita lanjut, coba kita pahami kembali konsep dasar dari kode HTTP. Berdasarkan RFC7231, kode HTTP bisa kita bagi
menjadi lima kategori, yaitu:

- **Informational 1xx**, kode ini digunakan untuk menginformasikan status koneksi dan proses penyelesaian *request*
  sebelumnya sebelum *client* bisa mendapatkan hasil akhir dari *request* awalnya. Misal saat kita ingin terkoneksi
  menggunakan protokol WebSocket, *client* akan mengirimkan *request* awal kemudian *server* akan meminta *upgrade* dari
  HTTP ke protokol WebSocket menggunakan kode `101 Switching Protocols`.
- **Successful 2xx**, kode ini menunjukkan bahwa *request* dari *client* sudah diterima, dipahami, dan diproses oleh
  *server*. Misal kita membuka google.com dan servernya mengembalikan isi HTML dan `200 OK` yang menandakan bahwa
  *request* telah berhasil diproses oleh server.
- **Redirection 3xx**, kode ini digunakan oleh *server* untuk memberi tahu *client* bahwa *client* perlu melakukan aksi
  tambahan untuk menyelesaikan *request*. Misalnya kita membuka halaman profil Facebook, tetapi dalam kondisi tidak
  login. Maka *server* akan mengirimkan kode `301 Moved Permanently` yang akan diterima oleh *client* dan memindahkan
  kita ke halaman login.
- **Client Error 4xx**, kode ini digunakan untuk menandakan bahwa *client* sepertinya mengalami *error*. Misalnya jika
  server meminta *body* dalam format JSON tetapi *client* mengirim dalam format XML, maka *server* akan menolak
  *request* tersebut dengan kode `400 Bad Request` untuk menandakan bahwa terdapat kesalahan dari sisi *client* yaitu
  salah mengirim format pada *body*.
- **Server Error 5xx**, kode ini menandakan bahwa *server* mengalami kesalahan dan tidak dapat memproses *request* dari
  *client*. Kode ini biasanya digunakan untuk kasus-kasus yang berbau infrastruktur misalnya *service* sedang *down*
  tetapi *gateway* terbuka, sehingga *request* bisa masuk tapi *server* tidak dapat memprosesnya, akhirnya *server* akan
  memberikan kode `500 Internal Server Error`.

## Kenapa 404 menjadi "standar"?

Penulis juga penasaran, kenapa saat tidak ada data yang ditemukan, sebagian besar tutorial di internet menggunakan
kode 404. Apalagi bagi pemula yang baru belajar RESTful API, pemahaman ini akan langsung menjadi konsep dasar bahwa saat
data yang dicari tidak ditemukan, maka kembalikan 404. Hal ini tidak selalu benar dan juga tidak selalu salah, ada
beberapa kasus tertentu kapan kita harus menggunakan kode 404 ini.

Agar kita lebih paham, coba kita lihat definisi kode 404 dan 200 berdasarkan standar RFC.

> 6.3.1. 200 OK
>
> The 200 (OK) status code indicates that the request has succeeded. The payload sent in a 200 response depends on the
> request method. For the methods defined by this specification, the intended meaning of the payload can be summarized
> as:
>
> GET a representation of the target resource; ...*dipotong*...
>
> Aside from responses to CONNECT, a 200 response always has a payload, though an origin server MAY generate a payload
> body of zero length. If no payload is desired, an origin server ought to send 204 (No Content) instead. For CONNECT,
> no payload is allowed because the successful result is a tunnel, which begins immediately after the 200 response
> header section....
>
> 6.5.4. 404 Not Found
>
> The 404 (Not Found) status code indicates that the origin server did not find a current representation for the target
> resource or is not willing to disclose that one exists. A 404 status code does not indicate whether this lack of
> representation is temporary or permanent; the 410 (Gone) status code is preferred over 404 if the origin server knows,
> presumably through some configurable means, that the condition is likely to be permanent....

Nah kalau kita ambil simpulan dari penjelasan pada dokumen RFC di atas, secara umum kita akan menggunakan 404 jika data
tidak tersedia dan menggunakan 200 apabila terdapat data yang bisa dikembalikan oleh server. *Reasoning* seperti ini
sangat lazim karena kita tidak memahami penuh konsep dari kode HTTP seperti yang dijelaskan pada RFC.

Pernyataan *The 404 (Not Found) status code indicates that the origin server did not find a **current representation
for the target resource* ini agak rancu bagi developer. Yang dimaksud dari *current representation for the target
resource* pada konteks ini adalah respons yang diberikan oleh server kepada klien.

## Studi Kasus pada REST API

Misal kita punya sebuah REST API yang akan mengembalikan daftar TODO yang tersimpan dalam database dan sebuah API yang
digunakan untuk mengembalikan detail dari TODO berdasarkan ID nya.

```text
/api/v1/todos
/api/v1/todos/:id
```

Saat kita memanggil API pertama `/api/v1/todos`, terdapat beberapa skenario sebagai berikut.

1. Server tidak menemukan TODO yang tersimpan pada database. Artinya database memang tidak memiliki *record*, bukan
   terjadi kesalahan koneksi antara service dan database sehingga server tidak dapat memberikan respons.
2. Server menemukan data pada database dan mengembalikan record nya sebagai JSON.

Pada kasus pertama, apa kode HTTP yang tepat untuk digunakan?

Kita mungkin akan menggunakan kode 404, tetapi, berdasarkan konvensi RFC ada beberapa alternatif yang lebih tepat:

1. Apabila server tidak memiliki data tetapi server mengembalikan response JSON yang berisi penjelasan bahwa tidak ada
   data pada server, maka respons yang tepat adalah `HTTP 200 Success`, hal ini menunjukkan bahwa server paham dan
   berhasil memproses permintaan dari klien dan server juga tidak mengalami error pada saat memproses permintaan tadi
   (misal respons array kosong). Tidak ada data bukanlah error, melainkan kondisi yang normal.
2. Apabila server tidak memiliki data dan server tidak mengembalikan *response body*, maka kode yang tepat adalah
   `HTTP 204 No Content`, hal ini menandakan bahwa server sukses memproses permintaan dari klien tetapi tidak ada data
   yang bisa dikembalikan.

Nah pada dua kondisi di atas, kita bisa ambil simpulan bahwa penggunaan kode 404 bukanlah kode yang tepat untuk kondisi
di atas. Tetapi, ada skenario lain yang lebih tepat untuk menggunakan kode 404, yaitu pada API kedua.

Misalnya kita memanggil API `/api/v1/todos/my-todo1` dengan `my-todo1` adalah ID record yang ingin kita ambil.

1. Apabila terdapat record dengan ID tersebut pada database, maka kode yang tepat adalah `HTTP 200 OK`.
2. Apabila tidak terdapat record dengan ID tersebut pada database, maka kode yang tepat ada `HTTP 404 Not Found`.
   Kenapa? Hal ini karena representasi sebenarnya dari objek tersebut memang tidak ada dari sumber data dan server tidak
   dapat memproses permintaan tersebut. Skenario ini berbeda dengan pencarian, karena pada pencarian bisa saja tidak
   terdapat record karena filter tertentu, tetapi saat kita akan mengambil record berdasarkan suatu ID, maka kita
   mengharapkan adanya representasi tersebut pada database dan jika representasi tersebut tidak ada, maka dapat
   disimpulkan sistem tidak dapat memenuhi permintaan dari klien.
3. Apabila server masih menyimpan ID tersebut tetapi data tersebut sudah tidak valid atau ditandai telah dihapus (misal
   karena objek tersebut merupakan objek temporer dan sudah kadaluarsa) maka kode yang tepat adalah `HTTP 410 Gone`.
   Kode ini menandakan bahwa ID tersebut pernah ada dan valid, tetapi sekarang sudah tidak dapat digunakan karena server
   sudah membuangnya karena alasan tertentu. Misal pada kasus upload file yang bisa disambung, jika sesi upload sudah
   terlewat, maka server akan menghapus file upload temporernya dan klien harus mengulangi dari awal, tetapi server
   tetap menyimpan ID-nya untuk waktu yang lebih lama agar klien bisa memahami alasan kenapa ID tersebut sudah tidak
   ada.

Ternyata terdapat *reasoning* yang lebih kompleks ya tentang penggunaan kode HTTP ini😗

## Simpulan

Jika kita lihat berdasarkan komponen sebuah URL (Universal Resource Locator), maka kita bisa pecah URL dari API yang
kita miliki sebagai berikut.

`/api/v1/todos`

Pada kasus ini klien berhasil mengakses URL tersebut dan yang menjadi *resource* pada kasus ini selalu ada, yaitu
`todos`, sehingga penggunaan kode 404 menjadi kurang tepat.

Sedangkan ketika kita memanggil `/api/v1/todos/:id`, ada kemungkinan bahwa ID yang kita cari tidak ada, karena secara
representasi tidak ada *resource* pada URL tersebut, maka penggunaan kode 404 menjadi tepat.

Teman-teman bisa pelajari lebih lanjut mengenai penggunaan kode HTTP ini dengan cara mencoba beberapa API publik yang
bisa digunakan secara gratis atau menggunakan layanan seperti API Twitter, Google Cloud, GitHub, dan provider lain untuk
melihat bagaimana tiap-tiap provider merespons mengenai skenario yang sudah kita bahas di atas.

Jadi, apa kode HTTP yang menurut teman-teman cocok digunakan untuk beberapa skenario di atas?

Semoga artikel kali ini bisa menjadi referensi dan tambahan bacaan untuk mengembangkan skill kita masing-masing! Kalau
teman-teman ingin diskusi, bisa mention ke Twitter penulis di @fahminoorfiqri.

## Referensi

1. russcam. 2021.
   [How to avoid "GET unknown route" under transaction section](https://github.com/elastic/apm-agent-dotnet/issues/1261#issuecomment-822907709).
   Diakses pada 01 Februari 2022.
2. Fielding, R.. 2014.
   [Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content](https://datatracker.ietf.org/doc/html/rfc7231).
   Diakses 01 Februari 2022.
3. Outofdate. 2016.
   [What http return code should be if no data available](https://stackoverflow.com/a/38659868/5561144). Diakses 06
   Februari 2022.
4. Hunner, Trey. 2012.
   [HTTP status code for "no data available" from an external datasource](https://stackoverflow.com/a/9595184/5561144).
   Diakses 06 Februari 2022.
5. dabadaba. 2016.
   [Should I return a 204 or a 404 response when a resource is not found?](https://softwareengineering.stackexchange.com/a/322953/219528).
   Diakses 06 Februari 2022.
6. M., Berry. 2017.
   [Should "No Results" be an error in a RESTful response?](https://softwareengineering.stackexchange.com/a/358245/219528).
   Diakses 06 Februari 2022.
