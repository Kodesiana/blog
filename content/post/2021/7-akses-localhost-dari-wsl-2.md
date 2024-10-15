---
title: Cara Akses localhost dari WSL 2🔛
categories: [Hacks]
tags: [programming, tips, golang, pengalaman, tutorial, windows]
date: 2021-11-12
math: false
slug: cara-akses-localhost-dari-wsl-2
---

> Source code: <https://github.com/Kodesiana/Artikel/tree/master/2021/wsl-forward>

Windows Subsystem for Linux 2 (WSL 2) merupakan fitur pada Windows 10 dan 11 yang menyediakan emulasi atau lebih
tepatnya sekarang adalah virtualisasi lingkungan Linux di atas Windows Hyper-V, sehingga kita bisa menggunakan terminal
Linux secara "native" di Windows. Penulis sudah menggunakan WSL ini sejak awal dirilis dan WSL ini sangat membantu
penulis untuk koding sehari-hari menggunakan *environment* Linux tanpa harus melakukan **dual boot** atau menggunakan
alternatif seperti **Cygwin**. Kalau kamu belum tau apa itu WSL, kamu bisa cek dokumentasi
[WSL ini](https://docs.microsoft.com/en-us/windows/wsl/).

## Script Port Forward➡️

Tanpa basa basi, penulis akan langsung berikan *script* untuk melakukan port forwarding dari *loopback* (127.0.0.1) ke
*any IP* (0.0.0.0) yang nantinya bisa kamu gunakan untuk mengakses *resource* melalui jaringan lokal dari WSL ke host
Windows.

Unduh dan *build* kode di bawah ini dengan menjalankan perintah `go build -o wsl-forward.exe wsl-forward.go`.

{{< gist fahminlb33 3c3155b881868afc59926bfc84e83c1b >}}

Untuk menggunakan program yang sudah kamu buat tadi, kamu bisa menggunakan empat argumen pada CLI, yaitu:

- `lh`, host yang akan menjadi target *forward*, default: `0.0.0.0`
- `lp`, port yang akan menjadi target *forward*
- `rh`, host yang ingin di-*forward*, default: `localhost`
- `rp`, post yang ingin di-*forward*

Argumen yang *mandatory* adalah `lp` dan `rp`. Contoh kasus penggunaan tool ini:

> Misalnya kamu menjalankan server database PostgreSQL di host Windows dan ingin mengakses server lokal tersebut dari
> aplikasi yang sedang kamu buat di WSL 2. Server database *listening* pada port 5432 dan kamu ingin mengakses database
> tersebut dari WSL 2 pada port 4444.

Berdasarkan kasus tersebut, kamu bisa menggunakan perintah berikut.

```bash
wsl-forward -rp 5432 -lp 4444
```

Setelah mengeksekusi perintah di atas, tool akan melakukan *binding* ke IP `0.0.0.0:4444`, IP ini merupakan alamat IP
yang akan menerima semua *traffic* dari semua *interface*, kemudian tool ini akan membuka koneksi juga ke
`localhost:5432` yang merupakan server database. Ketika ada *traffic* yang masuk ke port 4444 dari *interface* apapun
(Ethernet, Wi-Fi, dan vSwitch WSL 2), tool akan melakukan *forwarding* traffic tersebut ke `localhost:5432` pada host
Windows. Aplikasi pada WSL kemudian bisa menggunakan *address* `$(hostname).local:4444` untuk dapat mengakses database
server.

To recap,

1. Jalankan database server (atau aplikasi apapun) yang akan di *forward*
2. Jalankan `wsl-forward -rp <port di Windows> -lp <port di WSL>`, misal `wsl-forward -rp 5432 -lp 4444`
3. Cari tahu *hostname* menggunakan perintah `echo $(hostname)`, misal *hostname* penulis adalah `MAGI`
4. Akses port tersebut dari WSL menggunakan *address* `<hostname dari step 3>.local:<port di WSL>`, berarti *address*
   yang bisa digunakan adalah `MAGI.local:4444`

Pretty clever, isn't it?🤣

Wah keren gan! Tapi kenapa harus begitu ya prosesnya?

## Interface vSwitch dan WSL 2🛂

Seperti yang sudah dijelaskan sebelumnya bahwa WSL 2 berjalan di atas *lightweight VM*, sehingga WSL akan memiliki
jaringan yang terpisah dari host Windows. Jaringan ini terdapat di belakang NAT dan juga di blok oleh **Windows
Firewall**, sehingga koneksi dari WSL ke host Windows diperbolehkan, tetapi akses dari dalam WSL ke dalam host Windows
akan ditolak. Meskipun kita sudah membuka akses *firewall* antara WSL dan host Windows, tidak selalu kita bisa mengakses
port yang ada pada host Windows karena aplikasi yang ingin kita gunakan mungkin tidak *listen* pada interface milik WSL
(vSwitch).

Teman-teman mungkin bingung maksudnya *tidak listen pada interface WSL*, padahal aplikasi dan WSL sama-sama ada di satu
host Windows yang sama, tapi kenapa tidak bisa langsung saling akses port yang sama?

Sebagian besar aplikasi yang menjalankan server dan *listen* pada sebuah port di komputer kita biasanya hanya listen
pada *loopback interface*, atau lebih sering kita dengar sebagai `localhost`. WSL memiliki *interface* jaringan virtual
(vSwitch) sendiri yang terpisah dari host Windows, sehingga aplikasi yang *listen* pada *localhost* tidak akan bisa
menerima *traffic* dari WSL karena mereka berada pada dua *interface* yang berbeda.

Solusinya adalah mengubah *host* yang digunakan oleh aplikasi untuk *listen* menjadi `0.0.0.0` atau membuat *forwarding*
antara `localhost` dan interface WSL. `0.0.0.0` merupakan IP spesial yang akan mencocokan dengan semua *interface* yang
ada pada komputer, termasuk WSL. Tool `wsl-forward` dibuat khusus untuk melakukan *forwarding* tadi dari `localhost`
menuju `0.0.0.0`, sehingga semua *traffic* pada komputer bisa mengakses port yang diinginkan.

Metode ini mirip seperti yang digunakan pada aplikasi seperti **ngrok**. Oke kita sudah paham mengenai masalah
*firewall* dan aplikasi yang tidak *listen* pada host `0.0.0.0` sehingga aplikasi dari dalam WSL tidak bisa akses port
di host Windows, tetapi apakah ada kelebihan lain menggunakan metode *forwarding* dibandingkan dengan mengubah hanya
*listening host* menjadi `0.0.0.0`?

## Use Case Lain🤷‍♂️

Ya! Ada beberapa *use case* lain di mana penggunaan *port forwarding* lebih direkomendasikan dibandingkan dengan
mengubah *listening host* ke `0.0.0.0`, beberapa diantaranya yang pernah dialami penulis adalah sebagai berikut.

### Aplikasi tidak support untuk listen ke `0.0.0.0`

Penulis sering bekerja dengan cluster Kubernetes, salah satunya OpenShift. Sayangnya versi OpenShift Client yang penulis
gunakan tidak support untuk melakukan *port-forward* dari pod ke host `0.0.0.0` di komputer lokal penulis, padahal
penulis ingin mengakses pod tersebut dari dalam WSL. Melakukan *port-forwarding* dari *local* ke *any IP* merupakan
satu-satunya cara untuk bisa mengakses pod dari WSL.

Penulis bisa saja menjalankan tool `oc` dari dalam WSL agar tidak perlu melakukan *forwarding*, tetapi semua toolset
penulis sudah ada di host Windows, sehingga penulis tetap melakukan *port-forward* dari Windows untuk menghindari proses
setup `oc` dari Windows.

### Aplikasi mewajibkan untuk akses dari `localhost`

Misalnya PostgreSQL, database ini memiliki metode otentikasi TRUST yang memperbolehkan semua akses ke database admin
tanpa *password*. Sayangnya, otentikasi ini hanya berlaku apabila aplikasi mengakses dari `localhost`, karena WSL berada
pada jaringan diluar `localhost` (memiliki IP sendiri dari interface vSwitch), PostgreSQL akan selalu menolak otentikasi
ke database. Dengan melakukan *port-forwarding*, aplikasi dari WSL bisa mengakses database PostgreSQL karena sekarang
PostgreSQL akan menerima *traffic* dari `localhost` (karena `wsl-forward` running pada host Windows) dan aplikasi dari
dalam WSL dapat mengakses database karena `wsl-forward` akan meneruskan *traffic* dari port tersebut.

Pada kasus ini juga bisa dihindari dengan cara menjalankan server database langsung di dalam WSL, tetapi penulis
memiliki alasan yang sama, semua toolset sudah penulis atur pada Windows, sehingga penulis enggan untuk melakukan setup
ulang di WSL.

Nah paparan di atas merupakan pengalaman penulis menggunakan WSL dan beberapa trik untuk bisa menggunakan WSL dan
Windows dengan lebih baik lagi. Jika teman-teman punya kasus atau pengalaman lain, jangan lupa berikan *feedback*
melalui komentar pada Gist di atas atau melalui media lain pada blog ini, terima kasih!

## Referensi

1. Hua, Qiu. 2021. [network port forwarding in go lang](https://gist.github.com/qhwa/cb9d3851450bff3b705e). Diakses 01 November 2021.
2. Mario. 2021. [Port Forwarding with Go](https://www.zupzup.org/go-port-forwarding/index.html). Diakses 01 November 2021.
3. Nilsson, Stefan. 2018. [Format byte size as kilobytes, megabytes, gigabytes, ...](https://yourbasic.org/golang/formatting-byte-size-to-human-readable-format). Diakses 01 November 2021.
