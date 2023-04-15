---
title: 'Full Report: Aplikasi Kodesiana Diserang Hacker🙀'
category: Security
tags: [security, azure, cloud, internet]
date: 2022-10-11
slug: full-report-aplikasi-kodesiana-diserang-hacker
---

*No System is Safe*, empat kata ini mungkin ungkapan yang paling cocok untuk mengekspresikan kondisi sistem Kodesiana
siang hari ini. Tepatnya pada pukul 14.00 hingga 14.15 tanggal 10 Oktober 2022 penulis berhasil mengidentifikasi adanya
percobaan serangan pada salah satu sub sistem Kodesiana yang kemungkinan menggunakan *tools* yaitu **ALFA SHELL**.

Bagaimana tim Kodesiana menanggapi kasus serangan ini?

Apa dampaknya bagi pengguna dan tim Kodesiana.com?

*Kok bisa?* 🤷

Pada artikel kali ini, penulis akan coba untuk menjelaskan kronologi mulai dari awal pendeteksian, tindakan yang
dilakukan oleh tim, dan melakukan asesmen apa saja kerusakan yang ditimbulkan oleh serangan tersebut.

![a business woman who is stressed and frustrated](https://source.unsplash.com/bmJAXAz6ads)

## 📅 Kronologi Serangan

> Mungkin sedikit latar belakang tentang proyek ini, jadi proyek ini adalah proyek kerja sama antara pemerintah daerah
> Bogor dengan kampus penulis dan penulis sendiri untuk membuat suatu aplikasi yang nantinya akan digunakan oleh
> pemerintah.

Saat itu penulis sedang mengadakan *daily stand up* dan *sprint review* pada salah satu proyek milik pihak ketiga yang
dikerjakan oleh Kodesiana.com.

### 🕐 Pukul 13.00

Seperti biasa penulis membuka Notion (kanban dan backlog tracking), Figma, dan Azure Portal. Semuanya masih terasa
normal, kita mulai dari *sharing* dari masing-masing anggota tim selama 15 menit, dilanjut dengan *review* desain baru
yang sudah dibuat oleh UI Designer di Figma. Waktu saat itu masih menunjukkan pukul 13.50 dan semua *checkpoint* utama
sudah selesai dibahas.

Saat itu salah satu developer di tim penulis menanyakan tentang satu API yang bermasalah, mengembalikan respons 500 saat
di *hit*. Penulis sebagai *backend developer* sekaligus *lead engineering* langsung berinisiatif untuk mengecek API yang
*error* tersebut agar bisa dicatat dan diperbaiki secepatnya.

*sat set sat set*, penulis membuka **Azure Portal**, kemudian masuk ke menu **Monitor** dan memilih **Application
Insights**.

> Oke Mas X, ini ya error nya? Pas hit API yang delete all?
>
> Iya mi yang itu

### 🕑 Pukul 14.00

🧐 *hmm bentar dulu, ini failure apa yak?*

Di saat inilah penulis sadar, ada usaha untuk meretas sub sistem Kodesiana.com dari luar. Bagaimana penulis bisa tau ini
usaha peretasan bukan *traffic* normal? Coba kita lihat catatan dari **Azure Application Insights**.

![Azure App Insights - Failures](https://blob.kodesiana.com/kodesiana-public-assets/posts/2022/6/appinsights-failures-1.png)

> Hmm, ga bener ini. Ada yang coba brute-force cek file PHP di server

Dapat dilihat pada *sample drill down,* terdapat banyak respons 404 untuk *request* ke URL berikut:

- /wp-includes/wp-atom.php
- /admin/controller/extension/extension/alfacgiapi
- /sites/default/files/ALFA_DATA

Berdasarkan beberapa *request* tersebut, penulis mencari beberapa referensi yang ternyata file-file tersebut merupakan
pola penyerangan dari *tools* **ALFA SHELL** yang biasa digunakan untuk menerobos masuk ke sistem berbasis WordPress.

Di saat ini, penulis bukannya merasa khawatir, penulis malah merasa *excited*, ini pertama kali sistem Kodesiana.com
diserang dari luar😂

Mungkin teman-teman sudah tau, bahwa blog Kodesiana.com ini merupakan *static site* yang berarti tidak ada kode yang
dieksekusi di sisi server ketika ada pengguna yang membuka laman kodesiana.com. Selain itu penulis juga menggunakan
CloudFlare untuk menambah lapisan keamanan dan caching dan hampir 90% *traffic* yang masuk ke kodesiana.com disajikan
dari *cache* di CDN.

![Statistik Traffic CloudFlare](https://blob.kodesiana.com/kodesiana-public-assets/posts/2022/6/cloudflare-stats-1.png)

Sesuai dengan grafik *traffic* dari CloudFlare di atas, bisa kita pastikan bahwa ada usaha serangan ke Kodesiana.com
pada pukul 14.00, tetapi ke sub sistem mana? Betul, ke sub sistem tempat aplikasi pihak ketiga yang dibuat oleh
Kodesiana dan kebetulan sistem ini ada di bawah satu domain kodesiana.com juga.

Sampai di sini penulis belum melakukan aksi apapun selain mengonfirmasi bahwa telah terjadi serangan sekitar pukul 14.00
hingga 14.15. Alasannya sederhana, penulis masih ada *meeting* untuk *sprint planning* di kantor😂

### 🕔 Pukul 17.00

Pukul 17.00, penulis sudah selesai *meeting* dan *check out* absen. Saatnya melanjutkan proses investigasi mengenai
usaha serangan ke sub sistem Kodesiana.

Aksi pertama yang penulis lakukan adalah asesmen, apa saja impact dari percobaan serangan tadi.

Apakah ada data yang berhasil diambil? Apakah ada kelemahan sistem yang berhasil ditemukan dari usaha serangan tadi?

Untungnya, *script* yang digunakan oleh penyerang tadi adalah *script* yang berasal dari *tool* **Alpha Shell** yang
ternyata pernah *booming* sejak 2020 karena mampu meretas blog berbasis WordPress dengan mudah, bahkan ketika sudah
menggunakan *plugin* antivirus seperti WordFence.

1. Berdasarkan data dari **Azure App Insights**, tidak ada akses *brute-force* ke API untuk login dan *endpoint* lain
   yang memiliki potensi membocorkan data.
2. Berdasarkan data dari **Azure SQL Auditing**, tidak ada akses *READ* ke database menggunakan *credential* yang tidak
   sah dan tidak ada perintah *SELECT* yang mengindikasikan akses enumerasi tabel dan data dari server secara tidak
   normal.

Jadi, dapat disimpulkan kalau usaha serangan kali ini si penyerang tidak berhasil melakukan ekstraksi maupun akses
sistem secara tidak wajar ke sistem Kodesiana. **Thank God**.

## 🔥 Serangan Kedua

Tak disangka, ternyata pada keesokan harinya, tepatnya pukul 22.30 s.d. 23.45 tanggal 11 Oktober 2022 pola serangan yang
sama mulai terlihat kembali. Penulis tidak yakin *tools* apa yang digunakan kali ini untuk melakukan serangan, tetapi
penulis masih yakin kalau penyerang masih menggunakan *tools* yang sama karena target serangan yang tercatat di sistem
menunjukkan data file-file WordPress.

![App insights failure - serangan kedua](https://blob.kodesiana.com/kodesiana-public-assets/posts/2022/6/appinsights-failures-2.png)

Sama seperti analisis sebelumnya, pola serangan kedua ini tidak jauh berbeda dan sekali lagi tidak ada kebocoran data
maupun akses tidak wajar pada API Kodesiana.

## 💡 Lesson Learned

![Laptop and notepad](https://source.unsplash.com/FHnnjk1Yj7Y)

Dari serangan ini, penulis bisa mengambil beberapa hal yang bisa teman-teman jadikan referensi juga untuk mengamankan
sistem yang teman-teman buat.

1. Pastikan kita sudah mendesain aplikasi kita agar dapat berfungsi dengan baik dan memberikan respons yang
   **secukupnya**. Kadang *backend* memberikan *respons* yang banyak untuk mempermudah *frontend* tapi ternyata itu
   adalah salah satu titik kebocoran data yang menyebabkan sistem kita lebih mudah dibajak
2. Pastikan kita sudah memiliki sistem *monitoring* untuk mencatat dan mendeteksi adanya kemungkinan serangan pada
   sistem kita
3. Gunakan layanan *firewall* dan proteksi tambahan seperti WAF dari CloudFlare agar sistem bisa secara proaktif
   menganalisis, mendeteksi, dan memblokir *traffic* yang berbahaya
4. Siapkan *backup*! Kita tidak pernah tahu kapan sistem kita akan dibajak dan datanya hilang, jangan sampai kita
   kehilangan data dengan menggunakan *backup* dan pastikan kita bisa melakukan *restore* ke data terbaru dari *backup*
5. Buat SOP jika terjadi serangan. Urutan ABCD yang harus dilakukan ketika serangan berhasil di identifikasi, sedang
   berlangsung, dan aksi yang perlu dilakukan di akhir serangan.

Penulis akan membahas lebih lanjut mengenai desain sistem dan bagaimana tim Kodesiana menghadapi usaha serangan ke
sistem Kodesiana.

Sementara ini, masih ada beberapa pertanyaan yang belum terjawab,

- Bagaimana penyerang tahu subdomain ini?
- Dari mana asal sumber serangan?
- Siapa?
- Dan apa motifnya?

> Daripada kamu iseng-iseng nge-*hack* sistem Kodesiana, mendingan ikut program [Bug Hunt](/bug-hunt-program) yang resmi
> diselenggarakan oleh Kodesiana untuk kamu pentester yang suka bereksperimen dengan sistem keamanan🐣

Sekian cerita yang bisa penulis berikan, semoga bisa menjadi cerita yang menarik dan menjadi pelajaran bagi penulis dan
kamu sebagai pembaca.

Stay tuned untuk artikel selanjutnya!

## ✏️ Referensi

1. benacler. 2021.
   [alfacgiapi, hacked, files not detected by Wordfence](https://wordpress.org/support/topic/alfacgiapi-hacked-files-not-detected-by-wordfence/).
   Diakses 10 Oktober 2022.
2. stratocaster. 2020.
   [Hacked by “Sole Sad & Invisible”](https://wordpress.org/support/topic/hacked-by-sole-sad-invisible/). Diakses 10
   Oktober 2022.
3. carlosrms. 2020.
   [Alfa-Shell by ALFA TEAM/solevisible (adminow) – How to remove wordpress virus?](https://wordpress.org/support/topic/alfa-shell-by-alfa-team-solevisible-adminow-how-to-remove-wordpress-virus/).
   Diakses 10 Oktober 2022.
4. Leal, Luke. 2020.
   [ALFA TEaM Shell ~ v4.1-Tesla: A Feature Update Analysis](https://blog.sucuri.net/2020/11/alfa-team-shell-v4-1-tesla-a-feature-update-analysis.html).
   Diakses 10 Oktober 2022.
