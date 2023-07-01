---
title: 'Analytic Hierarchy Process (AHP🏅) menggunakan Python'
categories: Data Science
tags: [kuliah, data mining]
date: 2023-07-01
slug: analytic-hierarchy-process-ahp-menggunakan-python
katex: true
mermaid: true
---

<div class="flex justify-center">
{{< button content="Akses Jupyter Notebook" icon="logos:jupyter" href="https://github.com/Kodesiana/Artikel/blob/master/2023/ahp/ahp.ipynb" >}}
</div>

Analytic Hierarchy Process (AHP) merupakan salah satu metode yang umum digunakan pada sistem penunjang keputusan (SPK) untuk membantu memilih alternatif dari beberapa kriteria. Metode ini tergolong sederhana dan masih sering diperkenalkan pada mahasiswa dan digunakan untuk skripsi atau penelitian.

> AHP merupakan versi khusus dari metode ANP (Analytic Network Process) yang pertama kali diperkenalkan oleh Saaty pada tahun 1980.

Yuk kita belajar bagaimana cara melakukan perhitungan menggunakan metode AHP dan bagaimana implementasinya menggunakan Python!

## 🏅 Metode AHP

> Metode perhitungan AHP manual ini merupakan adaptasi dari [2]

Seperti yang sudah dijelaskan sebelumnya, AHP merupakan salah satu metode yang digunakan pada sistem penunjang keputusan. Pada konteks ini, keputusan yang ingin diambil diformulasikan sebagai **proses untuk memilih alternatif terbaik dari beberapa alternatif yang tersedia berdasarkan perbandingan dua atau lebih kriteria pada setiap alternatif**.

