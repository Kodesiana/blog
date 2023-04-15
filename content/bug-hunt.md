---
title: Bug Hunt Program
date: 2022-09-10
hideToc: true
hideRss: true
hideMeta: true
---

> Reminder: Kodesiana merupakan blog pribadi. Email yang kamu kirim mungkin tidak akan langsung dibalas oleh admin.

<div class="flex justify-center">
{{< button href="/bug-hunt/leaderboard" content="Leaderboard" icon="tabler:chart-bar" >}}
</div>

Selamat datang di program **Bug Hunt Kodesiana.com**!

Program **Bug Hunt** ini adalah canangan dari admin Kodesiana.com, Fahmi untuk dapat meningkatkan layanan dan keamanan
pengguna yang mengakses blog maupun layanan Kodesiana.com. Meskipun web ini adalah milik pribadi, admin selalu ingin
memastikan keamanan dan perlindungan data yang baik bagi pengguna dengan mengikuti standar _security and governance_
yang berlaku.

Selain itu, program ini juga bertujuan untuk mengembangkan talenta _cybersecurity_ di Indonesia dan memberikan _reward_
bagi kontributor yang berhasil menemukan dan melaporkan masalah keamanan sistem Kodesiana kepada tim admin. Dengan
demikian, tim admin juga dapat mengidentifikasi dan memperbaiki masalah keamanan tersebut dengan lebih cepat dan tepat.

## security.txt

Kodesiana.com sudah mengikuti standar pelaporan keamanan sesuai draf standar
[RFC 9116](https://www.rfc-editor.org/info/rfc9116) dan dapat diakses pada
https://www.kodesiana.com/.well-known/security.txt sesuai standar [RFC 8615](https://www.rfc-editor.org/rfc/rfc8615).

## Peraturan **Bug Hunt**

Kalau kamu ingin berpartisipasi dalam program _bug hunt Kodesiana.com_, terdapat beberapa peraturan yang harus kamu
ikuti agar kamu dapat mengajukan _reward_ ke Kodesiana.com. Tenang aja, prosesnya engga ribet kok!

### Ruang Lingkup

Bug yang dapat dilaporkan terbatas pada daftar domain dan subdomain berikut.

- `kodesiana.com`
- `www.kodesiana.com`
- `api.kodesiana.com`

Subdomain selain yang terdapat pada daftar di atas tidak termasuk pada program _bug hunt_ karena beberapa alasan
berikut.

- **Sandboxed apps**. Beberapa subdomain di bawah `kodesiana.com` termasuk pada program internal atau _sandbox_ yang
  ditujukan untuk pengembangan internal dan tidak dibuat _live_ untuk pengguna.
- **Third party apps**. Beberapa subdomain di bawah `kodesiana.com` juga merupakan milik pihak ketiga yang memiliki
  kontrak dengan Kodesiana sehingga tidak di bawah kontrol Kodesiana langsung.

### Kualifikasi _Vulnerability_

Hampir semua jenis metode _exploit_ termasuk pada program _bug hunt_, misalnya:

- Cross Site Scripting (XSS),
- Cross Site Request Forgery (CRSF),
- SQL injection,
- Kelemahan authentication atau authorization,
- Server-side code execution.

Anda bisa menggunakan tools seperti BurpSuite, Metasploit, dan lain sebagainya. Meskipun demikian, beberapa kategori
khusus berikut dapat dilaporkan tetapi tidak memiliki _reward_ uang tunai, melainkan mencantumkan nama pada
_Leaderboard_.

- **Bug pada domain sandbox**. Semua vulnerability yang terdapat pada subdomain _sandbox_ tidak termasuk pada kategori
  _reward_.
- **Bug yang membutuhkan intervensi user yang besar**. Apabila proses eksploitasi bug mewajibkan pengguna untuk
  melakukan proses yang terlalu spesifik seperti menyalin script JS ke form, menggunakan DevTools, atau proses lain yang
  rumit, bug ini tidak termasuk pada kategori _reward_.
- **Ekstraksi informasi versi dan banner**. Informasi versi dan banner/header versi dari aplikasi backend Kodesiana.com
  juga tidak termasuk pada kategori _reward_ karena informasi versi dan banner aplikasi tidak secara langsung
  menyebabkan _vulnerability_ pada sistem. Contoh: menggunakan Nmap untuk mencari versi dan framework backend.
- **Vulnerability lain yang tidak terkait dengan internal operasi sistem**.

Semua laporan _vulnerability_ akan dinilai dan ditelaah oleh admin Kodesiana.com dan akan diberikan label prioriitas dan
kategori. Meskipun tidak dicantumkan pada daftar di atas, apabila terdapat laporan bug yang dianggap tidak termasuk pada
kategori _reward_, daftar di atas akan diperbarui dan laporan kamu masih akan tetap diproses sesuai aturan awal.

### Hadiah/_Reward_

_Reward_ yang ditawarkan pada program _bug hunt_ ini adalah penempatan nama pada _leaderboard_ dan uang tunai yang dapat
diberikan setelah proses _review_ dan _reproduce_ oleh tim admin Kodesiana. Besaran reward bergantung pada tingkat
keparahan (_severity_) berdasarkan tabel berikut.

| Severity | Keterangan                                                                                                                                                                                                                                        | Nominal            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| P0       | Bug yang dapat menyebabkan **kebocoran data** (esktraksi data secara masif dari sistem) atau **downtime** pada skala besar (mencakup dua atau lebih layanan Kodesiana.com sehingga sistem tidak dapat diakses).                                   | hingga Rp1.000.000 |
| P1       | Bug yang dapat menembus akses kredensial user dan melakukan ekstraksi data terbatas sesuai dengan otorisasi user tersebut. Apabila ekstraksi data dapat dilakukan secara masif melebihi data dari user tersebut, maka level prioritas naik ke P0. | hingga Rp600.000   |
| P2       | Bug yang menyebabkan _slowdown_ (mengurangi waktu respons server) atau tindakan abusif pada sistem (misalnya mengirim komentar secara masif pada suatu post) atau melakukan permintaan OTP tanpa batas.                                           | hingga Rp300.000   |

### Investigasi dan Pelaporan Bug

Laporan bug dapat dikirim ke alamat email: `fahmi at kodesiana.com` dengan menggunakan _encrypted email_ menggunakan
kunci publik PGP yang dapat diakses pada tautan berikut: https://www.kodesiana.com/.well-known/pgp.txt (RSA 4096-bits).

Laporan setidaknya berisi:

- Bagian apa yang menjadi sasaran
- Apa pengaruhnya pada sistem
- _Step-by-step_ untuk melakukan _exploit_ tersebut

Contoh:

```
Saya berhasil melakukan brute force password saat melakukan login
ke https://www.kodesiana.com/login. Dengan menggunakan username yang
didapat dari kolom komentar, saya bisa menggunakan BurpSuite untuk
melakukan brute force dan masuk ke halaman dashboard.

Caranya:
1. ...
2. ...
3. ...
```

Pastikan kamu menggunakan kunci PGP ketika mengirim email dan pastikan email kamu aktif agar tim admin Kodesiana dapat
melakukan _follow up_. Perlu diingat bahwa Kodesiana.com merupakan blog pribadi, sehingga email yang kamu kirim mungkin
tidak dapat langsung diproses oleh admin!

### F.A.Q

To be added.
