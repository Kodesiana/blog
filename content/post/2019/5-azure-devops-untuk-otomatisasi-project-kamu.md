---
title: Azure DevOps untuk Otomatisasi Project Kamu!🪐
category: Tips
tags: [devops, azure, csharp, programming]
date: 2019-07-13
slug: azure-devops-untuk-otomatisasi-project-kamu
---

![](https://source.unsplash.com/36Aai16fubc/1200x657)

Azure DevOps merupakan layanan kolaborasi dan CI/CD yang dapat membantu
perencanaan, pengujian, hingga distribusi proyek yang kecil hingga kelas bisnis.

Kalau kamu pernah menggunakan layanan seperti Travis CI, AppVeyor, Jenkins, atau
sejenisnya, Azure DevOps ini memiliki fungsi yang kurang lebih sama. Tetapi,
Azure DevOps ini memiliki beberapa kelebihan lain, lho!

## Apa sih DevOps?

> DevOps adalah serangkaian praktik dalam pengembangan perangkat lunak yang
> menggabungkan pengembangan (**Dev**) dan operasi IT (**Ops**) untuk
> memperpendek siklus pengembangan perangkat lunak dengan kebutuhan bisnis
> [1].
>
> Mala, D.J. (dengan modifikasi).

Sederhananya, DevOps bertujuan untuk menyelesaikan masalah antara para
programmer dan manajer bisnis bagaimana menyelesaikan suatu aplikasi untuk
kepentingan bisnis.

Kenapa? Dalam proses pembuatan aplikasi, tentu ada tahapan tertentu seperti
rancangan, pengujian, hingga rilis. Semua proses tersebut saling terkait dan
merupakan sebuah alir yang selalu berulang. DevOps hadir untuk mempersingkat
waktu yang dibutuhkan untuk menyelesaikan produk tertentu dengan otomatisasi
kerja yang berulang.

![](https://source.unsplash.com/QckxruozjRg/1200x657)

Kerja sama antar anggota tim menjadi lebih mudah.

Beberapa contoh kasus yang dapat diselesaikan dengan DevOps:

1. Proses **build** aplikasi pada repositori.
2. Proses **testing**, seperti unit test.
3. Proses **delivery** aplikasi untuk rilis ke App Store.

Masih banyak kasus lain yang dapat diselesaikan dengan DevOps, tiga contoh di
atas adalah bagian dari DevOps yaitu **CI/CD** (Continuous
Integration/Continuous Delivery).

Tim Kodesiana juga sudah biasa menggunakan Azure DevOps dengan [Cake
Build](https://kodesiana.com/post/cake-build-script-untuk-build-proyek-net/)
untuk membuat otomatisasi proses pembuatan program di Kodesiana, lho.

> Untuk referensi lain mengenai DevOps, bisa dilihat di bagian akhir artikel.

## DevOps untuk Semua Platform

Karena Azure merupakan produk dari Microsoft, tentu Azure DevOps memiliki
support yang sangat baik untuk proyek berbasis .NET, baik .NET Framework maupun
.NET Core.

Dibandingkan layanan CI lainnya, layanan memiliki banyak jenis
_[agent](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?view=azure-devops)_,
baik dari yang _plain_ (kosong) hingga agent yang sudah di set seperti Visual
Studio.

Saat ini Azure DevOps mendukung _agent_ dengan sistem operasi Windows, Windows
Server, macOS, dan Ubuntu. Tentunya sudah lengkap untuk dapat membuat aplikasi
untuk berbagai platform mulai dari desktop, cloud, hingga mobile.

## Gratis, kah? Iya

Yap, Azure DevOps menawarkan layanan gratis untuk proyek yang di host di GitHub
atau provider lain, dengan fitur yang cukup lengkap pula.

Gimana cara daftarnya? Akan di bahas di artikel selanjutnya ya! Stay tuned.

## Referensi

1. Mala, D.J. (2019). [_Integrating the Internet of Things Into Software
   Engineering
   Practices_](https://books.google.co.uk/books?id=GPGCDwAAQBAJ&pg=PA16).
   Advances in Systems Analysis, Software Engineering, and High Performance
   Computing. IGI Global.
   p. 16. [ISBN](https://en.wikipedia.org/wiki/International_Standard_Book_Number)[978-1-5225-7791-1](https://en.wikipedia.org/wiki/Special:BookSources/978-1-5225-7791-1).
   Diakses 14 Juli 2019.