![Foto oleh Jason Goodman](https://source.unsplash.com/vbxyFxlgpjM/1200x657)

### Studi Kasus

Penulis adalah seorang *backend developer* yang baru-baru ini diwajibkan WFO ke Jakarta. Oleh sebab itu, penulis perlu mencari kosan di Jakarta agar bisa WFO setiap hari. Sementara ini penulis punya 3 pilihan lokasi kosan yaitu A01, A02, dan A03.

Dalam pemilihan kosan ini, penulis punya lima kriteria penilaian yaitu:

* C01, harga sewa
* C02, fasilitas kos
* C03, jarak ke kantor
* C04, jarak ke mal
* C05, kemudahan akses

Berdasarkan tiga alternatif dan lima kriteria tersebut, kosan mana yang sebaiknya dipilih oleh penulis?

Seperti biasa, sebelum kita mulai ngoding, kita perlu *import library* terlebih dahulu. Pada tutorial ini kita akan menggunakan *library* `numpy`.

```python
import numpy as np
```

### Hierarki Alternatif

Berdasarkan studi kasus di atas, dapat kita formulasikan studi kasus tersebut menjadi diagram berikut.

{{<mermaid>}}
flowchart TD
    A[Kosan] --> A01 & A02 & A03
    A01 & A02 & A03 --> C01 & C02 & C03 & C04 & C05

    linkStyle 0,1,2 stroke:#ccd5ae
    linkStyle 3,4,5,6,7 stroke:#d4a373
    linkStyle 8,9,10,11,12 stroke:#219ebc
{{</mermaid>}}

Setelah kita tau kasus yang akan kita selesaikan, tahap untuk mengerjakan studi kasus tersebut menggunakan metode AHP adalah sebagai berikut.

1. Membuat perbandingan antar kriteria
2. Membuat perbandingan antar alternatif untuk masing-masing kriteria
3. Normalisasi bobot perbandingan antar kriteria
4. Menghitung *consistency measure (CM), consistency index (CI), ratio index (RI),* dan *consistency ratio (CR)*
5. Jika CR berada pada interval \\(0 \leq CR \leq 0.1\\), artinya keputusan bersifat **konsisten** dan dapat dilanjut untuk penentuan peringkat alternatif. Jika tidak, proses AHP tidak dapat dilanjutkan
6. Normalisasi bobot perbandingan antar alternatif
7. Menentukan peringkat/*ranking* masing-masing alternatif

### Perbandingan antar Kriteria

Tahap pertama dari proses AHP adalah menentukan perbandingan antar kriteria. Metode yang dapat kita gunakan adalah dengan melakukan perbandingan berpasangan (*pairwise comparison*) antar kriteria menggunakan skala 1-9. Perbandingan berpasangan pada dasarnya adalah melakukan perbandingan antar kriteria pada **diagonal utama** dan mengisi **diagonal kedua** dengan invers-nya.

|     | C01   | C02   | C03   | C04   | C05   |
|-----|-------|-------|-------|-------|-------|
| C01 | **1** | 1     | 3     | 1     | 3     |
| C02 | 1     | **1** | 2     | 1     | 1     |
| C03 | 1/3   | 1/2   | **1** | 1     | 2     |
| C04 | 1     | 1     | 1     | **1** | 3     |
| C04 | 1/3   | 1     | 1/2   | 1/3   | **1** |

Matriks di atas dapat kita notasikan dalam bentuk *numpy array* sebagai berikut.

```python
p_criteria = np.array([
    [1,     1,   3,   1, 3],
    [1,     1,   2,   1, 1],
    [1/3, 1/2,   1,   1, 2],
    [  1,   1,   1,   1, 3],
    [1/3,   1, 1/2, 1/3, 1]
])
```

Pada matriks di atas, diagonal matriks dipisahkan oleh angka 1 dan diagonal bawah merupakan invers dari diagonal atasnya. Lalu, apa arti dari matriks ini?

Skala Fundamental Saaty[1, pp163]:

| Skala      | Definisi                                            |
|------------|-----------------------------------------------------|
| 1          | Sama penting                                        |
| 3          | Salah satu kriteria lebih penting daripada lainnya  |
| 5          | Penting                                             |
| 7          | Sangat penting                                      |
| 9          | Sangat amat penting                                 |
| 2, 4, 6, 8 | Nilai tengah antara dua penilaian yang bersebelahan |

Beberapa interpretasi dari matriks di atas:

* Kriteria dibandingkan dengan dirinya sendiri selalu memiliki bobot 1
* C01 dibandingkan dengan C02 memiliki bobot 1, artinya kriteria C01 sama pentingnya dengan kriteria C02
* C01 dibandingkan dengan C03 miliki bobot 3, artinya kriteria C01 lebih penting daripada kriteria C03
* C03 dibandingkan dengan C01 memiliki bobot 3, artinya kriteria C01 lebih penting daripada kriteria C03 (invers dari C01-C03)

### Perbandingan antar Alternatif

Setelah kita punya matriks perbandingan antar kriteria, sekarang kita perlu melakukan hal yang sama pada alternatif. Kali ini, kita akan membuat lima matriks perbandingan alternatif untuk masing-masing kriteria.

Kriteria C01

| A01 | A02 | A03 |
|-----|-----|-----|
| 1   | 3   | 3   |
| 1/3 | 1   | 2   |
| 1/3 | 1/2 | 1   |

Kriteria C02

| A01 | A02 | A03 |
|-----|-----|-----|
| 1   | 2   | 4   |
| 1/2 | 1   | 3   |
| 1/4 | 1/3 | 1   |

Kriteria C03

| A01 | A02 | A03 |
|-----|-----|-----|
| 1   | 2   | 1   |
| 1/2 | 1   | 2   |
| 1   | 1/2 | 1   |

Kriteria C04

| A01 | A02 | A03 |
|-----|-----|-----|
| 1   | 2   | 3   |
| 1/2 | 1   | 6   |
| 1/3 | 1/6 | 1   |

Kriteria C05

| A01 | A02 | A03 |
|-----|-----|-----|
| 1   | 4   | 3   |
| 1/4 | 1   | 2   |
| 1/3 | 1/2 | 1   |

```python
# perbandingan antar alternatif
p_alternatives = np.array([
    # kriteria C01
    [
        [  1,   3, 3],
        [1/3,   1, 2],
        [1/3, 1/2, 1]
    ],
    # kriteria C02
    [
        [  1,   2, 4],
        [1/2,   1, 3],
        [1/4, 1/3, 1]
    ],
    # kriteria C03
    [
        [  1,   2, 1],
        [1/2,   1, 2],
        [  1, 1/2, 1]
    ],
    # kriteria C04
    [
        [  1,   2, 3],
        [1/2,   1, 6],
        [1/3, 1/6, 1]
    ],
    # kriteria C05
    [
        [  1,   4, 3],
        [1/4,   1, 2],
        [1/3, 1/2, 1]
    ]
])
```

Sampai di tahap ini, kita sudah punya dua matriks untuk diolah, `p_criteria` yang berisi perbandingan antar kriteria dan `p_alternatives` yang berisi perbandingan antar alternatif.

Jika kita lihat *shape* pada *numpy array* yang kita punya,

```python
print(p_criteria.shape)
print(p_alternatives.shape)

(5, 5)
(5, 3, 3)
```

Dapat kita lihat bahwa pada `p_criteria` *shape*-nya adalah (5, 5) yang artinya *array* ini memiliki dua dimensi yaitu baris dan kolom, sedangkan pada `p_alternatives` *array* ini memiliki tiga dimensi yaitu nomor matriks, baris, dan kolom. Perhatikan jumlah dimensinya! Karena kita akan banyak melakukan operasi *array* pada *axis* tersebut.

### Normalisasi Bobot

Untuk menormalisasi matriks, kita perlu menghitung total dari kolom pada setiap alternatif, kemudian kita bagi semua elemen pada matriks dengan total dari setiap kolom alternatif. Kemudian, untuk menghitung bobot prioritas kita bisa ambil rata-rata dari setiap baris matriks.

Contoh:

$$
C01 = 1 + 1 + 1/3 + 1 + 1/3 = 3,67
$$

```python
# vektor total untuk semua baris (axis=0)
p_total = np.sum(p_criteria, axis=0)
```

Lakukan perhitungan total ini untuk semua kolom kriteria, kemudian bagi semua elemen pada matriks kriteria dengan total kolomnya. Setelah itu, hitung rata-rata untuk setiap baris kriteria sebagai bobot prioritas.

Contoh menghitung perbandingan C01 dan C01: \\(1 / 3,67 = 0.27\\) dan C02 dan C03: \\(2 / 7.5 = 2.27\\)

$$
C01_{prio} = \frac{0.27+0.22+0.4+0.23+0.3}{5} = 0.285
$$

```python
# matriks normalisasi
p_priority = p_criteria / p_total
# vektor bobot prioritas
p_priority_weight = np.mean(p_priority, axis=1)
```

Didapatkan matriks normal sebagai berikut.

|     | C01  | C02  | C03  | C04  | C05 | Bobot Prioritas |
|-----|------|------|------|------|-----|-----------------|
| C01 | 0,27 | 0,22 | 0,4  | 0,23 | 0.3 | 0.28            |
| C02 | 0,27 | 0,22 | 0,27 | 0,23 | 0.1 | 0.22            |
| C03 | 0,09 | 0,11 | 0,13 | 0,23 | 0.2 | 0.15            |
| C04 | 0,27 | 0,22 | 0,13 | 0,23 | 0.3 | 0.23            |
| C04 | 0,09 | 0,22 | 0,07 | 0,07 | 0.1 | 0.11            |

### Perhitungan *Consistency Ratio (CR)*

*Consistency Ratio (CR)* digunakan untuk mengukur **konsistensi** pada jawaban perbandingan kriteria. Yang dimaksud dengan konsistensi adalah apakah perbandingan kriteria yang diinputkan tidak saling bertolak belakang antara satu kriteria dengan kriteria yang lainnya.

Untuk menghitung CR, kita perlu menghitung *Consistency Measure (CM)* terlebih dahulu dengan cara melakukan perkalian dot pada matriks perbandingan kriteria yang sudah dinormalisasi dengan matriks kriteria yang asli kemudian dibagi dengan bobot prioritas baris pada kriteria tersebut.

Contoh CM pada baris kriteria C01:

$$
CM_{C01} = \frac{1 \times 0,28 + 1 \times 0,22 + 3 \times 0,15 + 1 \times 0,23 + 3 \times 0,11}{0,285} = 5,363
$$

```python
# perkalian dot untuk menghitung CM
p_consistency = np.dot(p_criteria, p_priority_weight) / p_priority_weight
```

Setelah didapatkan nilai CM untuk semua kriteria, tahap selanjutnya adalah menghitung *Consistency Index (CI)* menggunakan formula berikut.

$$
CI=\frac{\lambda_{max}-n}{n-1}
$$

dengan \\(\lambda_{max}=\overline{CM}\\) dan \\(n\\) adalah banyaknya kriteria.

Didapatkan:

$$
\lambda_{max} = \frac{5,365 + 5,278 + 5,299 + 5,275 + 5,198}{5} = 5,2826
$$

Maka,

$$
CI = \frac{5,2826 - 5}{5-1} = 0,071
$$

Setelah nilai CI didapatkan, satu tahap terakhir sebelum menghitung CR adalah mencari nilai *Ratio Index (RI)*. Nilai untuk *RI* sudah ditentukan oleh Saaty[1] dan rentangnya adalah sebagai berikut.

| Ordo matriks  | 1 | 2 | 3    | 4   | 5    | 6    | 7    | 8    | 9    | 10   |
|---------------|---|---|------|-----|------|------|------|------|------|------|
| *Ratio index* | 0 | 0 | 0,58 | 0,9 | 1,12 | 1,24 | 1,32 | 1,41 | 1,46 | 1,49 |

Karena pada studi kasus ini kita memiliki lima kriteria, maka \\(RI=1,12\\). Akhirnya, kita bisa hitung CR sebagai berikut.

$$
CR=\frac{CI}{RI}=\frac{0,071}{1,12}=0,063
$$

```python
ratio_index_saaty = np.array([0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.46, 1.49])

n = p_criteria.shape[0]
lambda_max = np.mean(p_consistency)

RI = ratio_index_saaty[n]
CI = (lambda_max - n) / (n - 1)
CR = CI / RI

print(CR)
```

Karena nilai CR lebih kecil daripada 0,1, artinya perbandingan kriteria sudah **konsiten**. Tahap selanjutnya adalah melakukan proses normalisasi yang sama pada matriks perbandingan alternatif dan proses peringkat/*ranking* alternatif.

### Menentukan Alternatif Terbaik

Setelah diketahui nilai CR yang didapat berada pada rentang konsisten, kita bisa lanjut menghitung bobot prioritas untuk kelima matriks perbandingan antar alternatif. Setelah itu, kita susun bobot prioritas dari kelima matriks perbandingan alternatif menjadi satu super matriks yang berisikan (1) bobot prioritas matriks perbandingan kriteria, (2) bobot prioritas dari kelima matriks perbandingan alternatif, dan (3) peringkat/*ranking* alternatif terbaik.

Untuk menentukan nilai akhir untuk proses peringkat, dilakukan perkalian dot antara bobot prioritas kriteria dengan setiap baris alternatif, kemudian *ranking* ditentukan berdasarkan nilai terbesar ke terkecil.

Super matriks:

|                          | C01   | C02   | C03   | C04   | C05   | Nilai | Rank |
|--------------------------|-------|-------|-------|-------|-------|-------|------|
| Bobot prioritas kriteria | 0,285 | 0,218 | 0,153 | 0,232 | 0,111 |       |      |
| A01                      | 0,589 | 0,557 | 0,407 | 0,492 | 0,62  | 0,535 | 1    |
| A02                      | 0,252 | 0,32  | 0,329 | 0,396 | 0,224 | 0,309 | 2    |
| A03                      | 0,159 | 0,123 | 0,264 | 0,111 | 0,156 | 0,156 | 3    |

Pada implementasi Python, karena kita menggunakan matriks alternatif dengan 3 dimensi, maka kita bisa menggunakan *list comprehension* untuk melakukan proses pembobotan dan melakukan perkalian dot untuk menentukan *ranking* dan keputusan akhir.

```python
p_rank = np.array([np.mean(p_alternatives[i] / np.sum(p_alternatives[i], axis=0), axis=1) for i in range(p_alternatives.shape[0])]).T
final_decision = np.dot(p_rank, p_priority_weight)

print(f"Alternatif terbaik: A0{np.argmax(final_decision) + 1}")

Alternatif terbaik: A01
```

Berdasarkan output pada matriks di atas, dapat disimpulkan bahwa A01 merupakan pilihan kosan terbaik untuk penulis WFO nanti😂

## 🍵 Penutup

Nah gimana temen-temen, lumayan panjang ya proses perhitungan AHP🤣 Di artikel kali ini kita sudah belajar tentang konsep AHP dan penerapan studi kasusnya, hingga bagaimana cara kita implementasi metode AHP tersebut menggunakan Python.

Perlu diingat teman-teman, saat membuat matriks perbandingan, ordo matriks perbandingan antar kriteria dan perbandingan antar alternatif harus sesuai!

Misal terdapat 5 kriteria dan 3 alternatif berarti harus terdapat (a) satu matriks perbandingan antar kriteria berukuran (5x5) dan (b) lima matriks perbandingan antar alternatif berukuran (3x3).

Semoga bermanfaat!

*Catatan: penulis akan coba mulai menulis untuk seri Ritsu-Pi, sementara ini penulis lagi hectic karena persiapan WFO😓*

## ✏️ Referensi

1. Saaty, R. W. “The Analytic Hierarchy Process—What It Is and How It Is Used.” Mathematical Modelling, vol. 9, no. 3, Januari 1987, hlm. 161–76. ScienceDirect, https://doi.org/10.1016/0270-0255(87)90473-8.
2. Indonesia. Contoh Perhitungan SPK Metode AHP (https://tugasakhir.id/contoh-perhitungan-spk-metode-ahp/). Diakses 01 Juni 2023.
