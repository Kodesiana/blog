---
title: 'Clustering dan Visualisasi Gempa BMKG dengan Kepler.gl🌏'
date: 2024-11-15
categories: [Data Science]
tags: [visualisasi, kepler.gl, geoscience]
description: Visualisasi dan clustering data spasial menggunakan Kepler.gl
image: https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-kepler/bmkg-kepler-cover_comp.png
---

{{< button-group >}}
    {{< button content="Unduh Dataset" icon="download" href="https://l.kodesiana.com/dataset-gempa-dirasakan-bmkg-2024-keplergl" >}}
    {{< button content="Akses Kepler.gl" icon="planet" href="https://kepler.gl/demo" >}}
{{</ button-group >}}

Halo teman-teman, kali ini penulis akan melanjutkan artikel [sebelumnya](/post/scraping-dan-visualisasi-gempa-bmkg-dengan-microsoft-excel/) tentang data gempa BMKG. Pada artikel sebelumnya, kita sudah membahas bagaimana cara mengunduh dan mengolah data gempa dari BMKG menggunakan Microsoft Excel. Tetapi, karena mungkin tidak semua pembaca memiliki akses ke Microsoft Office 2021 atau 365, penulis kali ini akan berbagi bagaimana cara membuat visualisasi geospasial menggunakan aplikasi *open source*, yaitu Kepler.gl

Kita akan coba membuat visualisasi yang sama seperti pada artikel sebelumnya dan kita juga akan coba untuk melakukan *clustering* menggunakan poligon lingkaran dan *hexbin*.

## Mengenal Kepler.gl🌏

Kepler.gl merupakan aplikasi untuk melakukan visualisasi data geospasial dan dapat memvisualisasikan data dalam skala besar. Aplikasi ini dibuat oleh Uber dan juga dapat kita *embed* ke dalam website pribadi kita dan juga tersedia integrasi sebagai komponen React. Aplikasi ini menggunakan WebGPU dan WebGL untuk dapat membuat visualisasi peta tanpa *nge-lag* dan mampu mengatasi data dalam jumlah besar.

Kepler.gl secara umum hanya dapat digunakan untuk menampilkan data saja dan tidak bisa melakukan pengolahan data misalnya *geoprocessing*. Jika kamu ingin melakukan analisis data juga, kamu harus melakukan analisisnya secara lokal atau menggunakan layanan dari [Foursquare Studio](https://location.foursquare.com/).

## Mengimpor Data📤

Seperti yang sudah dijelaskan sebelumnya, kita akan menggunakan data yang sama seperti pada artikel sebelumnya. Kamu bisa menggunakan file Excel yang sudah kamu buat sebelumnya dan mengekspor file Excel tersebut menjadi CSV/JSON, atau kamu juga bisa mengunduh data pada bagian awal artikel ini.

Sekarang kamu bisa buka website Kepler.gl melalui tautan pada bagian awal blog ini. Saat pertama kali membuka website Kepler.gl, kamu akan diminta untuk mengunggah data. Jika tidak muncul jendela unggah data seperti di bawah ini, klik pada tombol **+ Add Data**.

![Menambahkan data ke Kepler.gl](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-kepler/fig1_add_data_comp.png)

Setelah data dimuat, kamu sekarang harusnya sudah bisa melihat titik-titik data.

## Mengatur *Layer* dan *Filters*🔍

![Tapilan peta dengan titik-titik gempa](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-kepler/fig2_map_comp.png)

Pada *sidebar* kiri, kita bisa mengatur beberapa hal. Kita akan mulai dengan pengaturan pada bagian **Basic**. Pada bagian ini kita bisa memilih jenis visualisasi. Pada contoh awal ini kita akan membiarkan pilihan *default*-nya, yaitu **Point**. Jika kita *scroll* ke bawah, kita bisa lihat bahwa untuk menampilkan titik data pada peta, kita perlu memilih atribut/kolom yang berisi *latitude* dan *longitude* yang pada contoh ini sudah otomatis dipilih.

Kita bisa membiarkan pilihan *default* ini dan kita bisa lanjut ke pengaturan selanjutnya yaitu **Radius**. Saat ini peta yang kita miliki menampilkan titik-titik data dengan perbedaan warna yang menampilkan magnitudo gempa. Agar magnitudo gempa dapat lebih mudah dipahami, kita bisa menambahkan atribut ini pada menu **Radius**.

Tahap terakhir adalah menambahkan filter pada kolom `date_time`. Tujuannya adalah agar kita bisa membuat animasi kejadian gempa bumi sepanjang tahun. Klik tab **Filters** kemudian klik **+ Add Filter** dan pilih kolom `date_time`. Berikut adalah pengaturan pada aplikasi Kepler.gl

![Pengaturan **Basic** dan **Radius** serta **Filters**](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-kepler/fig3_config_comp.png)

Setelah kamu mengikuti semua arahan di atas, kamu akan mendapatkan tampilan peta yang kurang lebih sama seperti berikut ini.

{{< video "https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-kepler/kepler_points.mp4" >}}

Kamu juga bisa berkesperimen dengan pilihan pengaturan lain pada Kepler.gl dan coba visualisasi lain misalnya *Heatmap*.

## Clustering dengan Hexbin🐝

Kali ini kita akan coba menampilkan data gempa sebagai *cluster* menggunakan metode *hexbin*. Idenya adalah Kepler.gl akan membuat heksagon pada permukaan bumi dengan luas yang bisa diatur. Titik-titik data yang termasuk dalam heksagon ini kemudian diagregasi misalnya dirata-ratakan atau diambil median-nya untuk divisualisasi.

> Selain visualisasi **Hexbin**, Kepler.gl juga memiliki visualisasi **Grid** yang berupa poligon dengan empat sisi. Heksagon memiliki beberapa kelebihan dibandingkan kisi yang dijelaskan oleh [tim Uber](https://www.uber.com/en-ID/blog/h3/).

Untuk menampilkan data dalam bentuk heksagon, klik pada menu **Basic > Point** dan pilih **Hexbin**. Kemudian pada menu **Radius**, ubah nilai menjadi 45 dan aktifkan menu **Height** dan atur *height multiplier* menjadi 60. Pastikan atribut *Height Based On* dipilih dengan kolom `magnitude`.

Kamu juga bisa mengaktifkan mode 3D dengan cara klik tombol 3D pada pojok kanan atas peta. Hasilnya adalah sebagai berikut.

{{< video "https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/gempa-bmkg-kepler/kepler_hexbin.mp4" >}}

Mudah kan, membuat visualisasi data spasial menggunakan Kepler.gl?

## Penutup📘

Wah tidak terasa kita sudah belajar cara melakukan visualisasi data geospasial tidak hanya menggunakan Microsoft Excel, tapi juga sekarang dengan Kepler.gl. Pada artikel ini kita sudah belajar bagaimana cara menggunakan Kepler.gl secara umum dan bagaimana kita bisa melakukan *clustering* dengan menggunakan **Hexbin**. Visualisasi peta yang dihasilkan juga dapat berupa peta 2D dan 3D bergantung pilihan visualisasi data dan fitur *filters* dapat membuat animasi kejadian gempa bumi.

Sekian untuk artikel kali ini, *stay tuned* untuk artikel yang akan datang!
