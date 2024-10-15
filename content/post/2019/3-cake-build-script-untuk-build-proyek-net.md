---
title: Cake Build, Script untuk Build Proyek .NET🍰
categories: [Software Engineering]
tags: [programming, devops, csharp, tips]
date: 2019-02-15
slug: cake-build-script-untuk-build-proyek-net
---

Cake Build merupakan sebuah tool berupa script yang dapat digunakan untuk melakukan otomatisasi proses *building* proyek
berbasis .NET dan MS Build.

Maksudnya?

Pernahkah kamu membuat sebuah program yang cukup besar dan kompleks, sehingga terdapat banyak *dependecies* dan perlu
dilakukan beberapa tahap persiapan sebelum program dapat digunakan. Misalnya output program harus dipindahkan ke
struktur folder khusus, atau harus digabung dengan file pendukung lain, atau harus melakukan *signing* terlebih dahulu.

Daripada melakukan semua itu secara manual, akan lebih mudah jika ada cara untuk membuat proses tersebut menjadi
otomatis, kan? Nah inilah tujuan dari Cake.

![Tampilan Cake Build](https://blob.kodesiana.com/kodesiana-public-assets/posts/2019/3/912-cake-build-fs8.png)

## Apa itu Cake Build?

Cake adalah script berbasis PowerShell yang menggunakan sintaks yang mirip dengan C# untuk melakukan berbagai *task*
untuk mengotomatisasi proses pada proyek berbasis .NET. Contoh kasus yang telah dijelaskan sebelumnya merupakan salah
satu alasan kuat untuk menggunakan Cake.

## Gimana Cara Pakainya?

Gampang! Prosesnya hanya ada dua. Pertama mengunduh *bootstrapper* Cake dan membuat file **build.cake** sebagai isi
perintah yang akan dieksekusi.

### Bootstrapper Cake

Cara mengunduh bootstrapper Cake yaitu:

1. Buka PowerShell.
2. Masukkan perintah `cd E:\Proyek` tanpa tanda kurung. Folder `E:\Proyek` ini dapat diubah sesuai
   lokasi proyek.
3. Masukkan perintah `Invoke-WebRequest https://cakebuild.net/download/bootstrapper/windows -OutFile build.ps1` tanpa
   tanda kurung.

Selesai. Sekarang kamu sudah mempunyai *bootstrapper* Cake, selanjutnya adalah membuat script untuk mengeksekusi
perintah untuk *build* proyek C#.

### Script build.cake

Sintaks script untuk Cake tidak bergitu berbeda jauh dengan C#. Berikut adalah contoh script yang penulis gunakan untuk
melakukan build Argon USB Assist+. Untuk tutorial lebih lanjut, silakan [cek disini](https://cakebuild.net/docs).

```csharp
var target = Argument<string>("target", "Build");
Task("Build").Does(() =>
{
    MSBuild("./Argon.sln");
});

RunTarget(target);
```

Simpan script di atas ke file **build.cake**. Simpan di folder yang sama dengan **build.ps1** pada tahap sebelumnya.

Selanjutnya adalah mengeksekusi script pada **build.cake**, caranya:

1. Buka PowerShell.
2. Masukkan perintah `cd E:\Proyek`. Folder `E:\Proyek` ini dapat diubah sesuai lokasi proyek.
3. Masukkan perintah `./build.ps1` tanpa tanda kurung.
4. Tunggu proses build.

Yap! Selamat, kamu sudah berhasil membuat script untuk melakukan build solution kamu.
