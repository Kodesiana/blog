---
title: 'Scraping dan Visualisasi Gempa BMKG dengan Microsoft Excel🌏'
date: 2024-10-31
categories: [Data Science]
tags: [visualisasi, microsoft excel, geoscience]
description: Mengunduh data dari BMKG dan memproses data menggunakan Microsoft Excel
image: https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/_gempa-cover_comp.png
---

Masih dalam semangat turnamen Microsoft Excel🔥, pada artikel kali ini kita akan coba mengunduh data gempa bumi dari BMKG kemudian memvisualisasikan data tersebut menggunakan Microsoft Excel. Kita akan coba menggunakan fitur Power Query untuk mengolah data JSON dari server BMKG dan penulis juga akan berbagi data yang sudah penulis kumpulkan sendiri untuk analisis yang lebih menyeluruh.

## Data Terbuka BMKG🔍

Tahu kah kamu kalau BMKG menyediakan portal data terbuka? Portal ini menyediakan data cuaca dan gempa bumi yang dapat kita akses dengan mudah dalam format XML dan JSON [1]. Kali ini, kita akan coba untuk mengolah data gempa bumi. Kamu bisa mengakses portal Data Terbuka BMKG pada tautan berikut.

{{< button content="Akses Data Terbuka BMKG" icon="world" href="https://data.bmkg.go.id/" >}}

Secara umum, BMKG menyediakan 4 jenis data gempa bumi, yaitu:

1. Gempa bumi terbaru (autogempa) XML/JSON
2. Daftar 15 gempa bumi dengan magnitudo > 5.0 SR (gempaterkini) XML/JSON
3. Daftar 15 gempa bumi dirasakan (gempadirasakan) XML/JSON
4. Gambar *shakemap* JPG

Pada artikel kali ini, kita akan coba mengolah data gempa bumi dirasakan. Berikut adalah contoh data [gempadirasakan.json](https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json).

```json
{
    "Infogempa": {
        "gempa": [
            {
                "Tanggal": "18 Okt 2024",
                "Jam": "15:26:54 WIB",
                "DateTime": "2024-10-18T08:26:54+00:00",
                "Coordinates": "-5.79,112.44",
                "Lintang": "5.79 LS",
                "Bujur": "112.44 BT",
                "Magnitude": "3.8",
                "Kedalaman": "4 km",
                "Wilayah": "Pusat gempa berada di laut 130km timur laut Tuban",
                "Dirasakan": "II Bawean"
            }
        ]
    }
}
```

Dikutip dari laman Data Gempabumi Terbuka BMKG, berikut adalah keterangan setiap atribut:

- `Tanggal` dan `Jam` dalam WIB
- `DateTime` sesuai ISO 8601 dalam UTC (+00:00)
- `Magnitude` atau magnitudo merupakan kekuatan gempa
- `Kedalaman` dalam kilometer (km)
- `Koordinat` Lintang dan Bujur
- `Susunan` key coordinates adalah latitude kemudian longitude
- `Wilayah` terdekat dengan lokasi episenter gempabumi
- `Potensi` tsunami atau tidak, dan status gempa dirasakan
- `Dirasakan` merupakan wilayah yang merasakan gempa dalam skala MMI
- `Gambar` Shakemap (peta guncangan) diawali dengan URL https://data.bmkg.go.id/DataMKG/TEWS/

Jika kita lihat dengan seksama, tidak ada atribut `Potensi` dan `Gambar` pada dataset karena atribut ini hanya tersedia pada data gempa bumi terbaru dan gempa bumi magnitudo > 5.0 SR.

Selain itu, jika kita perhatikan contoh datanya, kolom `Coordinates` berisi koordinat (latitude/longitude) tetapi dalam format teks (*string*). Sama halnya dengan atribut `Magnitude` dan `Kedalaman` yang dapat dikonversi menjadi angka. Untuk mengolah data tersebut, kita akan menggunakan transformasi data pada **Power Query**.

> Penulis menggunakan Microsoft Office 2021.

## Microsoft Excel Power Query💎

