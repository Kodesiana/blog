---
title: 'Clustering Citra dengan PCA dan k-means🖼️'
date: 2025-02-23
categories: Data Science
tags: [data mining, machine learning, reduksi dimensi]
description: Aplikasi Principal Component Analysis untuk clustering citra
slug: clustering-citra-pca-k-means
image: https://assets.kodesiana.com/posts/2025/pca-image-clustering/sample-images.jpg
math: true
---

*Clustering* merupakan salah satu penerapan *machine learning* khususnya pada studi *data mining*. Pada artikel sebelumnya, penulis pernah membahas metode *hierarchical clustering* untuk melakukan [*clustering* daerah potensial pertanian di Indonesia](/post/pemodelan-daerah-potensial-pertanian-di-indonesia-orange-data-mining/). Kali ini, kita akan melakukan menerapkan metode *clustering* pada citra.

Tapi sebelum itu, untuk apa melakukan *clustering* citra?

Misalkan kita punya data citra tanaman yang diserang hama dan tanaman yang normal. Sayangnya kita belum tau apa saja jenis hama yang menyerang tanaman kita, apakah hanya satu jenis atau ada beberapa jenis. Bedasarkan perwujudan hamanya juga, tanaman tersebut memiliki karakteristik yang berbeda-beda, ada yang berubah warna, ada yang daunnya menjadi kering, ada bercak putih, dan lain sebagainya.

