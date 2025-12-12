---
title: Arsip Data Gempa dan Peringatan Cuaca BMKG untuk Penelitian🗃️
date: 2025-12-12
categories: Data Science
tags: [dataset, data science, BMKG, spasial]
slug: arsip-data-gempa-peringatan-cuaca-bmkg-penelitian
description: Koleksi data gempa bumi dan peringatan cuaca dari BMKG sejak 2023 dengan lebih dari 2000+ data gempa
image: https://assets.kodesiana.com/posts/2025/arsip-data-bmkg/cover_comp.jpg
---

> Foto oleh [Çağlar Oskay](https://unsplash.com/@oskaycaglar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) dari [Unsplash]("https://unsplash.com/photos/a-car-is-parked-in-front-of-a-destroyed-building-mmLtohu4qmE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

{{< button content="Akses Data BMKG" icon="cloud" href="/projects/data-bmkg" >}}

Apakah kamu seorang peneliti? Mahasiswa yang sedang mengerjakan tugas akhir? Badan, instansi, atau organisasi yang berkaitan dengan program kemanusiaan yang berkaitan dengan bencana alam?

Inisiatif **Arsip Data BMKG oleh Kodesiana** merupakan memanfaatkan data dari **Data Terbuka BMKG** untuk menyediakan akses data historis yang dapat diakses oleh masyarakat umum dan peneliti. Kalau BMKG sudah punya inisiatif Data Terbuka BMKG, kenapa perlu inisiatif Arsip Data BMKG?

## Data Terbuka BMKG🌏

[Data Terbuka BMKG](https://data.bmkg.go.id) adalah program transparasi dan akuntabilitas data dari BMKG. Program ini menyediakan berbagai jenis data mulai dari ramalan cuaca, peringatan cuaca ekstrem, dan gempa bumi di Indonesia secara terbuka tanpa biaya.

Data yang disediakan juga cukup lengkap, termasuk koordinat dan waktu kejadian gempa dan cuaca, sehingga data ini akan sangat vital untuk keperluan penelitian dan riset.

Kalau BMKG sudah mempublikasikan data dengan gratis, kenapa penulis membuat program arsip data ini?

## Web Scraping ♥️ Ritsu-Pi

Sebagai peneliti, kita tentu perlu akses ke data historis untuk menemukan pola dari data. Tapi sayangnya, BMKG hanya menyediakan **15 data terbaru** saja.

Nah, hal tersebut tentu menjadi limitasi karena 15 baris data tentunya sangat sedikit untuk melakukan analisis apa pun. Akhirnya, penulis membuat program arsip ini karena .... penulis suka penelitian😀 Selain itu, beberapa tahun lalu penulis pernah berbagi mengenai *homelab* penulis: [Ritsu-Pi](/post/membangun-home-server-menggunakan-raspberry-pi-dan-ansible-bagian-2).

Untuk mewujudkan program arsip data ini, penulis memanfaatkan *server homelab* untuk menjalankan *script* untuk melakukan *web scraping* data terbuka BMKG.

Program arsip data BMKG saat ini melakukan proses *scraping* setiap 30 menit untuk memastikan kebaruan data. Pada saat artikel ini ditulis (2025/12/12 13.23), arsip data BMKG memiliki koleksi:

- 599 gempa dirasakan,
- 2.096 gempa dirasakan,
- 3.501 peringatan cuaca

yang sudah dikoleksi sejak tahun 2023. Selain data asli dari BMKG, penulis juga melakukan beberapa praproses data untuk memperbaiki struktur data BMKG serta mengolah data tersebut menjadi data vektor spasial (titik gempa dan poligon wilayah terdampak peringatan cuaca). Data asli dari BMKG dikategorikan sebagai data **Level 1** dan data olahan penulis dikategorikan sebagai data **Level 2**.

Kamu bisa akses ke informasi dataset arsip data BMKD dengan klik tombol di bawah ini.

## Analisis dan Visualisasi Data📈

{{< button content="Akses Data BMKG" icon="cloud" href="/projects/data-bmkg" >}}

Pada artikel sebelumnya, penulis pernah berbagi mengenai visualisasi data gempa BMKG menggunakan [Microsoft Excel](/post/scraping-dan-visualisasi-gempa-bmkg-dengan-microsoft-excel/) dan [Kepler.gl](/post/clustering-dan-visualisasi-gempa-bmkg-dengan-kepler.gl/). Data pada kedua artikel tersebut merupakan data **Level 1** yang bersifat *snapshot*. Untuk data yang diperbarui secara berkala, kamu bisa klik tombol di atas.

Kali ini kita akan coba melakukan analisis dan visualisasi data menggunakan data Level 1 dan 2 menggunakan Python. Yuk kita coba!

Untuk contoh analisis ini, kamu perlu *install package* berikut: `pandas`, `geopandas`, `cartopy`, `shapely` dan `matplotlib`. Pada contoh ini juga penulis menggunakan Jupyter Notebook, kamu juga bisa gunakan Google Colab atau Kaggle untuk mencoba analisis ini.

```python
import shapely.plotting
import pandas as pd
import geopandas as gpd
import cartopy.crs as ccrs
import matplotlib.pyplot as plt

from IPython.display import Image, display
```

### Gempa Bumi

Tahap pertama adalah memuat data gempa, pada contoh ini adalah data gempa terkini level 1. Data ini bisa diakses melalui arsip data BMKG dan tersedia secara gratis. Unduh data gempa terkini dengan format JSON Lines kemudian muat data menggunakan *library* `pandas`.

Baris kedua berfungsi untuk mengekstrak lokasi gempa dirasakan dari episenter gempa dan baris selanjutnya untuk menampilkan sampel dua data pada dataset.

```python
df_gempa = pd.read_json("<LOKASI FILE>/gempa_terkini-L1.jsonl", lines=True)
df_gempa["location"] = df_gempa["region"].str.split(" ").str[-1]

df_gempa.head(2)
```

Selanjutnya kita bisa mulai melakukan analisis lebih lanjut. Salah satu visualisasi yang bisa kita buat adalah berapa banyak daerah yang merasakan gempa. Kita akan memanfaatkan `pandas` untuk melakukan perhitungan serta visualisasi. Kita akan hitung banyaknya gempa berdasarkan lokasi (`value_counts`), kemudian diambil 10 daerah dengan gempa terbanyak (`nlargest`).

```python
g = df_gempa["location"].value_counts().nlargest(10).plot.barh()
g.bar_label(g.containers[0])
plt.show()
```

![Banyaknya gempa dirasakan](https://assets.kodesiana.com/posts/2025/arsip-data-bmkg/gempa_location_comp.png)

Selain banyaknya gempa, magnitudo gempa juga merupakan informasi yang bermanfaat untuk mengukur seberapa besar gempa dirasakan oleh masyarakat. Perlu diingat bahwa data gempa dirasakan adalah gempa dengan magnitudo di atas lima. Histogram merupakan salah satu pilihan terbaik untuk memvisualisasikan distribusi data.

```python
df_gempa["magnitude"].plot.hist(bins=20)
plt.show()
```

![Ditribusi magnitudo gempa](https://assets.kodesiana.com/posts/2025/arsip-data-bmkg/gempa_magitude_comp.png)

Nah, sekarang saatnya kita mulai melakukan eksplorasi data spasial yaitu koordinat titik gempa (*latitude* dan *longitude*). Untuk memudahkan manipulasi data geometri, kita akan menggunakan *library* `geopandas`. Kode berikut akan membuat titik-titik dari data *latitude* dan *longitude* dengan *Coordinate Reference System (CRS)* EPSG:4326. Bagi teman-teman yang belum familier dengan sistem koordinat, kode EPSG 4326 adalah sistem koordinat WGS84 (*World Geodetic System 1984*).

```python
gdf_gempa = gpd.GeoDataFrame(df_gempa, geometry=gpd.points_from_xy(df_gempa["longitude"], df_gempa["latitude"], crs="EPSG:4326"))
gdf_gempa.head(2)
```

Selanjutnya, kita bisa membuat visualisasi titik-titik gempa menggunakan bantuan *library* `cartopy`. Sesuai namanya, `cartopy` merupakan singkatan dari *Cartography Python* atau ilmu pembuatan peta dalam Python. *Plate Carree* merupakan salah satu proyeksi bumi pada permukaan 2D. Kalau kamu pernah punya atlas atau peta, kemungkinan besar peta tersebut menggunakan proyeksi Mercator, salah satu jenis proyeksi lain yang lazim digunakan untuk memetakan permukaan 3D ke 2D.

Kali ini kita akan memvisualisasikan titik-titik gempa dengan skala warna berdasarkan magnitudo.

```python
fig, ax = plt.subplots(subplot_kw=dict(projection=ccrs.PlateCarree()))

dd = gdf_gempa[(gdf_gempa["date_time"] >= "2025-01-01") & (gdf_gempa["date_time"] <= "2025-12-31")]
dd.plot(column="magnitude", legend=True, cmap='OrRd', legend_kwds={"label": "Magnitudo", "orientation": "horizontal"}, ax=ax)

ax.coastlines()
ax.set_title("Gempa Bumi Dirasakan selama Tahun 2025")

plt.show()
```

![Sebaran titik gempa di tahun 2025](https://assets.kodesiana.com/posts/2025/arsip-data-bmkg/gempa_koordinat_comp.png)

### Peringatan Cuaca

Sekarang, kita akan coba melakukan analisis dan visualisasi data peringatan cuaca menggunakan data arsip BMKG Level 2. Kali ini kita akan menggunakan jenis data GeoPackage sehingga kita tidak perlu lagi melakukan praproses data, khususnya karena data peringatan cuaca berisi data poligon yang lebih *challenging* untuk diubah menjadi poligon dibandingkan titik.

```python
gdf_cuaca = gpd.read_file("../data/peringatan_cuaca/peringatan_cuaca-L2.gpkg")
gdf_cuaca.head(2)
```

Beberapa informasi yang tersedia pada dataset adalah waktu peringatan dikirim, waktu peringatan efektif dimulai, dan waktu akhir peringatan. Berdasarkan tiga informasi ini, kita dapat menghitung selisih antara waktu peringatan dikirim dengan peringatan dimulai, untuk mengukur berapa lama waktu yang tersedia agar masyarakat dapat bersiap untuk kejadian cuaca tersebut. Semakin lama, semakin bagus.

Di sisi lain, selisih waktu antara waktu efektif peringatan dengan waktu akhir dapat menunjukkan durasi cuaca ekstrem. Dengan mengetahui distribusi durasi tersebut, kita bisa mengevaluasi kinerja BMKG dalam memberikan peringatan potensi cuaca ekstrem yang aktual.

```python
gdf_cuaca[["prep_duration", "alert_duration"]].plot.hist(bins=20)
plt.show()
```

![Sebaran durasi peringatan cuaca](https://assets.kodesiana.com/posts/2025/arsip-data-bmkg/alert_duration_comp.png)

Dapat dilihat bahwa waktu antara peringatan disampaikan dengan waktu prediksi cuaca ekstrem kurang dari 30 menit yang sepertinya bukan waktu yang cukup untuk mempersiapkan diri. Di sisi lain, durasi cuaca ekstrem bisa mencapai 300 menit (5 jam). *Not bad*, mengingat memprediksi cuaca di ekuator merupakan salah satu model cuaca yang paling sulit untuk mendapatkan hasil yang akurat.

Selanjutnya, kita bisa melihat data peringatan cuaca pada salah satu peringatan. Contohnya kita akan lihat pada data ke-11 pada dataset.

```plain
print(gdf_cuaca.iloc[10, :])

id                              2.49.0.1.360.0.2025.12.01.15.15.006
sent_at                                         2025-12-01 13:02:00
event                                         Hujan Lebat dan Petir
urgency                                                   Immediate
severity                                                   Moderate
certainty                                                  Observed
effective_at                                    2025-12-01 13:12:00
expires_at                                      2025-12-01 16:00:00
web               https://nowcasting.bmkg.go.id/infografis/CJI/2...
area_name                                                     Jambi
prep_duration                                                  10.0
alert_duration                                                168.0
regions           ['Air Hitam', 'Bahar Selatan', 'Bahar Utara', ...
len_regions                                                      46
len_polygons                                                     46
geometry          MULTIPOLYGON (((103.466 -1.529, 103.457 -1.557...
Name: 10, dtype: object
```

Dataset peringatan cuaca ini terdiri atas geometri wilayah yang terancam, nama wilayah, serta infografis dari BMKG. Kita bisa menampilkan infografis tersebut sebagai berikut.

```python
display(Image(url=gdf_cuaca.iloc[10, :].web, width=600))
```

![Infografis peringatan cuaca](https://assets.kodesiana.com/posts/2025/arsip-data-bmkg/alert-infografis_comp.jpg)

Menarik, ya? Selama ini kita mungkin hanya familier dengan *Shakemap* yang menunjukkan pusat gempa, tapi ternyata ada juga infografis peringatan cuaca. Nah infografis ini juga ternyata diberikan oleh BMKG dalam bentuk poligon yang bisa kita visualisasikan.

```python
shapely.plotting.plot_polygon(gdf_cuaca.iloc[10, :].geometry, add_points=False)
plt.show()
```

![Poligon peringatan cuaca](https://assets.kodesiana.com/posts/2025/arsip-data-bmkg/alert_polygon_comp.png)

Voila! Sekarang kita bisa memvisualisasikan poligon daerah dengan peringatan cuaca dan karena data ini merupakan data spasial, kamu bisa melakukan analisis yang lebih mendalam dengan program seperti QGIS dan ArcGIS.

Perhatikan bahwa poligon pada data spasial ini tidak sama dengan infografis. Setelah penulis melakukan perbandingan, ternyata poligon ini hanya sebagian dari keseluruhan daerah dalam infografis. Berdasarkan standar dari [OASIS Common Alerting Protocol Version 1.2](https://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html), poligon ini berisi daerah yang terdampak. Sehingga meskipun ada diskrepansi antara infografis dan poligon ini, data poligon ini tetap valid untuk keperluan analisis

## Penutup 📚

Pada artikel ini penulis berbagi arsip data BMKG yang sudah penulis himpun sejak 2023. Kita juga sudah sedikit melakukan analisis dan visualisasi data tersebut menggunakan Python.

{{< button content="Akses Data BMKG" icon="cloud" href="/projects/data-bmkg" >}}

Kamu bisa mengakses arsip data BMKG secara gratis (Level 1) dengan cara klik pada tombol di atas. Kalau kamu perlu akses ke data olahan yang lebih terstruktur, kamu bisa mengikuti arahan pada halaman tersebut untuk mendapatkan akses ke data Level 2.

Semoga arsip data BMKG ini bisa bermanfaat untuk kalian!
