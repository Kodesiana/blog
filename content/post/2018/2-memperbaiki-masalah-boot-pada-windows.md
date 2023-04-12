---
title: Memperbaiki Masalah Boot pada Windows 8, 8.1, dan 10💻
category: Tips
tags: [windows, tutorial, tips]
date: 2018-04-23
slug: memperbaiki-masalah-boot-pada-windows
---

Sering kali pengguna Windows menghadapi masalah dengan proses _boot_ Windows yang bisa terjadi karena _driver_, _program_, atau BSOD lainnya. Permasalahan mengenai proses _boot_ ini dapat ditangani dengan beberapa cara sesuai dengan penyebab masalah _booting_ tersebut. Masalah umum penyebab Windows tidak dapat melakukan _boot_:

- BSOD karena _driver_ atau program.
- Salah menghapus partisi.
- Gagal _Move/resize/partitioning_.

Setiap kerusakan memiliki cara penanganan yang berbeda, karena tingkat keparahannya berbeda-beda. Maka dari itu perlu dilakukan diagnosis terlebih dahulu.

**BACALAH ARTIKEL INI SAMPAI SELESAI SETIDAKNYA SATU KALI SEBELUM MELAKUKAN TINDAKAN PERBAIKAN!**

## Diagnosis Masalah Boot

Sebelum melakukan perbaikan, Anda harus melakukan diagnosis untuk mengetahui masalah apa yang terdapat pada komputer Anda. Ikuti langkah-langkah di bawah ini.

![Diskpart List Volume](https://blob.kodesiana.com/kodesiana-public-assets/posts/2018/2/diskpart-list-volume.jpg)

1. _Boot_ melalui DVD/USB instalasi Windows, setelah muncul tampilan untuk instalasi Windows, tekan **F10** untuk membuka Command Promt.
2. Ketik _**diskpart**_, kemudian tekan ENTER.
3. Ketik **_list disk_**, kemudian tekan ENTER.
4. Ketik _**select disk 0**_, kemudian tekan ENTER.
5. Ketik _**list volume**_, kemudian tekan ENTER.
6. Perhatikan daftar volume yang tampil pada layar kemudian catat tabel tersebut.
7. Ketik _**exit**_ kemudian tekan ENTER.

Pastikan Anda mencatat tabel yang muncul dari jendela _Command Prompt_. Untuk proses perbaikan, ikuti langkah-langkah di bawah ini sesuai dengan diagnosis yang ada pada pemecahan masalah.

## Tingkat 1 – EFI Boot tidak terdeteksi

Tingkat 1 ini dilakukan apabila terjadi _error_ berikut.

- _The boot configuration data sore could not be found_.
- _The requested system device cannot be found_.
- _The boot configuration data for this PC is missing or contains errors_.

1. Buka kembali _Command Prompt_ dan masuk ke _diskpart_.
2. Ketik _**select volume 4**_ kemudian tekan ENTER (volume 4 adalah drive EFI).
3. Ketik _**assign letter K:**_ kemudian tekan ENTER (tidak selalu harus K, bisa diganti letter lain).
4. Ketik _**exit**_ kemudian tekan ENTER.
5. Ketik _**cd\\**_ kemudian tekan ENTER.
6. Ketik _**K:\\efi\\microsoft\\boot**_ (atau letter lain sesuai tahap 8).
7. Ketik _**bootrec /fixboot**_ kemudian tekan ENTER.
8. Ketik _**ren BCD BCD.bak**_ kemudian tekan ENTER.
9. Ketik _**bcdboot C:\\Windows /s K: /f ALL**_ kemudian tekan ENTER (Catatan! Drive C: adalah lokasi instalasi Windows dan drive K: adalah drive EFI).
10. Ketik _**exit**_ kemudian tekan ENTER.

Restart komputer, cek apakah Windows dapat _booting_ seperti biasa. Jika gagal, ikuti langkah-langkah pada tingkat 2.

## Tingkat 2 – Error pada Parition Table

Tingkat 2 ini dilakukan apabila terjadi _error_ berikut.

- _An error occured while attempting to read the boot configuration data_.
- Saat menggunakan perintah _bootrec /rebuildbcd_, terjadi error _The requested Service cannot be identified due to multiple indistignguishable devices potentially matching the identification criteria_.

**Perhatian**! Tingkat dua ini hanya dilakukan apabila drive EFI dan drive instalasi Windows **MASIH ADA** pada _partition table_ (lihat Tabel 1). Jika partisi tersebut tidak ada, maka lanjut ke tingkat tiga.

1. Buka kembali _Command Prompt_ dan masuk ke _diskpart_.
2. Ketik _**select volume 4**_ kemudian tekan ENTER (volume 4 adalah drive EFI).
3. Ketik _**set id c12a7328-f81f-11d2-ba4b-00a0c93ec93b**_ kemudian tekan ENTER.
4. Ketik _**select volume 1**_ kemudian tekan ENTER (volume 1 adalah drive instalasi Windows).
5. Ketik _**set id ebd0a0a2-b9e5-4433-87c0-68b6b72699c7**_ kemudian tekan ENTER.
6. Lakukan diagnosis ulang kemudian lanjutkan proses pada pemecahan tingkat 1.

## Tingkat 3 – Partisi sistem Windows terhapus (System Reserved)

Proses ini dilakukan apabila partisi Windows telah dihapus secara tidak sengaja atau sengaja. Partisi yang dimaksud adalah partisi **EFI** dan partisi **MSR**. Jika yang terhapus adalah drive instalasi Windows, maka Anda harus melakukan install ulang komputer dan tidak melanjutkan perbaikan.

1. Buka kembali _Command Prompt_ dan masuk ke _diskpart_.
2. Ketik _**create partition efi size=100**_ kemudian tekan ENTER.
3. Ketik _**format quick fs=fat32**_ kemudian tekan ENTER.
4. Ketik _**create partition msr size=200**_ kemudian tekan ENTER.
5. Lakukan diagnosis ulang kemudian lanjutkan proses pada pemecahan tingkat 1.

## Langkah Terakhir

Apabila semua langkah di atas sudah di coba tapi masih belum berhasil, maka satu-satunya cara adalah melakukan instal ulang. Untuk mengembalikan data sebelum PC Anda di install ulang, lakukan _backup_ menggunakan _Live OS_ misalnya Ubuntu. Lihat: Backup Data menggunakan Ubuntu LiveCD.

## Simpulan

Untuk melakukan perbaikan masalah _booting_, penulis memaparkan cara mengembalikan entri BCD seperti semula. Selain itu, penulis juga memaparkan cara membuat kembali partisi sistem yang hilang dan memperbaiki kembali partisi yang berubah karena kesalahan tertentu.

## Referensi

1. Microsoft. 2017. Error message when you start Windows 7: "The Windows Boot Configuration Data file is missing required information" ([https://support.microsoft.com/en-us/help/2004518/error-message-when-you-start-windows-7-the-windows-boot-configuration](https://support.microsoft.com/en-us/help/2004518/error-message-when-you-start-windows-7-the-windows-boot-configuration)). Diakses 23 April 2018.
