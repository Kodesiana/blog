---
title: Memperbaiki Masalah Boot pada Windows 8, 8.1, dan 10💻
categories: [Hacks]
tags: [windows, tutorial, tips]
date: 2018-04-23
slug: memperbaiki-masalah-boot-pada-windows
---

Sering kali pengguna Windows menghadapi masalah dengan proses *boot* Windows yang bisa terjadi karena *driver*,
*program*, atau BSOD lainnya. Permasalahan mengenai proses *boot* ini dapat ditangani dengan beberapa cara sesuai dengan
penyebab masalah *booting* tersebut. Masalah umum penyebab Windows tidak dapat melakukan *boot*:

- BSOD karena *driver* atau program.
- Salah menghapus partisi.
- Gagal *Move/resize/partitioning*.

Setiap kerusakan memiliki cara penanganan yang berbeda, karena tingkat keparahannya berbeda-beda. Maka dari itu perlu
dilakukan diagnosis terlebih dahulu.

**BACA ARTIKEL INI SAMPAI SELESAI SETIDAKNYA SATU KALI SEBELUM MELAKUKAN TINDAKAN PERBAIKAN!**

## Diagnosis Masalah Boot

Sebelum melakukan perbaikan, Anda harus melakukan diagnosis untuk mengetahui masalah apa yang terdapat pada komputer
Anda. Ikuti langkah-langkah di bawah ini.

![Diskpart List Volume](https://blob.kodesiana.com/kodesiana-public-assets/posts/2018/2/diskpart-list-volume.jpg)

1. *Boot* melalui DVD/USB instalasi Windows, setelah muncul tampilan untuk instalasi Windows, tekan **F10** untuk
   membuka Command Promt.
2. Ketik ***diskpart***, kemudian tekan ENTER.
3. Ketik ***list disk***, kemudian tekan ENTER.
4. Ketik ***select disk 0***, kemudian tekan ENTER.
5. Ketik ***list volume***, kemudian tekan ENTER.
6. Perhatikan daftar volume yang tampil pada layar kemudian catat tabel tersebut.
7. Ketik ***exit*** kemudian tekan ENTER.

Pastikan Anda mencatat tabel yang muncul dari jendela *Command Prompt*. Untuk proses perbaikan, ikuti langkah-langkah di
bawah ini sesuai dengan diagnosis yang ada pada pemecahan masalah.

## Tingkat 1 – EFI Boot tidak terdeteksi

Tingkat 1 ini dilakukan apabila terjadi *error* berikut.

- *The boot configuration data sore could not be found*.
- *The requested system device cannot be found*.
- *The boot configuration data for this PC is missing or contains errors*.

1. Buka kembali *Command Prompt* dan masuk ke *diskpart*.
2. Ketik ***select volume 4*** kemudian tekan ENTER (volume 4 adalah drive EFI).
3. Ketik ***assign letter K:*** kemudian tekan ENTER (tidak selalu harus K, bisa diganti letter lain).
4. Ketik ***exit*** kemudian tekan ENTER.
5. Ketik ***cd\\*** kemudian tekan ENTER.
6. Ketik ***K:\\efi\\microsoft\\boot*** (atau letter lain sesuai tahap 8).
7. Ketik ***bootrec /fixboot*** kemudian tekan ENTER.
8. Ketik ***ren BCD BCD.bak*** kemudian tekan ENTER.
9. Ketik ***bcdboot C:\\Windows /s K: /f ALL*** kemudian tekan ENTER (Catatan! Drive C: adalah lokasi instalasi Windows
   dan drive K: adalah drive EFI).
10. Ketik ***exit*** kemudian tekan ENTER.

Restart komputer, cek apakah Windows dapat *booting* seperti biasa. Jika gagal, ikuti langkah-langkah pada tingkat 2.

## Tingkat 2 – Error pada Parition Table

Tingkat 2 ini dilakukan apabila terjadi *error* berikut.

- *An error occured while attempting to read the boot configuration data*.
- Saat menggunakan perintah *bootrec /rebuildbcd*, terjadi error *The requested Service cannot be identified due to
  multiple indistignguishable devices potentially matching the identification criteria*.

**Perhatian**! Tingkat dua ini hanya dilakukan apabila drive EFI dan drive instalasi Windows **MASIH ADA** pada
*partition table* (lihat Tabel 1). Jika partisi tersebut tidak ada, maka lanjut ke tingkat tiga.

1. Buka kembali *Command Prompt* dan masuk ke *diskpart*.
2. Ketik ***select volume 4*** kemudian tekan ENTER (volume 4 adalah drive EFI).
3. Ketik ***set id c12a7328-f81f-11d2-ba4b-00a0c93ec93b*** kemudian tekan ENTER.
4. Ketik ***select volume 1*** kemudian tekan ENTER (volume 1 adalah drive instalasi Windows).
5. Ketik ***set id ebd0a0a2-b9e5-4433-87c0-68b6b72699c7*** kemudian tekan ENTER.
6. Lakukan diagnosis ulang kemudian lanjutkan proses pada pemecahan tingkat 1.

## Tingkat 3 – Partisi sistem Windows terhapus (System Reserved)

Proses ini dilakukan apabila partisi Windows telah dihapus secara tidak sengaja atau sengaja. Partisi yang dimaksud
adalah partisi **EFI** dan partisi **MSR**. Jika yang terhapus adalah drive instalasi Windows, maka Anda harus melakukan
install ulang komputer dan tidak melanjutkan perbaikan.

1. Buka kembali *Command Prompt* dan masuk ke *diskpart*.
2. Ketik ***create partition efi size=100*** kemudian tekan ENTER.
3. Ketik ***format quick fs=fat32*** kemudian tekan ENTER.
4. Ketik ***create partition msr size=200*** kemudian tekan ENTER.
5. Lakukan diagnosis ulang kemudian lanjutkan proses pada pemecahan tingkat 1.

## Langkah Terakhir

Apabila semua langkah di atas sudah di coba tapi masih belum berhasil, maka satu-satunya cara adalah melakukan instal
ulang. Untuk mengembalikan data sebelum PC Anda di install ulang, lakukan *backup* menggunakan *Live OS* misalnya
Ubuntu. Lihat: Backup Data menggunakan Ubuntu LiveCD.

## Simpulan

Untuk melakukan perbaikan masalah *booting*, penulis memaparkan cara mengembalikan entri BCD seperti semula. Selain itu,
penulis juga memaparkan cara membuat kembali partisi sistem yang hilang dan memperbaiki kembali partisi yang berubah
karena kesalahan tertentu.

## Referensi

1. Microsoft. 2017. [Error message when you start Windows 7: "The Windows Boot Configuration Data file is missing required information"](https://support.microsoft.com/en-us/help/2004518/error-message-when-you-start-windows-7-the-windows-boot-configuration). Diakses 23 April 2018.
