---
title: 16+ Tips Manipulasi DateTime pada C#🕔
categories: Tips
tags: [programming, tutorial, tips]
date: 2018-05-27
slug: 16-tips-manipulasi-datetime-pada-csharp
---

<div class="flex justify-center">
{{< button content="Soure Code" icon="logos:github-icon" href="https://l.kodesiana.com/legacy-datetime-format" >}}
</div>

Manipulasi *DateTime* merupakan hal yang wajib diketahui oleh programmer, khususnya C# dan VB.NET. *DateTime*
([struktur](<https://msdn.microsoft.com/en-us/library/system.datetime(v=vs.110).aspx>)) digunakan untuk menyimpan
informasi berupa tanggal dan waktu. Manipulasi *DateTime* sangat penting khususnya dalam aplikasi kasir, sewa, rental,
dan lain-lain. Struktur DateTime memudahkan programmer untuk mengolah tanggal dan waktu, misalnya mencari selisih
tanggal, konversi kalender, dan operasi penanggalan lainnya.

## DateTime, TimeSpan, dan CultureInfo

Sebelum memulai membahas manipulasi DateTime, sebaiknya kita bahas terlebih dahulu mengenai **DateTime**, **TimeSpan,**
dan **CultureInfo**.

- **DateTime,** merupakan struktur yang menampung data  berupa tanggal dan waktu.
- **TimeSpan**, merupakan struktur yang menampung interval waktu.
- **CultureInfo**, merupakan kelas yang menyediakan informasi mengenai suatu kultur (formatting, bahasa, dan lain-lain).

Pada aplikasi uji coba kali ini, penulis menggunakan kultur *English US*. Untuk mengetahui kultur yang aktif pada
komputer Anda, buka **Region & language settings** pada Control Panel. Pengatuan kultur ini berpengaruh pada aplikasi
yang akan dibuat, karena format yang dihasilkan akan mengikuti kultur yang aktif pada sistem.

Selain mengubah pengaturan kultur dari sistem melalui Control Panel, pengaturan kultur juga dapat dilakukan dari
aplikasi dengan cara mengubah kultur internal aplikasi dalam lingkup *thread*.

```csharp
CultureInfo ci = new CultureInfo("id-ID");
Thread.CurrentThread.CurrentCulture = ci;
Thread.CurrentThread.CurrentUICulture = ci;
```

Kebanyakan format sudah ada pada bawaan Windows, programmer hanya perlu mengatur kultur agar sesuai. Misalnya format
tanggal *bulan/tanggal/tahun* pada format EN-US dapat dengan mudah diubah menjadi kultur Indonesia yaitu
*tanggal/bulan/tahun* menggunakan kode di atas. Biasanya format tanggal dan waktu tidak perlu kustom, cukup mengubah
kultur saja.

![Demo Manipulasi DateTime](https://blob.kodesiana.com/kodesiana-public-assets/posts/2018/6/demo-datetime.png)

## Format Standar DateTime

| Format | Keterangan                     | Contoh                      |
| ------ | ------------------------------ | --------------------------- |
| d      | Tanggal singkat                | 26/05/2018                  |
| D      | Tanggal lengkap                | Sabtu, 26 Mei 2018          |
| f      | Tanggal dan waktu singkat      | Sabtu, 26 Mei 2018 15.30    |
| F      | Tanggal dan waktu lengkap      | Sabtu, 26 Mei 2018 15.30.23 |
| g      | Tanggal dan waktu umum singkat | 26/05/2018 15.30            |
| G      | Tanggal dan waktu umum lengkap | 26/05/2018 15.30.23         |
| t      | Waktu singkat                  | 15.30                       |
| T      | Waktu lengkap                  | 15.30.23                    |
| m      | Tanggal dan bulan              | 26 Mei                      |
| y      | Bulan dan tahun                | Mei 2018                    |

Format pada tabel di atas digunakan untuk memanggil fungsi `ToString(string format)` pada objek **DateTime.** Format di
atas digunakan seperti apa adanya, tidak ada kustomisasi, hanya satu karakter sebagai parameter pada fungsi
`ToString(string format)`. Format standar ini sangat cocok untuk menampilkan tanggal dan waktu sesuai dengan kultur
sistem dengan cepat.

Kode berikut adalah contoh untuk menggunakan format sesuai tabel di atas.

```csharp
var tanggal = DateTime.Now; // pakai tanggal dan waktu saat ini
Console.WriteLine(tanggal.ToString("T"));
```

## Format Kustom DateTime

| Format | Keterangan                       | Contoh                             |
| ------ | -------------------------------- | ---------------------------------- |
| d      | Hari, 1-31                       | d/MM/yyyy = 2/05/2018              |
| dd     | Hari, 01-31                      | dd/MM/yyyy = 02/05/2018            |
| ddd    | Hari, singkatan                  | ddd, MM yyyy = Wed, 05 2018        |
| dddd   | Hari, kepanjangan                | dddd, MM yyyy = Wednesday, 05 2018 |
| M      | Bulan, 1-12                      | dd/M/yyyy = 2/6/2018               |
| MM     | Bulan, 01-12                     | dd/MM/yyyy = 02/06/2018            |
| MMM    | Bulan, singkatan                 | dd MMM yyyy = 02 Jun 2018          |
| MMMM   | Bulan, kepanjangan               | dd MMMM yyyy = 02, June 2018       |
| s      | Detik, 0-59                      | hh:mm:s = 02:45:1                  |
| ss     | Detik, 00-59                     | hh:mm:ss = 02:45:01                |
| m      | Menit, 0-59 Menit                | hh:m:ss = 02:6:17                  |
| mm     | Menit, 00-59 Menit               | hh:mm:ss = 02:06:17                |
| h      | Jam, 1-12 (format 12 jam)        | h:mm:ss = 5:32:16                  |
| hh     | Jam, 01-12 (format 12 jam)       | hh:mm:ss = 05:32:16                |
| H      | Jam, 1-24 (format 24 jam)        | H:mm:ss = 6:32:16                  |
| HH     | Jam, 01-2 (format 24 jam)        | HH:mm:ss = 17:32:16                |
| t      | Satu karakter *designator* AM/PM | hh:mm:ss t = 2:11:42 P –> PM       |
| tt     | *Designator* AM/PM               | hh:mm:ss tt = 2:11:42 PM           |
| :      | Pemisah waktu                    | 5:32:16                            |
| /      | Pemisah tanggal                  | 21/05/2000                         |

Berbagai format di atas dapat dikombinasikan untuk menghasilkan format yang diinginkan. Misalkan:
`dddd, dd/MM/yyyy hh:mm:ss tt` akan menghasilkan `Saturday, 26/05/2018 15:56:12 PM` pada saat artikel ini ditulis.

## Referensi

1. Microsoft. 2017. Standard Date and Time Format Strings
   ([*https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings*](https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings)).
   Diakses 25 Mei 2018.
2. Microsoft. 2017. Custom Date and Time Format Strings
   ([*https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings*](https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings)).
   Diakses 25 Mei 2018.
3. Microsoft. 2018. CultureInfo Class
   ([*https://docs.microsoft.com/id-id/dotnet/api/system.globalization.cultureinfo*](https://docs.microsoft.com/id-id/dotnet/api/system.globalization.cultureinfo)).
   Diakses 26 Mei 2018.
4. Microsoft. 2018. DateTime Struct
   ([*https://docs.microsoft.com/id-id/dotnet/api/system.datetime*](https://docs.microsoft.com/id-id/dotnet/api/system.datetime)).
   Diakses 26 Mei 2018.
