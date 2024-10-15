---
title: Kamu Terlalu Banyak menggunakan map(🌏) di NodeJS
categories: [Software Engineering]
tags: [programming, tips, nodejs]
date: 2021-06-22
slug: kamu-terlalu-banyak-menggunakan-map-nodejs
---

{{< button content="Soure Code" icon="brand-github" href="https://l.kodesiana.com/legacy-node-gcc-bench" >}}

Fungsi `map` merupakan salah satu fungsi yang terdapat pada ECMAScript 6 yang telah ada sejak 2015 lalu. Fungsi ini
sangat digemari karena sifatnya yang sangat *versatile* dan dapat digunakan hampir untuk semua kasus. Tetapi, tahu kah
kamu selain `map`, ada juga fungsi manipulasi array seperti `filter`, `reduce`, `for`, dan `foreach`?

Kali ini kita akan melihat bagaimana perbedaan performansi beberapa fungsi manipulasi array tersebut untuk mengolah data
di dalam array. Apakah dengan satu fungsi `map` bisa *mengalahkan* semua fungsi array lainnya? Apa benefitnya?

## Uji Statistik Performa Fungsi Array📊

Untuk membandingkan performa beberapa fungsi array tersebut, penulis akan melakukan *A/B testing* atau *Pearson's
T-test*, tepatnya uji *t-Test: Paired Two Sample for Means* untuk mengukur apakah terdapat perbedaan rata-rata waktu
eksekusi yang signifikan antara fungsi array tersebut, khususnya antara `filter` dan `map`.

Kode yang digunakan untuk melakukan tes ini dapat diakses pada repositori GitHub yang merupakan adaptasi dari versi
pengukuran yang telah dibuat sebelumnya (Indonesia: 2019). Tes ini dilakukan pada komputer dengan spesifikasi CPU Intel
Core i5-10400 @ 2.90GHz dan RAM 24 GB 2666 MHz.

<div align="center">
Tabel Hasil Benchmark Fungsi Array dengan 1.000 Elemen (dalam detik)

| Statistik       | filter | for    | foreach | map    | reduce |
| --------------- | ------ | ------ | ------- | ------ | ------ |
| Rata-rata       | 0,0410 | 0,0117 | 0,0407  | 0,0384 | 0,0316 |
| Standar deviasi | 0,0310 | 0,0276 | 0,0761  | 0,0366 | 0,0303 |

Plot Waktu Eksekusi per Iterasi (skala logaritmik)

