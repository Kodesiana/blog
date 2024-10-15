---
title: Pengenalan Data Science, AI, dan ML🛸
categories: Data Science
tags: ['machine learning', tutorial, tips]
date: 2020-02-12
slug: pengenalan-data-science-ai-dan-ml
---

**Data Science** - Pada zaman revolusi industri 4.0 ini, istilah data science kian populer dan tren nya semakin tersebar
luas. Saat ini, sebagian besar perusahaan dengan teknologi mutakhir seperti Microsoft dan Google gencar melakukan
inovasi pada bidang data science. Tidak hanya perusahaan asing, perusahaan *unicorn*🦄 lokal Indonesia seperti GRAB,
GO-JEK, dan Telkom sudah menerapkan teknologi ini.

Meskipun demikian, developer di Indonesia saat ini masih belum memiliki spesialisasi pada bidang ini. Kenapa?🤔

## Pengenalan Data Science🏖

Sebelum kita terjun lebih jauh tentang data science, kita perlu tahu apa itu data science. Menurut Dhar, ilmu data
(bahasa Inggris: data science) adalah suatu disiplin ilmu yang khusus mempelajari data, khususnya data kuantitatif (data
numerik), baik yang terstruktur maupun tidak terstruktur.

Ok, pengertiannya boring ya? Penulis akan tambahkan lagi pengertian lain:

> Data science adalah ilmu yang mempelajari cara pengumpulan, mengolah, dan menghasilkan informasi/manfaat/insight dari
> data.
>
> Fahminlb33

Intinya, ilmu data science berkutat pada bagaimana cara menggunakan data untuk menghasilkan informasi baru. Bukan hanya
**mengolah**, tapi juga bagaimana cara **mendapatkan data** tersebut, **mencari pola**, **membuat asumsi**, dan
**menghasilkan prediksi/ramalan** berdasarkan data.

### Data dalam Kehidupan Sehari-Hari😲

Kamu pernah pakai aplikasi Google Assistant atau Siri? Dua contoh tersebut merupakan implementasi dari data science,
spesifiknya adalah bidang
**[*Natural Language Processing* (NLP)](https://en.wikipedia.org/wiki/Natural_language_processing)** [spoiler: NLP
adalah ilmu yang mempelajari bagaimana membuat mesin mengerti bahasa manusia].

