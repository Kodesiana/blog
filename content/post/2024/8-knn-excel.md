---
title: 'Implementasi K-Nearest Neighbor (KNN) menggunakan Microsoft Excel🌺'
date: 2024-12-30
categories: [Data Science]
tags: [kuliah, programming, python, tutorial, knn, microsoft excel]
series: [Machine Learning 101]
description: Membuat model machine learning menggunakan Microsoft Excel?!
image: https://assets.kodesiana.com/posts/2024/knn-iris-excel/knn-iris-excel-cover_comp.jpg
math: true
---

> Foto sampul oleh [Julie Blake Edison](https://unsplash.com/@julieblake?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) dari [Unsplash](https://unsplash.com/photos/a-close-up-of-a-purple-and-white-flower-DjC-WvXclHA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

{{< button content="Unduh Dataset Iris" icon="download" href="https://blobs.kodesiana.com/kodesiana-data-open/_open-source/iris.csv" >}}

Model *machine learning* biasanya dibuat menggunakan bahasa pemrograman Python atau aplikasi *data mining* seperti WEKA, Orange, dan RapidMiner. Tapi apa jadinya jika kita membuat model *machine learning* menggunakan **Microsoft Excel**?😉

Penulis sebelumnya sudah pernah membuat artikel mengenai metode KNN untuk melakukan klasifikasi pada artikel [Klasifikasi Bunga Iris menggunakan Metode K-Nearest Neighbor (KNN) dengan Python🌺](/post/klasifikasi-bunga-iris-menggunakan-knn-python/). Pada artikel ini kita akan mengimplementasikan metode KNN pada artikel tersebut menggunakan Microsoft Excel.

Kita akan banyak menggunakan fitur *dynamic array* pada Microsoft Excel dan penulis akan menggunakan Microsoft Office 2021. Pastikan kamu memiliki versi Microsoft Office yang sama atau Office 365.

## Review Metode KNN📐

Metode KNN bekerja dengan cara mencari sejumlah N "tetangga" dengan jarak paling rendah atau dengan kata lain mencari sebanyak N data yang memiliki karakteristik paling mirip. Secara umum, model KNN biasanya menggunakan ukuran jarak Euclidean, tetapi pada kenyataannya ada banyak ukuran jarak lain, misalnya jarak Manhattan, Chebyshev, dll.

Pada artikel ini kita akan mencoba untuk mengimplementasikan dua ukuran jarak, yaitu jarak Euclidean dan Manhattan.

Jarak Euclidean:

$$
d(x,y) = \|p-q\| = \sqrt {(p_{1}-q_{1})^{2}+(p_{2}-q_{2})^{2}+\cdots +(p_{n}-q_{n})^{2}}
$$

Jarak Manhattan:

$$
d(x,y)_{\text{T}} = \left\|\mathbf {p} -\mathbf {q} \right\|_{\text{T}} = \sum _{i=1}^{n}\left|p_{i}-q_{i}\right|
$$

{{< image-group "Visualisasi persamaan jarak Euclidean dan Manhattan. Sumber: Wikipedia [1, 2]" >}}
    {{< image-item "https://upload.wikimedia.org/wikipedia/commons/1/10/Euclidean_distance_3d_2_cropped.png" "Euclidean distance" "55%" >}}
    {{< image-item "https://upload.wikimedia.org/wikipedia/commons/0/08/Manhattan_distance.svg" "Manhattan distance" "45%" >}}
{{</ image-group >}}

Jangan takut dengan persamaan matematika di atas, kita akan implementasikan persamaan di atas dengan menggunakan beberapa formula Excel yang mungkin kamu belum pernah gunakan sebelumnya.

## *Dynamic Array* dan *Spill*🖇️

Sebelum kita mulai membuat *workbook* untuk menginputkan data dan melakukan prediksi, kita perlu belajar sedikit mengenai *dynamic array* dan *spill*. Beberapa fungsi pada Microsoft Excel dapat mengoutputkan *dynamic array* atau disebut juga *spilling*, artinya fungsi-fungsi ini mengoutpukan lebih dari satu output [3, 4].

Fungsi seperti `SUM` dan `AVERAGE` hanya mengoutputkan satu nilai, jumlah dan rata-rata. Tetapi beberapa fungsi lain misalnya `UNIQUE` bisa menghasilkan lebih dari satu output dan outputnya akan berada pada baris di bawah sel di mana fungsi ini dibuat, maka dari itu outputnya *spilled* atau "tumpah" lebih dari satu sel.

Sayangnya fitur ini hanya tersedia pada Microsoft Office 2021 atau yang lebih baru misalnya Office 365. Pada versi Office lama, fungsi ini bisa dibuat dengan menggunakan <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>ENTER</kbd>.

## Implementasi KNN🧶

Oke kita akan mulai membuat model klasifikasi!

Tahap pertama adalah membuat *workbook* baru dan membuat tiga sheet dengan nama `Dataset`, `Prediksi`, dan `Proses`. Ketiga *sheet* ini akan menyimpan data latih, form untuk menginput data prediksi, dan melakukan proses perhitungan jarak dan implementasi metode KNN.

### Input Dataset

Silakan unduh data Iris yang terdapat pada bagian atas artikel, kemudian inputkan data tersebut ke dalam *sheet* `Dataset`. Untuk memudahkan kita untuk merujuk ke data ini dari *sheet* lain, kita bisa membuat tabel pada data Iris dengan cara klik menu **Insert > Table** dan jangan lupa centang *My table has header*. Beri nama tabel ini sebagai `dataset` pada *ribbon* **Table Design**.

![Tabel dataset](https://assets.kodesiana.com/posts/2024/knn-iris-excel/fig1_dataset_comp.png)

Pastikan kamu sudah memiliki tabel seperti yang terdapat pada gambar di atas.

> Ingat! Dataset iris memiliki lima kolom/atribut dengan empat atribut input dan satu atribut target yaitu spesies. Tujuan klasifikasi ini adalah memprediksi spesies tanaman bunga iris berdasarkan ukuran kelopak bunganya.

### Membuat Form Input

Tahap selanjutnya adalah membuat *sheet* untuk menginputkan parameter KNN dan input data untuk prediksi. Parameter yang akan kita gunakan adalah (1) banyaknya *nearest neighbor* dan (2) ukuran jarak (Euclidean dan Manhattan). Selain itu kita juga akan membuat input data untuk prediksi. Pada bagian akhir kita akan membuat bagian output klasifikasi.

![Form input](https://assets.kodesiana.com/posts/2024/knn-iris-excel/fig2_input_form_comp.png)

Pada contoh di atas, sel `D9` berisi input berapa banyak *nearest neighbor* dan `D10` berisi ukuran jarak. Kamu juga bisa menambahkan *data validation* pada sel `D10` untuk mencegah kesalahan pengisian nama ukuran jarak.

*Range* `B14:E14` digunakan sebagai input atribut untuk prediksi dan sel `B17` dan `D17` akan berisi output hasil klasifikasi.

### Implementasi Proses KNN

Pada tahap ini kita akan mengimplementasikan proses KNN dengan menggunakan banyak fungsi *dynamic array*. Kita akan membuat *sheet* proses seperti berikut ini.

![*Sheet* implementasi KNN](https://assets.kodesiana.com/posts/2024/knn-iris-excel/fig3_process_comp.png)

#### Menghitung Jarak Euclidean dan Manhattan

Tahap pertama pada proses ini adalah menyalin input dataset dari *sheet* `Dataset` menggunakan nama tabel. Tambahkan fungsi berikut pada sel `A3`.

```m
=dataset
```

Tahap selanjutnya kita akan menyalin input data untuk diprediksi dari *sheet* `Prediksi`, kemudian input yang sama akan diulang sejumlah baris pada dataset input. Untuk mengulang data yang sama, kita bisa menggunakan gabungan fungsi `SEQUENCE` untuk membuat *array* sejumlah input data (`COUNTA`) dan menggunakan fungsi `IF` untuk mengoutputkan nilai pada *range* B14:E14 yang berisi input data pada *sheet* `Prediksi`.

```m
=IF(SEQUENCE(COUNTA(dataset[species]));Prediksi!B14:E14)
```

Tahap selanjutnya adalah menghitung jarak antara data input dan data kueri menggunakan persamaan jarak Euclidean dan Manhattan. Kali ini kita bisa menggunakan fungsi `IF` dan fungsi `SQRT`, `SUMXMY2`, `SUM`, dan `ABS` untuk menghitung kedua jarak tersebut.

```m
=IF(Prediksi!$D$10="Euclidean";SQRT(SUMXMY2(A3:D3;F3:I3));SUM(ABS(A3:D3-F3:I3)))
```

Penjelasan formula:

Untuk menghitung jarak Euclidean:

- `SQRT` berarti *squared root* atau akar pangkat dua
- `SUMXMY2` berarti jumlahkan X *minus* Y pangkat dua atau sama dengan $\sum{{(X-Y)}^2}$

Untuk menghitung jarak Manhattan:

- `SUM` untuk menjumlahkan
- `ABS` untuk mengambil nilai absolut dari selisih dua angka

Menarik ya? Siapa sangka Excel sudah memiliki fungsi bawaan untuk menghitung *sum of squares* dan ternyata kita bisa menggunakan *dynamic array* pada fungsi-fungsi tersebut. Kita juga ternyata bisa melakukan pengurangan pada dua *range* seperti yang terdapat pada formula untuk menghitung jarak Manhattan.

Tapi, ternyata implementasi di atas bukanlah cara yang paling efektif loh!

Jika kita menggunakan Office 365, kita tidak perlu menggunakan formula `IF(SEQUENCE(COUNTA(...)))` untuk menyalin data input, tapi kita bisa menggunakan formula `BYROW` dan `LAMBDA` secara langsung untuk menghitung jarak Euclidean dan Manhattan.

#### Mengurutkan Spesies berdasarkan Jarak dan Top-K

Setelah kita memiliki jarak yang bisa kita mulai mengurutkan jarak tersebut dari yang terkecil hingga yang terbesar kemudian mengambil sebanyak N baris data yang memiliki jarak paling kecil. Untuk mengurutkan data pada suatu *range* berdasarkan data pada *range* lain, kita bisa menggunakan formula `SORTBY`.

```m
=SORTBY(dataset[species];J3:J152)
```

Pada contoh di atas kita akan mengambil kelas target/spesies bunga iris, diurutkan berdasarkan jarak yang sudah dihitung sebelumnya. Pada tahap selanjutnya, kita akan mengambil sejumlah N target kelas dengan kemiripan paling besar antara dataset dan data input prediksi. Kali ini kita akan menggunakan fungsi `OFFSET`.

```m
=OFFSET(M3#;0;0;Prediksi!D9)
```

Fungsi `OFFSET` biasanya digunakan untuk mengambil data dengan *offset* sejumlah baris dan kolom tertentu. Misalnya jika input adalah sel A1 dan *offset* yang digunakan adalah 2 baris, maka fungsi ini akan mengoutputkan sel A3 karena sel ini berada dua sel di bawah A1. Tapi kita bisa menggunakan fungsi ini untuk mengambil N data tanpa *offset* dengan cara menginputkan offset sebesar 0 dan menginputkan sel `Prediksi!D9` yang berisi berapa banyak *nearest neighbor* sebagai output banyaknya baris yang akan dikembalikan.

Selain fungsi `OFFSET`, Office 365 juga memiliki fungsi `TAKE` yang di desain untuk mengambilk sejumlah N baris atau kolom.

#### Menghitung Kemunculan Kelas dan Probabilitas

Hampir selesai! Sekarang kita perlu mencari nilai unik pada atribut target atau kolom spesies bunga iris yang akan kita prediksi. Kita bisa menggunakan fungsi `UNIQUE` untuk mengembalikan nilai unik pada kolom spesies.

```m
=UNIQUE(dataset[species])
```

Selanjutnya, kita perlu menghitung ada berapa banyak kemunculan spesies pada data N data terdekat seperti yang sudah kita buat pada tahap sebelumnya menggunakan fungsi `COUNTIFS`.

```m
=COUNTIFS(N3#;O3#)
```

Fungsi `COUNTIFS` di atas akan menghitung berapa banyak kemunculan spesies pada *range* O3# untuk setiap spesies pada *range* N3#. Tanda # pada input menunjukkan bahwa sel ini merupakan sel dengan output *dynamic array*.

Tahap selanjutnya adalah membagi jumlah kemunculan spesies dengan total kemunculan untuk mendapatkan nilai probabilitas per kelas.

```m
=P3#/SUM(P3#)
```

Selesai! Sekarang kita sudah punya semua informasi yang kita butuhkan untuk menyajikan output pada *sheet* `Prediksi`.

#### Menampilkan Hasil Klasifikasi

Untuk menampilkan hasil klasifikasi, kita perlu mengurutkan nama spesies berdasarkan banyaknya kemunculan spesies terbesar ke terkecil. Kita bisa menggunakan fungsi `SORTBY` untuk melakukan hal ini.

```m
=SORTBY(Proses!O3#;Proses!O3#;-1)
```

Selanjutnya, kita akan menampilkan probabilitas untuk setiap kelas dengan menggunakan fungsi `XLOOKUP`.

```m
=XLOOKUP(B17#;Proses!O3#;Proses!Q3#)
```

Formula `XLOOKUP` mirip seperti `VLOOKUP` dan `HLOOKUP`, tetapi formula ini bisa digunakan secara vertikal dan horizontal dan memiliki banyak fitur lain seperti nilai *default* dan arah pencarian data.

Nah, sampai di sini kita sudah selesai mengimplementasikan metode KNN menggunakan Microsoft Excel! Sekarang coba ubah nilai input pada *range* B14:E14 dan lihat output prediksi berubah sesuai dengan input data secara *real-time*.

## Perbedaan Implementasi dengan KNN pada Python🤔

Perbedaan utama yang bisa kita lihat adalah pada implementasi ini kita perlu menyimpan input data *training*, sedangkan model misalnya `KNeighborsClassifier` tidak memerlukan data *training* untuk melakukan prediksi. Hal ini disebabkan oleh perbedaan implementasi untuk pencarian *nearest neighbor*.

Pada contoh ini kita mencari *nearest neighbor* secara langsung dengan data *trainining*, sedangkan `KNeighborsClassifier` menggunakan struktur data *K-D Tree* untuk menyimpan informasi ketetanggaan pada data *training* dan proses pencarian dapat dilakukan dengan menjelajahi *tree* tersebut, sehingga tidak diperlukan data *training* pada proses prediksi.

## Penutup📘

{{< button content="Unduh Workbook Klasifikasi KNN" icon="download" href="https://l.kodesiana.com/excel-iris-knn" >}}

Wah tidak terasa kali ini kita sudah membuat implementasi metode *machine learning* menggunakan Microsoft Excel!

Kita sudah belajar mengenai apa itu *dynamic array* dan *spill*, bagaimana cara menggunakan fungsi dengan *dynamic array*, serta menggunakan beberapa fungsi seperti `SEQUENCE` dan `SUMXMY2` untuk membantu mengimplemetasikan metode KNN seperti ukuran jarak Euclidean.

Kira-kira apa lagi proyek yang menarik untuk diimplementasikan dengan Microsoft Excel? Jangan lupa berikan komentar ya!

## Referensi📚

1. Kmhkmh. 2018. [File:Euclidean distance 3d 2 cropped.png](https://commons.wikimedia.org/wiki/File:Euclidean_distance_3d_2_cropped.png). Diakses 19 Oktober 2024.
2. Psychonaut. 2006. [File:Manhattan distance.svg](https://commons.wikimedia.org/wiki/File:Manhattan_distance.svg). Diakses 19 Oktober 2024.
3. Microsoft. 2024. [Dynamic array formulas and spilled array behavior](https://support.microsoft.com/en-us/office/dynamic-array-formulas-and-spilled-array-behavior-205c6b06-03ba-4151-89a1-87a7eb36e531). Diakses 19 Oktober 2024.
4. Bruns, Dave. 2024. [Dynamic array formulas in Exce](https://exceljet.net/articles/dynamic-array-formulas-in-excel). Diakses 19 Oktober 2024.
5. Sklearn. 2024. [KNeighborsClassifier](https://scikit-learn.org/dev/modules/generated/sklearn.neighbors.KNeighborsClassifier.html). Diakses 20 Oktober 2024.
