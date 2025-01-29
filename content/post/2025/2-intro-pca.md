---
title: 'Pengantar Principal Component Analysis🦋'
date: 2025-02-01
categories: Data Science
tags: [data mining, machine learning, reduksi dimensi]
slug: pengantar-principal-component-analysis
description: Kupas tuntas metode Principal Component Analysis mulai dari teori hingga implementasi dan aplikasinya dengan Python
image: https://assets.kodesiana.com/posts/2025/intro-pca/pca-cover.jpg
math: true
---

Principal Component Analysis (PCA) merupakan salah satu metode praproses data yang sangat umum digunakan pada proyek *machine learning*. Metode ini merupakan salah satu metode andalan untuk mengurangi banyaknya input fitur/atribut pada dataset sebelum membuat model. Ada sangat banyak sekali *notebook* contohnya pada Kaggle yang menggunakan metode ini. Tapi, apa sih sebenarnya PCA itu?

{{< unsplash "photo-1562774439-23ae4c68ad6d" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzM4MDMzODkwfA" "Photo by Marko Blažević on Unsplash" "person tossing 3x3 Rubik's cube" >}}

## Mengenal PCA🤔

Principal Component Analysis (PCA) merupakan salah satu metode reduksi dimensi atau metode untuk melakukan **transformasi data dengan dimensi tinggi ke dimensi yang lebih rendah**. Metode ini pertama kali diperkenalkan oleh Karl Pearson pada tahun 1901 [1]. Ide utama dari metode ini adalah melakukan transformasi linier pada data ke sistem koordinat baru sehingga *arah* (*principal component*) data baru dapat merepresentasikan variansi terbesar pada data.

Bingung?🥲

Coba kita lihat dari sisi lain untuk memahami konsep PCA. **Korelasi linier (Pearson).**

Kamu pasti sudah familier dengan konsep korelasi Pearson, kita akan coba lihat apa hubungan korelasi Pearson dan PCA. Misalkan kamu punya data dengan 3 variabel dan kamu ingin mencari tahu korelasi antara tiga variabel tersebut. Kita bisa menggunakan diagram pencar (*scatter plot*) seperti gambar berikut.

![Contoh simulasi korelasi tiga variabel](https://assets.kodesiana.com/posts/2025/intro-pca/correlations.jpg)

Sekarang bayangkan kalau kamu punya data dengan 10, 20, 50, atau ratusan variabel. Bagaimana cara kamu mencari tahu variabel mana yang memiliki korelasi yang tinggi atau dalam konteks lain, bagaimana cara kamu mengolah data dengan banyak variabel itu?

Bayangkan kamu ingin melakukan analisis regresi, kalau ada 20 variabel, pasti akan sangat memakan waktu untuk melakukan analisis mulai dari interpreasi *p-value* hingga interpretasi koefisiennya.

Nah dalam kondisi ini, PCA bisa menjadi penyelamat.

Jika kamu melakukan PCA pada data di atas, kita bisa "mengurangi" jumlah variabel dari 3 menjadi 2 atau bahkan 1. Caranya? Dengan melakukan transformasi data sedemikian rupa, sehingga variansi atau informasi dari dataset dapat ditangkap dengan jumlah variabel yang lebih sedikit. Misalkan pada plot di atas, karena plot 1 dan 2 memiliki korelasi yang sama-sama positif, maka kedua plot tersebut dapat "digabung" menjadi satu *principal component* dan plot ketiga menjadi *principal component* lainnya.

Kalau kamu mau versi visual dari penjelasan di atas, cek video berikut.

{{< youtube HMOI_lkzW08 >}}

Konsep utama yang perlu kita ingat ketika menggunakan PCA yaitu:

> PCA "menggabungkan" data yang saling berkorelasi menjadi **principal component (PC)**

Selanjutnya, kapan kita bisa menggunakan metode PCA?

## Use Case PCA🪁

Secara umum, PCA biasanya dilakukan karena dua studi kasus, yaitu mereduksi dimensi dan visualisasi data berdimensi tinggi.

### Mereduksi Dimensi Data

Salah satu kegunaan utama dari PCA adalah reduksi dimensi atau mengurangi banyaknya input variabel seperti yang sudah dijelaskan pada awal artikel. Tapi kenapa kita perlu melakukan reduksi dimensi?

Secara umum, banyaknya fitur yang digunakan berkorelasi dengan lama waktu yang diperlukan untuk melakukan pemodelan. Semakin banyak fitur, maka semakin lama waktu yang dibutuhkan untuk membuat model. Pada kasus ini, PCA bisa mengurangi waktu yang dibutuhkan untuk membuat model.

{{< unsplash "photo-1550985543-49bee3167284" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzM4MDQ3NzAwfA" "Photo by William Warby on Unsplash" "gray and yellow measures" >}}

Contoh lain misalnya pada kasus model berbasis jarak seperti *k-nearest neighbor*. Tahukah kamu kalau ukuran jarak seperti jarak Euclidean menjadi tidak berguna pada dimensi tinggi? Ternyata, ketika kita mengukur jarak antara dua objek pada dimensi tinggi, semakin banyak dimensinya maka jarak antar dua titik akan mendekati 1 atau jarak antara objek pada dimensi tinggi menjadi seragam (*uniform*) [2].

Contoh lain adalah kesulitan pada proses sampling atau survei. Misalkan kita ingin membuat sebuah model untuk melakukan prediksi dan kita mengumpulkan data melalui survei. Semakin banyak dimensi pertanyaan, maka kita akan membutuhkan lebih banyak data untuk dapat merepresentasikan populasi. Umumnya, banyaknya data yang dibutuhkan untuk proses *training* tumbuh secara eksponensial terhadap banyaknya input variabel [3]. Secara tidak langsung, PCA bisa mengurangi potensi *overfitting* ketika membuat model.

Kedua contoh di atas disebut juga sebagai **curse of dimensionality**.

> **Curse of dimensionality** adalah istilah untuk berbagai fenomena yang muncul pada data dengan dimensi tinggi, tetapi tidak terjadi pada data dengan dimensi rendah [4]

### Visualisasi Data Berdimensi Tinggi

Coba perhatikan kembali plot pada bagian awal Mengenal PCA. Untuk dapat memvisualisasikan tiga variabel, kita bisa menggunakan tiga kombinasi diagram pencar atau dengan satu diagram pencar dengan tiga dimensi. Bayangkan jika kita punya empat variabel, berapa banyak diagram pencar yang harus kita buat? \(C(4,2) = 6\) kombinasi. Semakin banyak jumlah variabel, akan semakin sulit untuk kita cari pola yang ada pada data.

Menggunakan metode PCA, kita bisa membuat visualisasi 2D dari data berdimensi tinggi untuk memudahkan kita mencari pola dalam data. Kamu bisa cek laman berikut untuk melihat berbagai visualisasi menggunakan PCA.

![Visualisasi data MNIST handwriting](https://assets.kodesiana.com/posts/2025/intro-pca/embedding-projector.jpg)

Akses website [Embedding Projector](https://projector.tensorflow.org/)

Teman-teman mungkin belum familiar bahwa data gambar dan teks juga bisa dibuat menjadi vektor, sama halnya seperti data tabular. Proses konversi ini disebut *embedding*. Pada contoh di atas, citra huruf MNIST dikonversi menjadi vektor, kemudian dilakukan PCA dengan tiga *principal components*. Hasilnya adalah visualisasi 3D dari gambar huruf.

Perhatikan juga bahwa visualisasi di atas cenderung membentuk *cluster*, gambar yang mirip cenderung mengelompok ke satu daerah. Nah hal ini lagi-lagi menjadi bukti bahwa metode PCA dapat "menggabungkan" banyak variabel input menjadi lebih sedikit (pada contoh ini 3 variabel XYZ) dan juga variabel turunan ini mampu menangkap variansi atau informasi dari banyak variabel aslinya.

### Use Case Lainnya

Dalam sains sosial (*social science*), PCA biasanya digunakan untuk melakukan analisis faktor (**Factor Analysis**). Metode analisis ini bisa kita temukan misal pada SPSS yang biasanya digunakan untuk menganalisis data kuisioner untuk mengelompokkan kategori atau faktor-faktor yang signifikan sebagai indikator sosial.

Dalam ilmu kimia analis, ada salah satu bidang yang disebut sebagai **chemometrics**. Bidang ini menggunakan pengukuran pada sistem kimia dan metode statistik untuk mengungkap hubungan tertentu. Salah satu aplikasinya yang saat ini penulis sedang lakukan adalah **autentikasi**. Autentikasi adalah proses untuk memastikan apakah suatu senyawa kimia adalah *otentik* atau asli dibandingkan dengan kontrol. Misalnya pada kasus obat-obatan herbal, kita ingin memastikan apakah benar komposisi obat tersebut terdiri atas suatu senyawa X? Nah pada kasus ini analisis datanya biasanya menggunakan metode PCA (data yang diolah biasanya berupa spektra yang diakuisisi dari metode seperti *liquid chromatography*).

Wah kita sudah panjang lebar membahas tentang PCA dan juga aplikasinya. Sekarang kita akan lanjut mempelajari apa saja konsep dasar matematika yang kita perlukan untuk melakukan PCA.

## Toolbox Matematika🦄

Untuk melakukan PCA, kita perlu memahami beberapa konsep, yaitu: varians (*variance*), kovarian (*covariance*), *eigenvalue*, dan *eigenvector*.

Dengan kata lain, kita perlu memahami tentang **aljabar linier matriks.**

### Varians dan Kovarian

Kamu pasti sudah sangat familier dengan konsep varians, yaitu salah satu ukuran sebaran data. Varians mengukur sebaran data pada satu variabel saja (univariat). Pada kenyataannya, data yang kita miliki biasanya memiliki lebih dari satu variabel. Pada kasus ini kovarian digunakan untuk mengukur apakah terdapat hubungan antar variabel.

Ketika nilai kovarian positif, maka nilai pada kedua variabel bergerak naik bersamaan dan begitu pula sebaliknya. Berbeda dengan korelasi Pearson, ketika nilai korelasi positif, maka kedua variabel naik/turun berbarengan, sedangkan ketika nilai korelasi Pearson negatif, maka kenaikan pada satu variabel berarti variabel lainnya turun dan sebaliknya.

Varians dinyatakan sebagai:

$$
var(X) = \frac{\sum_{i=1}^{n} (X_i - \bar{X})^2}{n-1}
$$

dan kovarian dinyatakan sebagai:

$$
cov(X, Y) = \frac{\sum_{i=1}^{n} (X_i - \bar{X})(Y_i - \bar{Y})}{n-1}
$$

Perhatikan bahwa persamaan kovarian sangat mirip dengan varians, dengan perbedaan pada kovarian nilai \(X_i - \bar{X}\) dikalikan dengan variabel lain, bukan dirinya sendiri.

Pada kasus PCA, kita perlu menghitung matriks kovarian. Matriks ini terdiri atas sejumlah \(n\) variabel dan berbentuk matriks persegi berukuran \(n \times n\). Secara umum, matriks ini dinyatakan sebagai:

$$
C = \begin{pmatrix}
var(X_1) & \cdots & cov(X_n, X_1) \\
\vdots & \ddots & \vdots \\
cov(X_n, X_1) & \cdots & var(X_n)
\end{pmatrix}
$$

> 💡 Kenapa diagonal matriks kovarian adalah varians? Karena, \(cov(X, X) = var(X)\)

Matriks kovarian ini nantinya akan menjadi kunci untuk melakukan PCA. Selanjutnya, kita akan menghitung *eigenvalue* dan *eigenvector* dari matriks kovarian.

### Eigenvalues dan Eigenvectors

Kita perlu kembali lagi ke pelajaran matematika peminatan SMA, yaitu aljabar linier matriks dan transformasi linier. Misalkan kita punya suatu matriks \(A\), kita bisa melakukan transformasi seperti translasi, refleksi, rotasi, dan dilatasi [5]. Nah, secara umum **eigenvector** bisa didefinisikan sebagai suatu *span* yang tidak berubah ketika dilakukan transformasi dan **eigenvalue** adalah skala atau besarnya *eigenvector*. Perhatikan contoh di bawah ini, ketika gambar dilakukan transformasi *shear*, vektor horizontal tidak berubah yang berarti vektor tersebut merupakan *eigenvector*.

![Visualisasi Eigenvalues dan Eigenvector - Sumber: Math is Fun](https://www.mathsisfun.com/algebra/images/eigen-transform.svg)

Penulis sendiri saat ini belum punya pemahaman yang cukup untuk dapat menjelaskan kedua konsep ini secara ringkas, sehingga penulis sangat menyarankan kamu untuk mempelajari konsep aljabar linier pada video oleh 3Blue1Brown berikut.

{{< youtube "videoseries?si=rd1h7soE9Th-SHKB&amp;list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" >}}

Oke sekarang kita coba lihat definisi formal mengenai *eigenvalue* dan *eigenvector*:

> An **eigenvector** of an \(n \times n\) matrix \(A\) is a nonzero vector \(\mathbf{x}\) such that \(A \mathrm{x} = \lambda \mathrm{x}\) for some scalar \(\lambda\). A scalar \(\lambda\) is called an **eigenvalue** of \(A\) if there is a nontrivial solution \(\mathbf{x}\) of \(A \mathrm{x} = \lambda \mathrm{x}\); such an \(\mathbf{x}\) is called an *eigenvector corresponding to \(\lambda\)*.
>
> Non-trivial solution: There exists \(\mathbf{x}\) for which \(A \mathrm{x} = 0\) where \(\mathbf{x} \neq 0\).

Sekarang kita akan langsung bahas contoh soal agar kita lebih paham mengenai definisi di atas.

**Contoh**

Cari *eigenvalues* dan *eigenvectors* untuk matriks \(A = \begin{pmatrix} 2 & 2 \\ 5 & -1 \end{pmatrix}\)

**Jawab**

Untuk matriks \(A\), apa vektor tidak nol \(x\) yang memenuhi persamaan \(Ax = \lambda x\) untuk suatu skalar \(\lambda\)?

$$
\begin{aligned}
A \mathrm{x} = \lambda \mathrm{x} &\iff A \mathrm{x} - \lambda \mathrm{x} 0 \\
&\iff A \mathrm{x} - \lambda I \mathrm{x} = 0 \\
&\iff (A - \lambda I) \mathrm{x} = 0
\end{aligned}
$$

Persamaan \(Ax = \lambda \mathrm{x}\) memiliki solusi tidak nol untuk vektor \(\mathrm{x}\) jika dan hanya jika matriks \(A - \lambda I\) memiliki determinan sama dengan nol.

*Eigenvalue* adalah nilai-nilai \(\lambda\) yang memenuhi \(\det(A - \lambda I) = 0\).

$$
\begin{aligned}
\det(A - \lambda I) &= \det \left(\begin{bmatrix} 2 & 2 \\ 5 & -1 \end{bmatrix} - \lambda \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \right) \\
                    &= \det \left(\begin{bmatrix} 2 & 2 \\ 5 & -1 \end{bmatrix} - \begin{bmatrix} \lambda & 0 \\ 0 & \lambda \end{bmatrix} \right) \\
                    &= \begin{vmatrix} 2 - \lambda & 2 \\ 5 & -1 - \lambda \end{vmatrix} \\
                    &= (2 - \lambda) (-1 - \lambda) - 10 \\
                    &= \lambda^2 - \lambda - 12
\end{aligned}
$$

Maka, *eigenvalue* matriks \(A\) adalah akar-akar dari persamaan \(\lambda^2 - \lambda - 12\), yaitu \(\lambda_1 = -3\) dan \(\lambda_2 = 4\). Selanjutnya, kita akan mencari *eigenvector* untuk \(\lambda_1 = -3\).

$$
\begin{aligned}
Ax &= \lambda x \\
\begin{bmatrix} 2 & 2 \\ 5 & -1 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} &= -3 \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} \\
\end{aligned}
$$

Sekarang kita buat menjadi sama dengan nol.

$$
\begin{aligned}
    2x_1 + 2x_2 = -3x_1 &\rArr 5x_1 + 2x_2 = 0 \\
    5x_1 - x_2  = -3x_2 &\rArr 5x_1 + 2x_2 = 0 \\
    x_1 &= -\frac{2}{5} x_2
\end{aligned}
$$

Maka, eigenvector untuk \(\lambda_1 = -3\) yang memenuhi persamaan di atas adalah \(\begin{bmatrix} 2 \\ -5 \end{bmatrix}\).

Proses yang sama selanjutnya kita lakukan untuk \(\lambda = 4\) sebagai berikut.

$$
\begin{aligned}
Ax &= \lambda x \\
\begin{bmatrix} 2 & 2 \\ 5 & -1 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} &= -4 \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} \\
\end{aligned}
$$

Sekarang kita buat menjadi sama dengan nol.

$$
\begin{aligned}
    2x_1 + 2x_2 = 4x_1 &\rArr -2x_1 + 2x_2 = 0 \\
    5x_1 - x_2  = 4x_2 &\rArr 5x_1 - 5x_2 = 0 \\
    x_1 &= x_2
\end{aligned}
$$

Maka, eigenvector untuk \(\lambda_1 = 4\) yang memenuhi persamaan di atas adalah \(\begin{bmatrix} 1 \\ 1 \end{bmatrix}\).

## Implementasi dengan Python💻

Wow, banyak banget ya teori-teori yang sudah kita bahas. Akhirnya kita sampai juga ke bagian yang ditunggu-tunggu, yaitu implementasi PCA dengan Python. Seperti biasa, teman-teman bisa akses Google Colab pada tombol berikut. Implementasi ini berdasarkan materi kuliah [6].

{{< button content="Akses Google Colab" icon="gilbarbara-logos-jupyter" href="https://l.kodesiana.com/intro-pca-colab" >}}

Kali ini kita akan mengimplementasi PCA dengan dua pendekatan, PCA secara manual menggunakan Numpy saja dan PCA menggunakan Scikit-Learn. Seperti biasa kita awali dengan impor *library*.

```py
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

from sklearn.datasets import load_iris

# hanya menampilkan dua angka di belakang koma
np.set_printoptions(precision=2, suppress=True)
```

### 1️⃣ Akuisisi data

Selanjutnya, kita akan memuat data. Pada contoh ini, kita akan menggunakan dataset iris.

```py
data = load_iris(as_frame=True)
data["frame"].head()
```

Sekarang kita akan ambil empat fitur input ke dalam variabel `X` dalam format Numpy array.

```py
X = data["data"].to_numpy()
```

### 2️⃣ *Data Centering*

Sekarang kita akan melakukan proses *data centering*. Proses ini bertujuan untuk "memindahkan data ke tengah-tengah" atau ke *origin* dengan cara mengurangi setiap baris data dengan rata-ratanya.

```py
X_means = np.mean(X, axis=0)
X_adjusted = X - X_means

print("Mean:", X_means)
```

Rata-rata:

| sepal length (cm) | sepal width (cm) | petal length (cm) | petal width (cm) |
|-------------------|------------------|-------------------|------------------|
| 5.84              | 3.06             | 3.76              | 1.2              |

Proses ini ada hubungannya dengan konsep *eigenvector* sebelumnya. Ingat bahwa *eigenvector* adalah vektor yang tidak berubah setelah dilakukan transformasi? "Tidak berubah" ini hanya valid jika vektor tersebut tidak berubah dari pusatnya (*origin*). Maka dari itu, data input harus kita normalisasi melalui proses pengurangan dengan rataan di atas.

### 3️⃣ Hitung Matriks Kovarian

Selanjutnya kita akan membuat matriks kovarian dari data. Parameter `rowvar=False`  digunakan untuk menginstruksikan Numpy agar menghitung kovarian berdasarkan kolom, karena secara *default*, Numpy menginginkan data input dengan orientasi baris adalah variabel dan kolom adalah baris data, sedangkan data yang kita punya memiliki orientasi kolom adalah variabel dan baris adalah observasi/pengamatan.

```py
X_cov = np.cov(X_adjusted, rowvar=False)
print("Covariance:\n", X_cov)
```

Matriks kovarian

|                   | sepal length (cm) | sepal width (cm) | petal length (cm) | petal width (cm) |
|-------------------|-------------------|------------------|-------------------|------------------|
| sepal length (cm) | 0.69              | -0.04            | 1.27              | 0.52             |
| sepal width (cm)  | -0.04             | 0.19             | -0.33             | -0.12            |
| petal length (cm) | 1.27              | -0.33            | 3.12              | 1.3              |
| petal width (cm)  | 0.52              | -0.12            | 1.3               | 0.58             |

### 4️⃣ Hitung Eigenvectors dan Eigenvalues dari Matriks Kovarian

Selanjutnya kita akan menghitung *eigenvalues* dan *eigenvector*. Pada contoh ini kita akan menggunakan fungsi `numpy.linalg.eigh`. Umumnya, kita akan menggunakan fungsi `numpy.linalg.eig` untuk menghitung *eigenvalues* dan *eigenvector*, tetapi kita akan menggunakan `numpy.linalg.eigh` karena fungsi ini hanya akan mengoutputkan nilai-nilai real saja, sedangkan `numpy.linalg.eig` dapat mengoutputkan nilai kompleks. Karena kita hanya menggunakan nilai real, maka kita bisa menggunakan `numpy.linalg.eigh` saja. Selain itu, `numpy.linalg.eigh` juga lebih cepat dibandingkan `numpy.linalg.eig`.

```py
eig_val, eig_vec = np.linalg.eigh(X_cov)

print("Eigenvalues:\n", eig_val)
print("Eigenvectors:\n", eig_vec)
```

Eigenvalues: \( \begin{bmatrix} 0.02 & 0.08 & 0.24 & 4.23 \end{bmatrix}\)

Eigenvectors:

|       |       |       |       |
|-------|-------|-------|-------|
| 0.32  | 0.58  | 0.66  | -0.36 |
| -0.32 | -0.6  | 0.73  | 0.08  |
| -0.48 | -0.08 | -0.17 | -0.86 |
| 0.75  | -0.55 | -0.08 | -0.36 |

### 5️⃣ Memilih Banyaknya *Principal Components*

Oke sekrang kita sudah mempunyai nilai-nilai *eigenvalues* dan *eigenvectors*. Sebelum kita melakukan transformasi data, kita perlu mengurutkan nilai *eigenvalues* dan *eigenvector*, serta memilih berapa banyak *principal component* yang akan kita buat.

```py
# mengurutkan eigenvalues
eig_sort_idx = eig_val.argsort()[::-1]
eig_val = eig_val[eig_sort_idx]
eig_vec = eig_vec[:, eig_sort_idx]
```

Selanjutnya kita bisa menampilkan plot antara banyaknya *principal component* terhadap *eigenvalues*-nya. Plot ini disebut juga sebagai *Scree plot*.

```py
fig, ax = plt.subplots()

ax.plot(list(map(str, range(1, eig_val.shape[0]+1))), eig_val, marker='o')
ax.axhline(1, color='r', linestyle='--')
ax.text(0, 1.1, "Kaiser rule", color="red", ha="left", va="center")

ax.set_title("Scree Plot")
ax.set_xlabel("Principal Component")
ax.set_ylabel("Eigenvalue")
plt.show()
```

![Scree plot](https://assets.kodesiana.com/posts/2025/intro-pca/scree-plot.jpg)

*Scree plot* biasa digunakan sebagai metode diagnostik untuk memilih berapa banyak *principal component* untuk digunakan. Salah satu metode yang biasa digunakan adalah **aturan Kaiser** [7]. Aturan Kaiser ini sangat sederhana, yaitu **hanya ambil *principal component* yang memiliki nilai lebih besar dari 1**. Bedasarkan plot di atas, dapat disimpulkan bahwa sebagian besar variansi atau informasi dapat dijelaskan dengan hanya satu *principal component* saja.

Selain metode *scree plot*, kita juga bisa menggunakan persentase variansi untuk memilih berapa banyak *principal component* untuk digunakan. Persentase varians yang dijelaskan oleh *principal component* adalah persentase setiap *eigenvalues* terhadap total.

```py
# Variansi yang dijelaskan oleh princial component
sum_eig_val = np.sum(eig_val)
explained_var = eig_val / sum_eig_val
cumulative_var = np.cumsum(explained_var)
min_components = np.argmax(cumulative_var >= 0.90) + 1 # threshold 90%

print("Varians yang dijelaskan:", explained_var)
print("Varians kumulatif:", cumulative_var)
```

Varians berdasarkan *principal components*:

|                         | PC 1 | PC 2 | PC 3 | PC 4 |
|-------------------------|------|------|------|------|
| Varians yang dijelaskan | 0.92 | 0.05 | 0.02 | 0.01 |
| Varians kumulatif       | 0.92 | 0.98 | 0.99 | 1.   |

Pada contoh di atas dapat dilihat bahwa 92% variansi dalam data dapat dijelaskan oleh satu *principal component* saja. Kita juga bisa membuat visualisasi dari data di atas agar lebih mudah untuk diamati.

```py
fig, ax = plt.subplots()

ax.bar(range(1, explained_var.shape[0]+1), explained_var, label="Explained variance")
ax.step(range(1, cumulative_var.shape[0]+1), cumulative_var, label="Cumulative explained variance")
ax.vlines(x=min_components, ymin=0, ymax=cumulative_var.max(), colors=["red"], label="Explained variance >=90%")

ax.set_title(f"Banyaknya komponen untuk digunakan = {min_components} ({cumulative_var[min_components]:.2%})")

plt.legend(loc="center right")
plt.tight_layout()
plt.show()
```

![Variansi dijelaskan oleh komponen PCA](https://assets.kodesiana.com/posts/2025/intro-pca/pca-explained-variance.jpg)

Menggunakan persentase variansi yang dijelaskan, biasanya penulis menggunakan minimum 90% variansi untuk memilih banyaknya *principal component*. Nilai persentase ini bisa dipilih secara *arbitrary* atau berdasarkan proksi dari nilai lain, misalnya akurasi model.

### 6️⃣ Transformasi Data menjadi *Principal Components*

Sekarang kita akan melakukan transformasi data input menjadi *principal component*. Prosesnya sangat sederhana, yaitu melakukan perkalian dot antara data yang sudah dinormalisasi dan vektor *eigenvector* dari matriks kovarian.

Contoh pertama: transformasi menjadi satu *principal component*.

```py
# Proyeksikan data pada satu eigenvector
data_pca_satu = X_adjusted @ eig_vec[:, 0]
print("Hasil PCA:\n", data_pca_satu[:5])

# Hasil PCA:
#  [2.68 2.71 2.89 2.75 2.73]
```

Contoh kedua: transformasi menjadi dua *principal component*.

```py
# Proyeksikan data pada dua eigenvector
data_pca_dua = X_adjusted @ eig_vec[:, :2]
print("Hasil PCA:\n", data_pca_dua[:5, :])

# Hasil PCA:
#  [[ 2.68  0.32]
#  [ 2.71 -0.18]
#  [ 2.89 -0.14]
#  [ 2.75 -0.32]
#  [ 2.73  0.33]]
```

Perhatikan bahwa pada kode di atas kita mengalikan data input dengan dua kolom *eigenvector* untuk menghasilkan dua *principal component*.

Berdasarkan data PCA ini, ada satu jenis plot terakhir yang bisa kita gunakan untuk mengidentifikasi hubungan antar variabel, yaitu **biplot**. Plot ini menampilkan diagram pencar antara PC 1 dan PC 2 beserta panah yang menunjukkan *eigenvector*.

Tambahkan fungsi berikut:

```py
def plot_loadings(features, loadings, scores):
  # https://stackoverflow.com/a/74955203/5561144
  fig, ax = plt.subplots(figsize=(5, 5))

  # plot PCA
  for i, target_name in enumerate(data.target_names):
    indices = data["target"] == i
    ax.scatter(scores[indices, 0], scores[indices, 1], label=target_name)

  # plot quadrant
  ax.axhline(0, color='k', linestyle='--')
  ax.axvline(0, color='k', linestyle='--')

  # empirical formula to determine arrow width
  arrows = loadings * np.abs(scores).max(axis=0)
  width = -0.0075 * np.min([np.subtract(*plt.xlim()), np.subtract(*plt.ylim())])

  # features as arrows
  for i, arrow in enumerate(arrows):
    ax.arrow(0, 0, *arrow, color='k', alpha=0.5, width=width, ec='none', length_includes_head=True)
    ax.text(*(arrow * 1.05), features[i], ha='center', va='center')

  ax.set_title("Data PCA")
  ax.set_xlabel("PC 1")
  ax.set_ylabel("PC 2")

  plt.legend()
  plt.show()
```

Kemudian panggil fungsi di atas dengan parameter berikut. Parameter pertama adalah array berisi nama-nama fitur input, parameter kedua adalah *eigenvectors*, dan parameter terakhir adalah data PCA yaitu PC 1 dan PC 2.

```py
plot_loadings(data["data"].columns.tolist(), eig_vec[:, :2], data_pca_dua[:, :2])
```

![Biplot data PCA](https://assets.kodesiana.com/posts/2025/intro-pca/pca-biplot.jpg)

Oke sekarang kita akan coba menginterpretasi informasi pada plot di atas [8].

**Diagram pencar menunjukkan kemiripan data**. Pada contoh di atas, kelas **setosa** merupakan kelas yang paling berbeda dengan kelas **versicolor** dan **virginica**. Selain itu, jika kita mengukur jarak *cluster* pada plot, jarak pada PC 1 mengindikasikan perbedaan yang lebih besar daripada jarak pada PC 2. Perhatikan contoh di bawah.

![Contoh PCA 3 cluster](https://assets.kodesiana.com/posts/2025/intro-pca/pca-3-cluster.jpg)

Pada contoh di atas, klaster A lebih mirip dengan klaster B, daripada klaster A dan klaster C. Jika dilihat berdasarkan jarak, bisa dibilang A dan B serta A dan C memiliki jarak yang mirip, tetapi karena PC 1 menjelaskan lebih banyak variansi daripada PC 2, maka perbedaan jarak pada PC 1 lebih besar daripada jarak pada PC 2.

**Panah menunjukkan karakteristik korelasi data**.

- Ketika kedua panah/vektor membentuk sudut yang lancip, artinya kedua variabel tersebut memiliki korelasi yang positif. Contohnya: petal width dan petal length.
- Ketika kedua vektor membentuk sudut 90&deg;, artinya kedua variabel tersebut kemunkinan besar tidak berkorelasi. Contohnya: petal width dan sepal length.
- Ketika kedua vektor membentuk sudut tumpul atau hampir membentuk garis lurus, artinya kedua variabel tersebut memiliki korelasi yang negatif. Contohnya: petal length dan sepal width.

**Panjang panah menunjukkan seberapa besar kontribusi setiap variabel terhadap *principal component***.

Semakin panjang vektor, berarti variabel tersebut semakin berpengaruh terhadap nilai *principal component*. Selain itu, kia juga bisa melihat arah panah. Misalnya *sepal length* mengarah pada kuadran 1 (kiri atas), artinya semakin kecil nilai PC 1, maka semakin besar nilai *sepal length*. Sama juga dengan *petal length* dan *petal width*. Interpretasi yang terbalik dapat dilakukan pada PC 2. Karena *sepal length* mengarah positif pada PC 2, artinya ketika PC 2 bernilai tinggi maka *sepal length* akan bernilai rendah [9].

### Implementasi Versi Scikit-Learn⚡

Daripada menggunakan kode yang panjang di atas, kita bisa menggunakan Scikit-Learn untuk mempersingkat proses transformasi data dengan PCA.

```py
from sklearn.decomposition import PCA

pca = PCA(n_components=2)
pca.fit(data["data"])

sk_pca = pca.transform(data["data"])
plot_loadings(data["data"].columns.tolist(), pca.components_[:2].T, sk_pca[:, :2])
```

![Biplot data PCA dengan Scikit-Learn](https://assets.kodesiana.com/posts/2025/intro-pca/pca-sklearn-biplot.jpg)

Perhatikan bahwa panah dan data ditampilkan terbalik karena pada Scikit-Learn implementasi PCA yang digunakan sedikit berbeda dan hasil *eigenvector* yang dibuat perlu di-*transpose* terlebih dahulu.

> PCA pada Scikit-Learn menggunakan pendekatan *Singular Value Decomposition (SVD)*.

## Penutup💡

Phew 😮‍💨 Akhirnya kita sampai di akhir artikel.

Pada artikel kali ini kita sudah mempelajari mengenai *Principal Component Analysis (PCA)*. PCA menggunakan konsep transformasi linier untuk membuat dataset baru dengan cara mengalikan *eigenvector* dari kovarian data.

PCA lazim digunakan untuk melakukan reduksi dimensi dan visualisasi data berdimensi tinggi. Selain itu, PCA juga bisa mengurangi peluang terjadinya *overfitting* karena dilakukannya proyeksi data. PCA juga lazim digunakan pada berbagai bidang lain seperti *social science* dan kimia analis. PCA berdasarkan pada beberapa konsep matematika, yaitu: varians, kovarians, *eigenvalues*, dan *eigenvectors*.

Interpretasi PCA bisa dilakukan menggunakan *scree plot* dan *biplot*. *Scree plot* digunakan untuk memilih berapa banyak *principal component* untuk digunakan dan seberapa besar variansi atau informasi yang dijelaskan oleh komponen tersebut. *Biplot* digunakan untuk mengamati hubungan antar variabel dan kontribusi setiap variabel terhadap *principal component*.

Implementasi PCA bisa dilakukan dengan mudah menggunakan Python dan Numpy. Scikit-Learn juga memiliki API untuk melakukan transformasi PCA dengan beberapa baris kode saja.

Sampai ketemu di artikel lanjutan PCA!

## Referensi📚

1. Pearson, K. (1901). "On Lines and Planes of Closest Fit to Systems of Points in Space". Philosophical Magazine. 2 (11): 559–572. doi:10.1080/14786440109462720. S2CID 125037489.
2. Aggarwal, C.C., Hinneburg, A., Keim, D.A. (2001). On the Surprising Behavior of Distance Metrics in High Dimensional Space. In: Van den Bussche, J., Vianu, V. (eds) Database Theory — ICDT 2001. ICDT 2001. Lecture Notes in Computer Science, vol 1973. Springer, Berlin, Heidelberg. https://doi.org/10.1007/3-540-44503-X_27
3. Koutroumbas, Konstantinos; Theodoridis, Sergios (2008). Pattern Recognition (4th ed.). Burlington. ISBN 978-1-59749-272-0. Retrieved 2018-01-08.
4. Bellman, Richard Ernest (1961). Adaptive control processes: a guided tour. Princeton University Press. ISBN 9780691079011.
5. Transformasi geometri, contoh soal & pembahasan—Materi matematika kelas 11. (2022, Juni 16). https://www.zenius.net/blog/transformasi-geometri-dengan-matriks
6. Smith, L. I. (2002). A tutorial on Principal Components Analysis. University of Otago. https://ourarchive.otago.ac.nz/esploro/outputs/report/A-tutorial-on-Principal-Components-Analysis/9926479584201891#file-0+
7. Kaiser, Henry F. (April 1960). "The Application of Electronic Computers to Factor Analysis". Educational and Psychological Measurement. 20 (1): 141–151. doi:10.1177/001316446002000116. S2CID 146138712
8. Team, B. (2018, September 18). How to read PCA biplots and scree plots. Medium. https://bioturing.medium.com/how-to-read-pca-biplots-and-scree-plots-186246aae063
9. Carter, D. J. (2019). Introduction to social epi methods. Diambil 29 Januari 2025, dari https://bookdown.org/danieljcarter/socepi/biplots-and-interpretation.html