![Waktu eksekusi 1000 iterasi](https://blob.kodesiana.com/kodesiana-public-assets/posts/2021/3/scatter-1k.png)

</div>

Berdasarkan uji pada 1.000 sampel data, dapat disimpulkan bahwa fungsi `filter` (\\(\mu=0.03, \sigma=0.03\\))
dibandingkan dengan fungsi `map` (\\(\mu=0.03, \sigma=0.03\\)) tidak memiliki perbedaan waktu eksekusi yang signifikan
secara keseluruhan, \\(t(99)=0.9469, p=0.34\\).

<div align="center">
Tabel Hasil Benchmark Fungsi Array dengan 1 juta Elemen (dalam detik)

| Statistik       | filter  | for    | foreach | map     | reduce  |
| --------------- | ------- | ------ | ------- | ------- | ------- |
| Rata-rata       | 43,8718 | 1,0973 | 19,3744 | 26,4738 | 17,7531 |
| Standar deviasi | 2,8958  | 0,2524 | 1,6303  | 0,4237  | 0,6943  |

Plot Waktu Eksekusi per Iterasi (skala linier)

![Waktu eksekusi 1 juta iterasi](https://blob.kodesiana.com/kodesiana-public-assets/posts/2021/3/scatter-1m.png)

</div>

Berdasarkan uji pada 1.000.000 sampel data, dapat disimpulkan bahwa fungsi `filter` (\\(\mu=43.87, \sigma=8.38\\))
dibandingkan dengan fungsi `map` (\\(\mu=26.47, \sigma=0.17\\)) terdapat perbedaan waktu eksekusi yang signifikan secara
keseluruhan, \\(t(99)=59.72, p=0.00\\).

Berdasarkan dua percobaan di atas, dapat disimpulkan bahwa penggunaan fungsi array khususnya `filter` dan `map` pada
dataset yang berukuran kecil memiliki imbas performa yang minimal hingga tidak perlu dikhawatirkan (< 1000 data).
Tetapi, pada dataset dengan jumlah data yang besar (> 1.000.000) dapat dilihat bahwa terdapat perbedaan yang signifikan
antara fungsi `filter` dan `map`. Tetapi pada situasi ini, programmer sebaiknya menggunakan metode lain untuk memproses
data seperti *partitioning, batch processing,* atau *map reduce*.

## Mendalami Source Code NodeJS🌊

Implementasi array pada NodeJS sesuai dengan source code V8 engine pada repositorinya bisa kita lihat pada file
[builtins-array.cc](https://github.com/v8/v8/blob/f5b84bc48eee18ae417c85253ccaf54605fceba5/src/builtins/builtins-array.cc#L306)
dan
[builtins-array-gen.cc](https://github.com/v8/v8/blob/78313016a99b7a0b0e0255389440489376aac4aa/src/builtins/builtins-array-gen.cc#L313).

Pada kode ini bisa kita lihat bahwa proses menambahkan elemen ke dalam array menggunakan fungsi `push` memiliki beberapa
proses pengecekan untuk memastikan bahwa terjadi beberapa proses pengecekan seperti besarnya alokasi array, tipe data,
dan menambah *reference count*.

Penyebab lain fungsi `filter` lebih lambat dibandingkan dengan fungsi lainnya adalah implementasi fungsi `filter`
memiliki beberapa proses [pengecekan tambahan](https://github.com/v8/v8/blob/master/src/builtins/array-filter.tq),
yaitu:

1. Mengabaikan null dan undefined dan kekosongan lain dalam array.
2. Mengubah *execution context* pada fungsi *predicate*.
3. Mencegah fungsi *predicate* mengubah data pada array asli.

Proses tersebut sesuai dengan ECMAScript 2022 (ECMAScript: 2021) dan dikutip dari salah satu artikel (Sanderson: 2011).

Referensi implementasi `foreach`, `filter`, `map`, dan `reduce`:

- [array-foreach.tq](https://github.com/v8/v8/blob/master/src/builtins/array-foreach.tq) /
  [MDN forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
- [array-filter.tq](https://github.com/v8/v8/blob/master/src/builtins/array-filter.tq) /
  [MDN filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [array-map.tq](https://github.com/v8/v8/blob/master/src/builtins/array-map.tq) /
  [MDN map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [array-reduce.tq](https://github.com/v8/v8/blob/master/src/builtins/array-reduce.tq) /
  [MDN reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

Implementasi di atas menggunakan bahasa [Torque](https://v8.dev/docs/torque) yang digunakan oleh developer V8 untuk
membuat implmementasi kode yang *robust* pada mesin V8 tanpa perlu membuat implementasi detail pada source code nya.

Untuk mengetahui lebih dalam mengenai perbedaan performa ini, kita bisa melakukan proses *profiling*, tetapi proses itu
tidak akan kita lakukan sekarang, data di atas sudah cukup representatif untuk menyimpulkan bahwa fungsi `map` bukanlah
fungsi yang *all-for-one*, setiap fungsi punya kelebihan dan kekurangannya masing-masing.

Pada akhir *benchmark*, didapatkan bahwa iterasi menggunakan `for` biasa adalah yang paling cepat, karena tidak terjadi
alokasi data baru untuk membuat array sehingga prosesnya lebih cepat.

## Menggunakan Fungsi Array dengan Tepat✅

Nah setelah kita mengetahui bahwa tiap-tiap fungsi array memiliki performa yang berbeda-beda, apa sih perbedaan antara
fungsi-fungsi array tersebut?

- `map`, digunakan untuk membuat array baru yang merupakan hasil dari memanggil fungsi `f` untuk setiap elemen pada
  array awal. Bisa dibilang ini adalah metode proyeksi setiap elemen dalam array (`SELECT` dalam SQL). Kasus penggunaan:
  ingin mengubah properti yang ada di dalam objek pada array, melakukan transformasi misalnya melakukan kapitalisasi,
  multiplikasi, dan lainnya.
- `filter`, digunakan untuk menyaring elemen dalam array berdasarkan suatu kondisional fungsi `f` untuk setiap elemen
  pada array awal (`WHERE` dalam SQL). Kasus penggunaan: ingin memilih elemen dalam array yang sesuai dengan kondisi
  tertentu.
- `forEach`, memiliki fungsi yang sama seperti iterasi melakukan iterasi menggunakan `for`, yaitu mengekeskusi suatu
  fungsi `f` untuk setiap elemen pada array awal.
- `reduce`, melakukan agregasi nilai pada seluruh elemen array. Kasus: menjumlahkan semua elemen dalam array, mencari
  total penjualan.

Tunggu! `map` dan `forEach` keliatannya sama, kapan kita harus pakai salah satunya? Jika kamu tidak membutuhkan output
dari hasil iterasi array, maka gunakan `forEach`, jika kamu membutuhkan output data dari iterasi array, gunakan `map`
(MDN: 2021).

> **When not to use map()**
>
> Since map builds a new array, using it when you aren't using the returned array is an anti-pattern; use forEach or
> for...of instead.
>
> You shouldn't be using map if: you're not using the array it returns; and/or you're not returning a value from the
> callback.
>
> Sumber: MDN, 2021

## Penutup😊

Nah sekarang kita sudah tahu bahwa pada JavaScript, terdapat banyak fungsi manipulasi array selain `map`, selain itu
kita juga sudah mempelajari bagaimana performa fungsi-fungsi manipulasi array seperti `map`, `filter`, `forEach`, dan
`reduce`. Terakhir, kita juga sudah mempelajari kapan kita harus menggunakan fungsi array yang tepat untuk kasus yang
ingin kita selesaikan.

Semoga artikel kali ini bermanfaat!

## Referensi

1. Indonesia. 2019. [forEach vs reduce vs map vs filter vs for](https://www.measurethat.net/Benchmarks/Show/2235/0/foreach-vs-reduce-vs-map-vs-filter-vs-for). Diakses 17 Mei 2021.
2. Sanderson, Adam. 2011. [Why JavaScript's Native Filter Method is Slow](http://www.monkeyandcrow.com/blog/why_javascripts_filter_is_slow). Diakses 17 Mei 2021.
3. ECMAScript. 2021. [ECMAScript 2022 Language Specification](https://tc39.es/ecma262/#sec-array.prototype.filter). Diakses 17 Mei 2021.
4. MDN. 2021. [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Diakses 22 Juni 2021.