{{< unsplash "photo-1536246297549-267e01fea839" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzM4Mzc0MzMyfA" "Photo by Niklas Hamann on Unsplash" "apple tree" >}}

Pada kasus ini, kita bisa melakukan *clustering* untuk membantu kita mengelompokkan citra yang memiliki karakteristik atau fitur yang sama. Ingat, proses *clustering* bisa sangat bermanfaat untuk membantu kita menemukan kelompok/pola dari data yang belum memiliki label seperti pada kasus tersebut. Setelah kita punya beberapa kelompok tadi, kita mungkin bisa lanjut dengan konsultasi dengan pakar untuk memvalidasi jenis hama yang menyerang tanaman.

Oke seakrang kita akan mulai belajar mengenai k-means!

Pada contoh ini kita akan menggunakan data wajah dari beberapa kolega penulis😁

## K-means Clustering🧫

*K-means clustering* merupakan salah satu metode favorit untuk melakukan pengeloompokan data. Sesuai namanya, metode ini akan membentuk sejumlah \(k\) *cluster* yang keanggotaannya berdasarkan rata-rata jarak ke pusat *cluster*. Oleh karena itu, metode *clustering* ini termasuk dalam  kategori metode *clustering* berbasis *centroid* atau *partition-based clustering*.

Ide utama dari metode ini adalah membuat sejumlah \(k\) pusat *cluster* secara acak, kemudian jarak setiap titik data dibandingkan dengan setiap pusat *cluster* (*centroid*). Setiap data kemudian dimasukkan ke dalam *cluster* dengan jarak terdekat ke *centroid*. Tahap selanjutnya adalah mengubah posisi *centroid* agar jarak antara *centroid* bisa menjadi lebih kecil dengan semua titik data [1].

![Visualisasi proses iterasi k-means - Sumber: Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/7/7b/Kmeans_animation_withoutWatermark.gif)

Pada visualisasi di atas, simbol segitiga merupakan *centroid* dan posisinya bergerak menuju titik yang meminimumkan jarak antar semua titik data. Perhatikan juga bahwa hasil *cluster* membentuk partisi atau wilayah *cluster* di mana satu titik data tidak terdapat pada dua *cluster*. Ini merupakan alasan metode k-means termasuk dalam kategori *partition-based clustering*.

Pada umumnya proses *k-means* ini menggunakan data tabular yang berarti data yang terdiri atas baris dan kolom. Pada kasus data citra, satu citra sudah terdiri atas baris dan kolom karena satu citra terdiri atas kisi/*grid* piksel. Pada suatu citra juga biasanya memiliki resolusi yang tinggi yang berarti jumlah piksel yang lebih besar. Nah ini adalah kunci penggunaan metode PCA.

Pada artikel sebelumnya, kita sudah membahas mengenai reduksi dimensi menggunakan metode [*Principal Component Analysis (PCA)*](/post/pengantar-principal-component-analysis/). Kali ini kita akan menggunakan PCA sebagai metode praproses data untuk mereduksi dimensi sebelum melakukan *clustering* menggunakan metode *k-means*.

## Implementasi Python💻

Seperti biasa, teman-teman bisa akses dataset dan Goolge Colab melalui tombol berikut.

{{< button-group >}}
{{< button content="Unduh Data Citra" icon="download" href="https://blobs.kodesiana.com/kodesiana-data-open/pca-clustering-faces/pca-images-data.zip" >}}
{{< button content="Akses Jupyter Notebook" icon="gilbarbara-logos-jupyter" href="https://l.kodesiana.com/pca-image-clustering-colab" >}}
{{</ button-group >}}

Tahap pertama adalah mengimpor *library*. Pada contoh ini kita akan menggunakan implementasi PCA dan k-means dari Scikit-Learn.

```py
import glob

import numpy as np
import pandas as pd
import skimage as ski
import plotly.express as px

from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from yellowbrick.cluster import KElbowVisualizer, SilhouetteVisualizer
```

Selanjutnya kita akan mengunduh dataset dan mengekstrak dataset ke dalam folder.

```sh
!curl -o pca-images-data.zip https://blobs.kodesiana.com/kodesiana-data-open/pca-clustering-faces/pca-images-data.zip
!unzip -qq -o -d dataset pca-images-data.zip

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  134k  100  134k    0     0   170k      0 --:--:-- --:--:-- --:--:--  170k
```

### 1️⃣ Memuat Data

Sekarang kita akan mencari lokasi semua citra yang terdapat dalam dataset.

```py
image_paths = glob.glob("./dataset/*.jpg")
print("Image count:", len(image_paths))

# Image count: 50
```

Pada contoh ini kita memiliki total 50 citra untuk proses *clustering*. Tahap selanjutnya adalah membaca citra dan melakukan beberapa tahap praproses data untuk menyiapkan data sebelum melakukan proses PCA.

```py
images = []
for image_path in image_paths:
  img = ski.io.imread(image_path)
  img = ski.color.rgb2gray(img)
  img = ski.transform.resize(img, (80, 80))

  images.append(img)

mat_images = np.array(images)
mat_images.shape

# (50, 80, 80)
```

Pada kode di atas, terdapat beberapa tahapan sebelum data citra dapat digunakan.

1. Baris 3, membaca berkas citra menjadi *Numpy array*
2. Baris 4, mengonversi citra RGB (warna) menjadi citra abu-abu (*grayscale*)
3. Baris 5, mengubah ukuran citra menjadi 80x80 piksel

Setelah semua citra dimuat, dapat dilihat bahwa output *array* yang kita miliki adalah (50, 80, 80) yang berarti 50 sampel data dengan 80 baris dan 80 kolom.

```py
fig = px.imshow(mat_images[:10, :, :], binary_string=True, facet_col=0, facet_col_wrap=5)
fig.show()
```

![Contoh citra pada dataset](https://assets.kodesiana.com/posts/2025/pca-image-clustering/sample-images.jpg)

### 2️⃣ Reduksi Dimensi PCA

Sekarang kita bisa menggunakan metode PCA untuk melakukan reduksi dimensi. Tapi sebelum itu, kita perlu mengubah dimensi data dari 3 dimensi menjadi dua dimensi. Pada contoh ini kita bisa menggunakan fungsi `numpy.reshape` untuk mengubah dimensi *array*. Idenya adalah mengubah dimensi dari (n_samples, n_rows, n_cols) menjadi (n_samples, n_features).

```py
pca = PCA(n_components=30)

mat_input = mat_images.reshape(mat_images.shape[0], -1)
mat_transformed = pca.fit_transform(mat_input)
```

Pada contoh ini kita akan mencoba untuk membuat 30 *principal components*. Angka ini dipilih secara arbiter. Kamu bisa mengubah banyaknya *principal component* sesuai kebutuhan.

Kode pada baris 3 menggunakan fungsi `numpy.reshape` dengan parameter pertama `mat_images.shape[0]` yang berupa banyaknya sampel data dan -1 yang berarti tidak diketahui dimensinya. Output dari fungsi ini adalah *array* baru dengan ukuran 50x6400.

```py
df_explained = pd.DataFrame({
    "pc": range(1, mat_transformed.shape[1] + 1),
    "var_pct": pca.explained_variance_ratio_,
    "cumsum_var_pct": np.cumsum(pca.explained_variance_ratio_)
})
```

Kode di atas digunakan untuk menghitung variansi kumulatif semua *principal components*. Selanjutnya, kita bisa melakukan visualisasi variansi yang dijelaskan oleh *principal components*.

```py
var_threshold = 0.9 # threshold 90%
min_components = df_explained[df_explained["cumsum_var_pct"] >= var_threshold]["pc"].iloc[0]

fig = px.line(df_explained, x="pc", y=["var_pct", "cumsum_var_pct"], markers=True)
fig.add_vline(x=min_components, line_dash="dash", annotation_text=f"Banyaknya PC optimal = {min_components}")
fig.show()
```

![Plot variansi *principal component*](https://assets.kodesiana.com/posts/2025/pca-image-clustering/pc-variance-plot.jpg)

Pada contoh di atas, penulis memilih jumlah *principal components* yang memenuhi minimum 90% variansi yang dijelaskan oleh *principal component*. Pada grafik di atas, 15 merupakan minimum jumlah *principal component* yang diperlukan untuk melakukan *clustering*.

Salah satu konsekuensi lain proses PCA ini adalah berkurangnya ukuran data yang diproses.

```py
size_change = (mat_transformed.nbytes-mat_images.nbytes)/mat_images.nbytes
print("Original data: {0}".format(naturalsize(mat_images.nbytes)))
print("Transformed data: {0} ({1:.2%})".format(naturalsize(mat_transformed.nbytes), size_change))

# Original data: 2,500.00 KB
# Transformed data: 11.72 KB (-99.53%)
```

Pada data asli, setidaknya diperlukan 2,5 MB RAM untuk menyimpan data dalam memori. Setelah dilakukan reduksi dimensi, ukuran penyimpanan yang diperlukan berkurang menjadi 11,72 KB, penurunan hingga 99,53%. Ternyata, perlakukan reduksi dimensi ini bisa menjadi alternatif untuk kompresi data.

Selanjutnya, kita akan memuat *principal component* dari proses PCA sebelumnya sesuai jumlah komponen yang ditentukan ke variabel baru untuk digunakan pada proses *clustering*.

```py
data_cluster = mat_transformed[:, :min_components-1]
```

### 3️⃣ Memilih Banyaknya Cluster

Seperti yang sudah dijelaskan sebelumnya, pada metode k-means kita perlu menentukan nilai \(k\) atau seberapa banyak *centroid* atau *cluster* yang akan dibuat. Pemilihan ini bisa berdasarkan inspeksi visual pada data atau dengan menggunakan dua metode visual yaitu **metode Elbow** dan **analisis Silhouette**.

#### Metode Elbow💪

Metode *Elbow* merupakan salah satu metode paling umum digunakan untuk menentukan berapa banyak *cluster* pada metode k-means. Metode ini menggunakan nilai *within cluster sum of squares (WCSS)* atau *sum of squared errors (SSE)* yang diplot terhadap banyaknya *cluster*.

$$
SSE(X, C) = \sum_{x \in X} \min_{c \in C} ||x - c||^2
$$

dengan \(X\) adalah data input dan \(C\) *centroid*.

Ide dari metode ini adalah menentukan banyaknya *cluster* ketika plot membentuk "sikut." Secara formal, "sikut" ini biasa didefinisikan sebagai titik data yang memiliki kemiringan atau gradien paling besar diikuti oleh titik data yang paling landai. Metode ini tergolong metode heuristik sehingga interpretasi titik sikut bisa berbeda-beda.

```py
visualizer = KElbowVisualizer(KMeans(random_state=42), k=(2, 20))
visualizer.fit(data_cluster)
visualizer.show()
```

![Visualisasi metode *Elbow*](https://assets.kodesiana.com/posts/2025/pca-image-clustering/elbow-method.jpg)

Berdasarkan output di atas, dapat diambil nilai \(k=8\) sebagai banyaknya *cluster* yang optimum untuk mengelompokkan data citra yang kita miliki.

Meskipun metode *elbow* ini sangat mudah untuk diimplementasi dan digunakan, metode ini telah menuai banyak kritik dari komunitas peneliti karena tidak adanya definisi formal pemilihan sikut dan berbagai kekurangan lain [2]. Schubert (2023) menyarankan untuk menggunakan ukuran alternatif untuk memilih banyaknya *cluster* yang lebih baik, salah satunya adalah *Variance Ratio Criterion (VRC)*.

> 💡 ***Rule of Thumb***
>
> Titik "sikut" atau titik ketika kemiringan plot paling tajam diikuti oleh titik yang landai

#### Variance Ratio Criterion📦

*Variance Ratio Criterion (VRC)* (disebut juga *Calinski-Harabasz index* atau *CH index* [3]) pertama kali dikemukakan pada pertengahan 70-an sebagai metode alternatif dari metode *elbow*. Metode ini mengukur rasio SSE terhadap banyaknya *cluster*.

$$
VRC := \frac{SSE_1 - SSE_k}{k - 1} \Bigg/ \frac{SSE_k}{n - k}
$$

Berbeda dengan metode *elbow*, pada metode ini kita ingin memilih skor *CH index* tertinggi. Intuisi dari skor ini adalah semakin tinggi skor, maka titik-titik data dalam *cluster* semakin dekat dengan *centroid* dan *cluster*-nya sendiri tersebar jauh satu sama lain.

```py
vrc_scores = [calinski_harabasz_score(data_cluster, KMeans(k, random_state=42).fit_predict(data_cluster)) for k in range(2, 20)]

fig = px.line(x=range(2, 20), y=vrc_scores, markers=True)
fig.update_layout(xaxis_title="k", yaxis_title="Calinski-Harabasz index")
fig.show()
```

![Visualisasi metode *Calinski-Harabasz index*](https://assets.kodesiana.com/posts/2025/pca-image-clustering/vrc-plot.jpg)

Pada visualisasi di atas dapat dilihat bahwa 2 *cluster* merupakan jumlah *cluster* terbaik. Jika dibandingkan dengan hasil pada metode *elbow* di atas, terdapat perbedaan yang cukup jauh dengan 8 *cluster*. Jika diperhatikan, plot di atas juga memiliki beberapa titik yang tinggi misalnya 4 dan 8. Hal ini menunjukkan bahwa ada kemungkinan beberapa jumlah *cluster* yang bisa menjadi kandidat.

Perlu diketahui juga bahwa dataset ini mengandung sampel dari 10 orang dengan masing-masing lima foto. Artinya, banyaknya *cluster* yang sebenarnya adalah 10 karena data ini berasal dari 10 kategori/orang. Dapat disimpulkan bahwa kedua metode di atas bukanlah metode yang akan memberikan 100% jawaban akurat mengenai banyaknya *cluster* yang optimal. Melainkan, kita harus melakukan berbagai eksperimen untuk mendapatkan hasil yang memuaskan.

> 💡 ***Rule of Thumb***
>
> Nilai *CH index* tertinggi adalah banyaknya *cluster* terbaik

#### Analisis Silhouette📏

Metode terakhir yang akan kita gunakan untuk mengevaluasi banyaknya *cluster* yang optimal adalah metode analisis *Silhouette*. Metode ini digunakan untuk mengevaluasi pemisahan antar *cluster* dan dalam *cluster*. Nilai *Silhouette* berada dalam interval [-1, 1]. Nilai mendekati 1 berarti sampel data berada jauh dari *cluster* tetangganya, sedangkan nilai 0 berarti sampel data berada pada batas atau sangat dekat dengan batas *cluster* lain. Nilai negatif berarti kemungkinan sampel data berada pada *cluster* yang salah.

Untuk contoh kali ini kita akan menggunakan nilai \(k=8\). Kamu juga bisa coba menggunakan nilai lain dan lihat bagaimana hasilnya!

```py
visualizer = SilhouetteVisualizer(KMeans(8, random_state=42))
visualizer.fit(data_cluster)
visualizer.show()
```

![Visualisasi analisis *Silhouette*](https://assets.kodesiana.com/posts/2025/pca-image-clustering/silhouette-analysis.jpg)

Pada visualisasi di atas, setiap *cluster* memiliki daerah plot. Daerah ini merupakan nilai *silhouette* untuk setiap sampel data pada *cluster*. Garis putus-putus merupakan nilai rata-rata *silhouette*. *Cluster* yang baik harus memiliki puncak grafik sampel di atas rata-rata. Selain itu, dapat diamati pada *cluster* 5 ada beberapa sampel data yang memiliki nilai negatif yang berarti ada beberapa sampel data yang seharusnya tidak termasuk dalam *cluster* karena jaraknya lebih dekat dengan *cluster* lain.

> 💡 ***Rule of Thumb***
>
> Indikasi *cluster* yang baik adalah ketika semua daerah plot per *cluster* melewati batas rata-rata *Silhouette score* dan sedikit atau tidak ada plot yang bernilai negatif

### 4️⃣ Clustering dan Visualisasi

Akhirnya kita sampai di saat yang ditunggu-tunggu, melakukan *clustering* data! Setelah kita banyak melakukan banyak evaluasi pemilihan berapa banyak jumlah *cluster* yang optimal, pada kasus ini kita akan pilih nilai \(k=8\).

```py
model_cluster = KMeans(n_clusters=8, random_state=42)
model_cluster.fit(data_cluster)
```

Selanjutnya, kita akanmelakukan visualisasi hasil *clustering* menjadi diagram pencar pada 2 dan 3 dimensi.

```py
fig = px.scatter(x=mat_transformed[:, 0], y=mat_transformed[:, 1], color=model_cluster.labels_)
fig.update_layout(xaxis_title="PC 1", yaxis_title="PC 2")
fig.show()
```

![Visualisasi *cluster* pada dua *principal component*](https://assets.kodesiana.com/posts/2025/pca-image-clustering/pc-cluster-2d.jpg)

Plot di atas menunjukkan hasil *cluster* yang berhasil dibuat pada dua dimensi, PC 1 dan PC 2. Bisa dilihat bahwa ada beberapa titik data yang timpang tindih. Kenapa? Kalau tebakan awal kamu karena kita memilih banyaknya *cluster* yang tidak optimal, sayang sekali, bukan karena itu😁 Fenomena ini terjadi karena input data yang kita gunakan memiliki 15 dimensi, sehingga visualisasi pada dua dimensi bisa menjunjukkan *cluster* yang timpang tindih.

Bagaimana dengan visualisasi pada tiga dimensi?

```py
fig = px.scatter_3d(x=mat_transformed[:, 0], y=mat_transformed[:, 1], z=mat_transformed[:, 2], color=model_cluster.labels_)
fig.update_layout(scene=dict(
    xaxis=dict(title=dict(text='PC 1')),
    yaxis=dict(title=dict(text='PC 2')),
    zaxis=dict(title=dict(text='PC 3')),
))

fig.show()
```

![Visualisasi *cluster* pada tiga *principal component*](https://assets.kodesiana.com/posts/2025/pca-image-clustering/pc-cluster-3d.jpg)

Pada plot di atas kita bisa lihat bahwa sebagian besar *cluster* tidak tumpang tindih pada tiga dimensi. 💡 Ini juga merupakan salah satu fenomena *blessing of dimensionality* (cek artikel [PCA](/post/pengantar-principal-component-analysis)) yaitu karakteristik data yang berbeda ketika data memiliki dimensi yang lebih tinggi. Dalam konteks ini, dimensi data yang lebih tinggi memberikan visualisasi yang baik (*blessing*).

Setelah kita tahu bagaimana sebaran data, selanjutnya kita bisa memvisualisasikan data pada setiap *cluster*.

```py
plot_images_cluster = mat_images[model_cluster.labels_ == 2, :, :] # ganti nomor cluster
fig = px.imshow(plot_images_cluster, binary_string=True, facet_col=0, facet_col_wrap=8)
fig.show()
```

![Visualisasi citra untuk *cluster* ketiga](https://assets.kodesiana.com/posts/2025/pca-image-clustering/cluster-image-samples.jpg)

Kamu bisa coba ganti nomor *cluster* sejumlah \(k-1\) pada kode di atas.

## Penutup💡

Pada artikel ini kita sudah mempelajari bagaimana cara implementasi PCA sebagai metode ekstraksi fitur untuk *clustering* citra. Contoh kasus kali ini kita menggunakan PCA pada data piksel yang berarti kita menggunakan fitur warna untuk melakukan *clustering*.

Kita juga sudah mempelajari mengenai metode k-means dan intuisi dibalik metode k-means. Selain itu, kita juga mempelajari tiga metode untuk memilih jumlah *cluster* yang optimal, mulai dari metode *Elbow*, *Variance Ratio Criterion (VRC)*, dan analisis *Silhouette*. Ternyata, tidak ada satu metode yang bisa memilih banyaknya *cluster* yang optimal, proses pemilihan harus berdasarkan eksperimentasi dengan berbagai jumlah *cluster* hingga kita mendapatkan jumlah *cluster* yang optimal.

Selain itu pada artikel ini kita baru membahas proses utama untuk *clustering* dan kita belum melakukan eksplorasi *cluster* yang berhasil kita buat. Apa saja karakteristik setiap *cluster*? Bagaimana cara melakukan analisis data lanjutan?

Kita akan coba cari tahu mungkin di artikel yang akan datang!

## Referensi📚

1. Piech, Chris. 2013. [K Means](https://stanford.edu/~cpiech/cs221/handouts/kmeans.html): Stanford CS221 Fall 2012. Diakses 01 Februari 2024.
2. Erich Schubert. 2023. Stop using the elbow criterion for k-means and how to choose the number of clusters instead. SIGKDD Explor. Newsl. 25, 1 (June 2023), 36-42. https://doi.org/10.1145/3606274.3606278
3. Caliński, T., and J Harabasz. 1974. A Dendrite Method for Cluster Analysis. Communications in Statistics 3 (1): 1-27. doi:10.1080/03610927408827101.