**Power Query (Get & Transform)** adalah fitur untuk mengimpor/menghubungkan data eksternal dan melakukan transformasi/manipulasi data ke dalam Microsoft Excel [2]. Dengan demikian, kita bisa menggabungkan banyak sumber data misal dari web, file CSV atau Excel eksternal, bahkan hingga memuat data dari basis data seperti Hadoop, MySQL, Postgres, dan lain-lain (OLEDB/ODBC). Fleksibilitas ini tentunya akan sangat memudahkan *data analyst* untuk membuat *insight* dan *dashboard* dari data menggunakan Excel, **tanpa ngoding!**

Secara umum terdapat empat langkah dalam menggunakan Power Query, yaitu:

1. **Connect**, menghubungkan data eksternal dengan *workbook*
2. **Transform**, melakukan manipulasi dan transformasi data tanpa mengubah data sumber
3. **Combine**, menggabungkan data dari beberapa sumber
4. **Load**, memuat data yang sudah ditransformasi ke dalam *worksheet* atau *Data Model*

Pada artikel kali ini, kita akan melakukan tiga proses saja yaitu **Connect**, **Transform**, dan **Load** untuk mendemonstrasikan bagaimana cara menggunakan *Power Query* dan potensinya untuk melakukan analisis data. Pastikan versi Microsoft Excel kamu memiliki tab **Data** dan menu *Get & Transform Data*.

![Get & Transform Data](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig1_power_query_ribbon.png)

## Connect: Mengunduh Data dari BMKG📤

Tahap pertama pada proses ini tentunya adalah memuat data. Seperti yang sudah penulis jelaskan sebelumnya, *Power Query* bisa menghubungkan data dari berbagai sumber. Pada proses ini kita akan menghubungkan data dari API BMKG dalam format JSON dan data hasil *scraping* oleh penulis dalam format CSV.

Kenapa dari dua sumber? Kita akan bahas nanti😉

### Data dari API BMKG

{{< button content="Unduh Data dari BMKG" icon="download" href="https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json" >}}

Pada tab **Data**, klik **From Web**. Kemudian isikan URL seperti pada tombol di atas.

![Koneksi data dari API BMKG menggunakan Power Query](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig2_import_bmkg_api.png)

Setelah itu, jendela **Power Query Editor** akan muncul dan menampilkan data JSON yang sudah diunduh.

![Data yang berhasil dimuat ke Excel. BMKG hanya menyediakan 15 baris data gempa terkini](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig3_transform_start.png)

Sampai di sini, kita bisa melakukan transformasi data awal agar data yang kita muat sudah dalam bentuk tabel. Ingat, data asli dari BMKG terdapat di dalam *array* `Infogempa.gempa`, sehingga kita perlu melakukan *drill down* ke *array* tersebut agar bisa dimuat sebagai tabel.

Cukup *double click* pada baris [**Infogempa** Record] dan kemudian pada [**gempa** List], klik kanan dan pilih menu **To Table**.

![Transformasi data menjadi tabel](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig4_to_table.png)

![Konfirmasi transformasi data](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig5_to_table_confirm.png)

Setelah proses konversi dilakukan, sekarang kita sudah bisa mulai melakukan transformasi data dari format *Record* menjadi kolom. Klik pada tombol pada kolom **Column1**, kemudian hilangkan ceklis pada *Use original column name as prefix* karena kita tidak perlu nama kolom asli sebagai prefiks. Setelah itu, klik **OK**.

![Lokasi tombol *expand columns*](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig6_expand_cols.png)

![Konfirmasi *expand columns*](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig7_expand_cols_confirm.png)

Untuk memuat data dari *Power Query Editor* ke dalam *worksheet*, klik **Close & Load**.

![Memuat data ke dalam *worksheet*](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig8_load_data.png)

Selesai! Sekarang kita sudah punya dataset gempa terkini yang diambil langsung dari API BMKG.

![Tampilan data yang sudah ditransformasi dan dimuat](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig9_loaded_data.png)

Sampai di sini kita sudah selesai memuat dan melakukan transformasi data. Tahap selanjutnya kita bisa melakukan transformasi lebih lanjut untuk mengonversi tipe data menjadi numerik misalnya pada kolom `Magnitude` dan `Kedalaman`, tetapi proses tersebut tidak akan kita lakukan menggunakan data ini karena hanya terdapat 15 data.