Selain itu, pernahkah kamu melihat iklan kamera dengan fitur AI? Ko bisa ya foto dengan kamera dan hasilnya bisa
menipu🤣. Ini adalah salah satu contoh dari **[*Computer Vision* (CV)](https://en.wikipedia.org/wiki/Computer_vision)**
[spoiler: CV adalah ilmu yang mempelajari bagaimana komputer dapat melihat seperti manusia (memahami objek, dll.)].

Mungkin contoh lain adalah ramalan cuaca, dengan kita cari "cuaca" di Google Search, kita bisa dapat hingga prediksi
satu minggu cuaca ke depan. Wow😮. Nah kalau ini adalah contoh dari **Regression** [spoiler: regression adalah ilmu
untuk melakukan peramalan, baik di masa depan atau masa lalu].

Tiga contoh di atas hanya contoh kecil, masih sangat banyak contoh lain yang tidak bisa disebutkan disini.

### Butuh Skill Apa ya?📚

Kalau kita lihat dari manfaat apa aja yang bisa kita dapatkan dari DS, pasti syarat belajarnya juga banyak dong😁.

Untuk belajar data science, setidaknya Anda harus memiliki dasar pemahaman beberapa keilmuan lainnya, seperti:

1. Matematika (alajar linier matriks, fungsi)
2. Statistika (analisis korelasi, analisis regresi, *time series*)
3. Ilmu komputer (pemrograman)

Tapi tenang aja, pada seri training ini, kita akan bahas semuanya sampai detail, jadi jangan ragu untuk terus belajar
ya!

Kembali lagi ini hanya saran untuk memulai belajar data science, agar prosesnya lebih mudah.

{{< unsplash "photo-1542744173-05336fcc7ad4" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzI4OTYxNzY0fA" "Photo by Campaign Creators on Unsplash" "person using macbook pro" >}}

### Ngetren📈 dan Prospeknya Cerah🌞

Berdasarkan data dari Google Trends, terjadi kenaikan dalam pencarian terkait dengan data science, lho!

<script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/2051_RC11/embed_loader.js"></script>
<script type="text/javascript">trends.embed.renderExploreWidget("TIMESERIES", {"comparisonItem":[{"keyword":"data science","geo":"ID","time":"today 12-m"}],"category":0,"property":""}, {"exploreQuery":"geo=ID&q=data%20science&date=today 12-m","guestPath":"https://trends.google.com:443/trends/embed/"});</script>

Tidak hanya popularitas-nya, tapi prospek kerja untuk developer dengan kemampuan data science itu masih langka di
Indonesia, bahkan secara umum di bursa kerja, kemampuan ini menjadi incaran perusahaan besar karena adopsi teknologi
berbasis data science ini sedang hot🔥, bukan hanya karena tren tapi karena manfaat yang dihasilkan dengan menerapkan
data science.

Menurut blog dari University of Wisconsin, rata-rata penghasilan untuk seorang data scientist adalah $113.436 USD atau
Rp1.550.670.120 per tahun😍. Harga yang sangat fantastis ya untuk seorang data scientist.

### Tools dan Bahasa Pemrograman🛠

Tool untuk digunakan dalam data science itu banyak lho! [*disini kita akan bahas tool yang akan kita gunakan aja ya!*]

Bagi yang suka belajar secara visual, ada aplikasi seperti **[Orange](https://orange.biolab.si/),
[RapidMiner](https://rapidminer.com/)**, dan **[WEKA](https://www.cs.waikato.ac.nz/ml/weka/)** untuk melakukan **data
mining**. Selain itu, kalau mau belajar pemrogramannya, ada aplikasi **[Anaconda](https://www.anaconda.com/)** yang
berisi paket lengkap untuk belajar pemrograman khususnya Python untuk data science.

Tool lain yang sangat penting untuk belajar data science adalah **[Jupyter Notebook](https://jupyter.org/)**. Jupyter
merupakan aplikasi notebook seperti Microsoft Word, tetapi kita juga bisa *ngoding* di dalamnya. Iya, kita bisa menulis
sekaligus ngoding dan running program dalam satu notebook.

Pada seri training ini, kita akan menggunakan **Anaconda, Visual Studio Code**, dan **Google Colab**. Google Colab
adalah layanan Jupyter notebook gratis dari Google.Semua source code dan notebook akan di share pada akun GitHub
penulis.

## Artificial Intelligence dan Machine Learning👾

Nah sekarang kita mulai mengerucut ke topik yang lebih menarik, yaitu **artificial intelligence** dan **machine
learning**.

**Artificial intelligence** merupakan studi untuk menciptakan mesin yang "cerdas" dan dapat bekerja dan bereaksi seperti
manusia.

**Machine learning** merupakan bagian dari *artificial intelligence* yang bertujuan untuk menciptakan mesin yang dapat
belajar sendiri tanpa perlu diprogram secara eksplisit.

Persamaan keduanya yaitu keduanya sama-sama diprogram agar dapat belajar sendiri dan menjadi "cerdas" untuk
menyelesaikan masalah tertentu. Perbedaannya AI lebih umum dan mencakup topik yang lebih luas daripada machine learning.

### Proses Pembuatan Model

Pada praktiknya, untuk membuat suatu sistem cerdas, dilakukan beberapa proses dalam pembuatan sebuah model, yaitu:

1. **Data Ingestion**, yaitu bagaimana cara mendapatkan data yang menjadi topik pembahasan. Misalnya Anda mengumpulkan
   data melalui kuisioner/angket, data dari sensor, atau dari pihak ketiga.
2. **Exploratory Data Analysis**, yaitu proses untuk melihat karakteristik data seperti sebaran data, distribusi
   frekuensi, dan pola-pola dari data. Beberapa teknik untuk melakukan EDA seperti tabel distribusi frekuensi dan
   diagram pencar (*scatter plot*).
3. **Preprocessing**, yaitu proses menyiapkan data mentah sebelum digunakan untuk melatih algoritma ML. Contohnya
   algoritma ML tidak mengerti tulisan, maka dari itu perlu dilakukan vektorisasi (*bag-of-words*, n-gram, TF-IDF, dll.)
   atau ada distribusi angka, Anda melakukan transformasi agar angka tersebut berada di antara 0-1 (*scaling*).
4. **Training**, yaitu proses melatih algoritma ML dengan data. Pada proses ini data yang sudah disiapkan dari tahap
   *preprocessing* akan digunakan oleh algoritma ML untuk membentuk model.
5. **Evaluation**, yaitu proses menguji model yang sudah dibuat dengan data baru, apakah model yang sudah dibuat dapat
   dengan benar memprediksi data baru.
6. **Optimization**, yaitu proses mengatur model agar dapat menghasilkan akurasi yang lebih baik. Bisa dengan cara
   mengubah dataset atau mengubah parameter algoritmanya.
7. **Production**, yaitu merilis model yang sudah dibuat agar dapa digunakan pada sebuah sistem.

Tujuh langkah di atas mungkin terlihat sulit awalnya, tetapi kita akan bahas satu persatu dengan detail agar Anda bisa
belajar data science dengan asik dan lebih mudah tentunya.

Mungkin sekian untuk pengenalan mengenai data science. Anda mungkin kaget yang awalnya disuguhkan sedikit pengertian dan
contoh, hingga ditawarkan gaji yang fantastis, di akhir ditutup oleh pengertian teknis tentang data science😅

Sampai ketemu di artikel selanjutnya! Jangan lupa subscribe ke mailing list Kodesiana.com ya!

## Referensi

1. Dhar, V. 2013. [Data science and prediction](http://cacm.acm.org/magazines/2013/12/169933-data-science-and-prediction/fulltext). *Communications of the ACM*. **56** (12): 64. doi:[10.1145/2500499](https://doi.org/10.1145%2F2500499). Diakses 12 Februari 2020.
2. University of Wisconsin. 2020. [How Much is a Data Scientist's Salary?](https://datasciencedegree.wisconsin.edu/data-science/data-scientist-salary/). Diakses 12 Februari 2020.
3. Sheldon, Amyra. 2019. [Artificial Intelligence Vs Machine Learning: What's the difference?](https://hackernoon.com/artificial-intelligence-vs-machine-learning-whats-the-difference-9e35u30a0). Diakses 12 Februari 2020.
