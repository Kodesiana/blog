---
title: Mengatasi Proxy Windows 10 Tidak Mau Mati🛑
category: Tips
tags: [windows, tutorial]
date: 2018-11-15
slug: mengatasi-proxy-windows-10-tidak-mau-mati
---

Proxy Windows 10 merupakan salah satu fitur yang dapat membantu penggunanya untuk membantu menggunakan proxy yang dapat
digunakan pada sistem, tanpa perlu menggunakan aplikasi pihak ketiga seperti Proxifier, CCProxy, atau aplikasi proxy
serupa.

Proxy merupakan sebuah server yang bertugas sebagai penengah komunikasi antara *client* dan *server* yang biasanya
digunakan untuk meningkatkan keamanan dan menghilangkan sensor dari ISP.

## Proxy Windows 10 Tidak Mau Mati

Marak laporan mengenai proxy pada Windows 10 yang tidak bisa dimatikan lewat Settings. Hal ini menyebabkan Windows tidak
bisa mengakses internet, misalnya pada Google Chrome akan muncul *error* **ERR_PROXY_CONNECTION_FAILED**.

![Setting Proxy di Windows 10](https://blob.kodesiana.com/kodesiana-public-assets/posts/2018/12/44985786865_3f03e02e25_o.png)

Untuk mengatasi hal tersebut, Anda dapat menggunakan file *registry* berikut untuk mematikan proxy pada jendela
Settings.

```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings]
"MigrateProxy"=dword:00000001
"ProxyHttp1.1"=dword:00000000
"ProxyEnable"=dword:00000000
"ProxyOverride"=""
"ProxyServer"=""

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\CurrentVersion\Internet Settings]
"ProxySettingsPerUser"=dword:00000001
```

1. Salin rekat isi kode berikut ke dalam Notepad atau aplikasi editor teks lain kemudian simpan dengan ekstensi
   file **.reg**.
2. Buka file tersebut kemudian klik OK.
3. Buka **Settings >> Proxy** untuk melihat apakah proxy sudah mati atau belum.

Setelah mengubah *registry*, proxy pada Windows 10 akan secara otomatis mati. Sekarang Anda dapat berselancar di
internet seperti biasa.

## Bug Proxy Windows?

Penulis tidak mengetahui apakah ini merupakan bug dari Windows 10 atau bukan. Sebelum Windows 10 Redstone 4, masalah ini
tidak dialami oleh penulis. Tetapi setelah pembaruan Redstone 4, masalah proxy ini mulai muncul dan sangat mengganggu.

Menurut forum dari Microsoft Answers, penyebab masalah proxy yang tidak dapat diubah ini adalah program *crack* seperti
KMSpico, License Server, atau downloader lain yang mengubah pengaturan Windows sehingga proxy tidak dapat dimatikan.

Meskipun penulis sudah memberikan file untuk mengembalikan *registry* agar dapat mematikan proxy, sewaktu-waktu proxy
bisa aktif dengan sendirinya kembali. Jika proxy aktif kembali, Anda dapat membuka file *reg* tadi untuk mematikan proxy
kembali.

## Referensi

1. Wikipedia. 2018. Proxy Server (https://en.wikipedia.org/wiki/Proxy_server). Diakses 16 November 2018.