*To recap*, pada bagian ini kita sudah belajar bagaimana Microsoft Excel dapat mengunduh data secara langsung dari API dengan respons JSON dan bagaimana kita bisa melakukan transformasi data sederhana agar data tersebut dapat disajikan dalam bentuk tabel. Selain itu, karena kita menggunakan Power Query, kita bisa memperbarui data dari server dengan cara klik menu **Tab Query > Refresh**. Semua proses unduh dan transformasi data ini kita lakukan tanpa koding sama sekali!

> Latihan: coba implementasi proses di atas menggunakan Python dan Pandas!

### Data dari Scraping Kodesiana

Pada pembahasan sebelumnya, kita sudah lihat bahwa BMKG hanya menyediakan 15 data gampa terbaru, tidak ada data historis yang lebih lama. Maka dari itu, penulis sudah menyiapkan *script* untuk melakukan *scraping* secara berkala setiap hari agar penulis bisa mendapatkan data historis. Per 18 Oktober 2024, penulis sudah memiliki 1103 baris kejadian gempa dari BMKG. Dengan data ini, kita bisa membuat visualisasi data yang lebih menarik.

{{< button content="Unduh Dataset Agregat" icon="download" href="https://blob.kodesiana.com/kodesiana-ai-public/datasets/original/gempa_bmkg_2024/gempa_dirasakan.csv" >}}

> Sitasi dataset: Fiqri, F.N. (2024). Agregat data gempa terkini BMKG (Versi 1) [Dataset]. https://l.kodesiana.com/dataset-gempa-dirasakan-bmkg-2024

Salin tautan dataset pada tombol di atas, kemudian muat data menggunakan **Power Query** pada menu **Get & Transform Data > Get Data > From Web** seperti pada pembahasan sebelumnya. Selanjutnya, klik tombol **Load** untuk memuat data ke *sheet* `gempa_dirasakan`.

Sampai di sini kita sudah punya data yang mirip seperti data dari BMKG, tetapi masih perlu banyak proses transformasi sebelum data tersebut bisa kita gunakan. Periksa baik-baik data ini sebelum melanjutkan ke tahap selanjutnya!

## Transformasi Data⚡

Tahap kedua dari proses visualisasi data ini adalah transformasi data. Pada pembahasan sebelumnya, kita sudah mengidentifikasi beberapa anomali data, yaitu:

1. `tanggal` dan `jam`, kolom ini dapat kita hapus dan ganti dengan kolom `date_time`. Kolom `date_time` berisi tanggal dalam format ISO 8601
2. `lintang` dan `bujur` memiliki deskripsi LU/LS dan BT/BB. Keterangan ini tidak kita perlukan karena kita bisa ganti dengan data pada kolom `coordinates` dengan cara memisahkan koordinat berdasarkan koma
3. `magnitude` jika dilihat baik-baik nilainya puluhan (pada *screenshot* penulis) karena penulis menggunakan Microsoft Excel dengan format *locale* bahasa Indonesia, sehingga pemisah desimal yang benar adalah koma. Karena pada dataset pemisah koma adalah titik, maka titik tersebut diabaikan menyebabkan magnitude menjadi puluhan, bukan satuan dengan desimal
4. `kedalaman` memiliki nilai satuan km yang menyebabkan kolom ini menjadi teks. Satuan tersebut perlu kita hapus agar nilainya bisa menjadi angka
5. Kolom lainnya seperti `wilayah`, `dirasakan`, dan `hash` bisa kita abaikan

