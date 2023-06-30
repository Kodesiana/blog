---
title: Mengatasi Lag DataGridView C#⌚
categories: Programming
tags: [programming, tutorial, tips]
date: 2018-05-15
slug: mengatasi-lag-datagridview-csharp
---

DataGridView merupakan kontrol yang sangat umum digunakan untuk menampilkan data dari *database*. Tetapi, saat
menggunakan DataGridView dengan banyak *style* dan data, aplikasi akan menjadi *lag* atau *flickering*. Lag DataGridView
ini bisa diatasi dengan beberapa cara, salah satunya adalah menggunakan **Double Buffering**.

Double Buffering merupakan teknik untuk membuat proses *render* menjadi dua kali secara terpisah. *Render* akan
dilakukan menggunakan memori sebelum akhirnya pada layar[2]. Dengan demikian, tampilan aplikasi akan lebih *smooth*
karena proses *render* telah selesai sebelumnya di memori sebelum ditampilkan pada layar.

## Mengatasi Lag DataGridView (*Flickering*)

Tutorial kali ini akan membahas cara mengaktifkan **Double Buffering** menggunakan cara **Reflection**.

Pada project yang sudah ada, buat file baru dengan nama **DoubleBufferExtension.cs** (C#). Kemudian salin rekat kode di
bawah ini ke dalam file yang telah dibuat. Untuk versi VB.NET dari kode ini, Anda bisa melakukan konversi melalui
berbagai konverter kode *online* atau berikan komentar untuk mendapat *source code* versi VB.NET.

Buka form dengan DataGridView yang akan digunakan, kemudian panggil kode berikut.

```csharp
using System.Diagnostics;
using System.Reflection;
using System.Windows.Forms;

namespace Kodesiana.Extension {
    public static class BindingExtension {
        public static void DoubleBuffered(this DataGridView dgv, bool state) {
            var type = dgv.GetType();
            var prop = type.GetProperty("DoubleBuffered", BindingFlags.Instance | BindingFlags.NonPublic);
            Trace.Assert(prop != null, "prop != null");
            prop.SetValue(dgv, state, null);
        }
    }
}
```

Sekarang Anda bisa melakukan *debugging* dan melihat perbedaannya. Berikut adalah video perbedaan antara DataGridView
dengan menggunakan Double Buffer dan tidak.

Pada video di atas, dapat dilihat dengan menggunakan Double Buffer *scroll* menggunakan tetikus lebih *smooth* dan
tidak *lag*.

## Tips Aplikasi Tidak Lag/Flickering

1. Jangan menampilkan banyak data dalam satu form, gunakan *pagination* untuk membatasi jumlah data yang tampil pada
   form.
2. Kurangi jumlah kontrol pada satu form.
3. Aktifkan Double Buffering pada kontrol yang *lag/flickering*.

Anda dapat menggunakan *method* `DoubleBuffered(bool state)` pada SEMUA JENIS KONTROL pada Windows Forms. Ini berarti
Anda dapat menghilangkan *lag/flickering* pada semua kontrol pada form, bukan hanya DataGridView. Anda dapat menggunakan
teknik Double Buffer ini pada **Form, Panel, GroupBox, ListView**, dan kontrol lain yang menyebabkan *lag/flickering*.

## Update! Library Paging dan Styling DataGridView

Penulis telah membuat sebuah library untuk memudahkan *paging* dan *styling* DataGridView. Pada library ini
fitur **double buffering** sudah terintegrasi dan dapat langsung digunakan. Selain itu, terdapat banyak fitur lain
seperti *styling* DataGridView agar tampilannya lebih menarik.

Baca artikel lengkapnya pada artikel
[Teknik Pagination dan Styling DataGridView C#/VB.NET](https://kodesiana.com/post/teknik-pagination-dan-styling-untuk-datagridview/).

Source code:
[https://github.com/Kodesiana/Artikel/tree/master/2018/fast-datagridview](https://github.com/Kodesiana/Artikel/tree/master/2018/fast-datagridview)

## Referensi

1. Indonesia. 2016. How To Double buffer .NET controls on a form
   ([*https://stackoverflow.com/questions/76993/how-to-double-buffer-net-controls-on-a-form*](https://stackoverflow.com/questions/76993/how-to-double-buffer-net-controls-on-a-form)).
   Diakses 15 Mei 2018.
2. Microsoft. 2017. Double Buffered Graphics
   ([*https://docs.microsoft.com/en-us/dotnet/framework/winforms/advanced/double-buffered-graphics*](https://docs.microsoft.com/en-us/dotnet/framework/winforms/advanced/double-buffered-graphics)).
   Diakses 15 Mei 2018.