Nah, lumayan banyak nih proses transformasi yang perlu kita lakukan. Untuk melakukan transformasi dengan *Power Query Editor*, kita bisa menggunakan menu transformasi dan [Power Query M formula language](https://learn.microsoft.com/en-us/powerquery-m/).

Oke sekarang kita bisa mulai proses transformasi data!

Klik kanan pada koneksi data `gempa_dirasakan`, kemudian klik **Edit**.

![Edit connection pada Power Query](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig10_edit_connection.png)

Pada panel kanan **Query Settings**, akan terdapat tiga tahapan pada menu **APPLIED STEPS**,

1. Source
2. Promoted Headers
3. Changed Type

Ketiga tahapan ini secara otomatis ditambahkan oleh *Power Query* untuk setiap sumber data. Sesuai namanya, tiga tahapan tersebut memuat data dari sumber, mengubah baris pertama dari dalam data menjadi kolom, dan mengonversi tipe data pada semua kolom sesuai dengan isi. Tapi sayangnya, tidak selalu hasil konversi otomatis ini dapat menghasilkan output yang benar, contohnya pada kolom `magnitude`. Maka dari itu, kita perlu menghapus langkah ini dengan cara klik pada ikon silang pada samping kiri **Changed Type**.

### Menghapus Kolom

Selanjutnya, kita akan menghapus kolom yang tidak diperlukan, yaitu kolom `tanggal`, `jam`, `lintang`, dan `bujur`. Caranya, tekan tombol CTRL pada *keyboard*, kemudian klik pada kolom-kolom tersebut. Pada tab **Home**, klik **Remove Columns**.

![Menghapus kolom](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig11_remove_cols.png)

Tada! Sekarang kolom tersebut sudah menghilang. Jika dilihat pada panel **Query Settings**, sekarang terdapat langkah baru yaitu **Removed Columns**. Setiap kita melakukan transformasi, semuanya akan tercatat pada panel ini, sehingga kita bisa tau persis apa saja urutan transformasi data yang kita lakukan.

Selain itu, jika kita lihat pada kolom input formula, sekarang terdapat formula baru yaitu:

```m
= Table.RemoveColumns(#"Promoted Headers",{"tanggal", "jam", "lintang", "bujur"})
```

Formula ini mirip seperti formula biasa pada Microsoft Excel, tetapi sebenarnya formula ini bukanlah formula Excel melainkan [Power Query M formula language](https://learn.microsoft.com/en-us/powerquery-m/). Tenang, pada artikel ini kita tidak akan membuat formula ini secara manual karena kita akan menggunakan menu-menu pada *Power Query Editor* saja.

### Pemisahan Kolom `coordinates`

Sekarang kita akan lanjut untuk melakukan normalisasi data pada kolom `coordinates`. Kita akan memisahkan kolom ini menjadi `latitude` dan `longitude`.

Klik pada kolom `coordinates`, kemudian klik **Split Column > By Delimiter...**. Pilih pemisah koma kemudian klik OK.

![Memisahkan kolom berdasarkan koma](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig12_split_coordinates.png)

![Pengaturan pemisahan data](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig13_split_confirm.png)

Sekarang harusnya sudah terdapat dua kolom baru, yaitu `coordinates.1` dan `coordinates.2`, tetapi nilainya ada dalam rentang ratusan hingga belasan ribu. Hal yang sama juga terjadi pada kolom `magnitude`, awalnya masih bilangan desimal tapi sekarang sudah menjadi puluhan. Hal ini disebabkan oleh adanya langkah **Changed Type** yang secara otomatis ditambahkan setelah melakukan pemisahan kolom. Hapus langkah ini dan kita lanjut proses normalisasi datanya.

![Hasil split kolom dan tambahan langkah transformasi](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig14_split_cols_changed_type.png)

```m
= Table.SplitColumn(#"Removed Columns", "coordinates", Splitter.SplitTextByDelimiter(",", QuoteStyle.Csv), {"coordinates.1", "coordinates.2"})
```

Dapat dilihat bahwa output dari langkah ini adalah `coordinates.1` dan `coordinates.2`.

### Normalisasi Nilai Kolom `kedalaman` dan `coordinates`

Tahap selanjutnya adalah menghapus kata " km" pada kolom `kedalaman` agar kolom ini bisa menjadi data numerik. Klik kanan pada kolom ini kemudian klik **Replace Values**.

![Menu **Replace Values**](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig15_replace_values.png)

Masukkan kata " km" pada kolom *Value to Find* dan jangan isi kolom *Replace With*, kemudian klik OK.

```m
= Table.ReplaceValue(#"Split Column by Delimiter"," km","",Replacer.ReplaceText,{"kedalaman"})
```

Lakukan hal yang sama pada kolom `coordinates.1`, `coordinates.2`, dan `magnitude`. Tetapi kali ini ubah titik menjadi koma.

```m
= Table.ReplaceValue(#"Replaced Value",".",",",Replacer.ReplaceText,{"coordinates.1", "coordinates.2", "magnitude"})
```

Setelah itu, ubah nama kolom `coordinates.1` menjadi `latitude` dan kolom `coordinates.2` menjadi `longitude` dengan cara klik kanan pada kolom kemudian klik **Rename...**.

```m
= Table.RenameColumns(#"Replaced Value1",{{"coordinates.1", "latitude"}, {"coordinates.2", "longitude"}})
```

> Kita juga bisa mengubah nama kolom ini pada tahap pemisahan kolom dengan mengubah M formula pada langkah `Table.SplitColumn`

### Konversi Tipe Data

Setelah semua kolom dinormalisasi, tahap terakhir adalah melakukan konversi tipe data untuk setiap kolom menjadi tipe data yang benar. Lakukan langkah-langkah berikut untuk setiap kolom:

1. Klik kolom
2. Pada *ribbon* **Data Type:** pilih tipe data yang sesuai

Lakukan transformasi sesuai arahan berikut.

1. `date_time` = Date/Time/Timezone
2. `latitude`, `longitude`, dan `magnitude` = Decimal Number
3. `kedalaman` = Whole Number

Setelah semua proses transformasi dilakukan, kamu harusnya sudah mendapatkan dataset seperti berikut.

![Hasil transformasi data](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig16_final_transform.png)

Tahap selanjutnya adalah klik pada **Home > Close & Load**.

## Visualisasi Peta 3D🌏

Sampai di sini kita sudah berhasil memuat dan mentransformasi data yang sesuai untuk dapat divisualisasikan. Tetapi, jika kamu gagal untuk mengikuti tahap-tahap di atas, kamu bisa mengunduh file Workbook yang sudah penulis buat.

{{< button content="Unduh Workbook Excel" icon="download" href="https://l.kodesiana.com/excel-gempa-dirasakan-bmkg-2024" >}}

Oke tahap terakhir dari perjalanan kita ini adalah membuat visualisasi. Kali ini kita akan menggunakan 3D Map untuk memvisualisasikan data kejadian gempa. Klik tab **Insert > 3D Map**. Jika versi Excel kamu tidak ada pilihan ini, coba *upgrade* versi Microsoft Office kamu ke versi 2019 atau coba menggunakan Office 365.

![Visualisasi 3D Map](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/fig17_3d_map.png)

Secara *default*, jendela **3D Maps** akan otomatis memasukkan kolom `latitude` dan `longitude` ke lokasi data pada **Layer1**. Tambahkan kolom `magnitude` pada menu **Height** dan kolom `date_time` pada kolom **Time**. Hasilnya akan muncul sebuah *player* dan jika kita klik pada tombol *Play*, maka kita akan mendapat animasi kejadian gempa pada peta dengan tinggi grafik merepresentasikan magnitudo gempa.

{{< video "https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/3dmap_bar.mp4" >}}

Selain menampilkan titik-titik gempa sebagai diagram batang, kita juga bisa mengubah visualisasi menjadi *heatmap* untuk menunjukkan *cluster* gempa bumi dengan magnitudo yang tinggi.

{{< video "https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-excel/3dmap_heatmap.mp4" >}}

Mudah kan, memproses dan membuat visualisasi data dengan menggunakan Excel dan Power Query?

## Penutup⭐

Pada artikel ini kita sudah belajar sedikit mengenai fitur Microsoft Excel yaitu **Power Query**. Kita sudah belajar bagaimana cara memuat data dari web, hingga melakukan transformasi yang cukup kompleks menggunakan *Power Query Editor*. Kita juga sudah belajar cara membuat visualisasi data spasial menggunakan 3D Map.

Masih ada banyak sekali fitur-fitur Microsoft Excel yang bisa membantu kita untuk membuat visualisasi data dengan lebih menarik, misalnya dengan menggunakan *Slicer*. Tapi mungkin itu akan kita bahas pada artikel yang akan datang😉

Pada artikel selanjutnya kita akan coba *explore* lebih banyak proyek lain menggunakan Microsoft Excel. Stay tuned ya!

## Referensi📚

1. BMKG. 2024. [BMKG](https://data.bmkg.go.id/gempabumi/). Diakses 18 Oktober 2024.
2. Microsoft. 2024. [About Power Query in Excel](https://support.microsoft.com/en-us/office/about-power-query-in-excel-7104fbee-9e62-4cb9-a02e-5bfb1a6c536a). Diakses 18 Oktober 2024.
