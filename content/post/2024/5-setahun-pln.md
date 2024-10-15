---
title: Setahun dengan PLN⚡ Mati Lisrik 81 Kali
categories: [Data Science, Tutorial]
tags: [data mining, tutorial]
date: 2024-10-25
description: Kisah lika-liku hidup di gunung. Tidak hanya sulit akses internet, tapi juga listrik.
image: https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/setahun-pln/setahun-pln-cover.jpg
draft: true
---

{{< button-group >}}

{{< button content="Akses Notebook" icon="gilbarbara-logos-jupyter" href="https://l.kodesiana.com/setahun-pln-2024-colab" >}}

{{< button content="Unduh Dataset" icon="download" href="https://l.kodesiana.com/setahun-pln-2024-dataset" >}}

{{</ button-group >}}

Listrik merupakan salah satu kebutuhan primer bagi manusia di zaman digital ini. PLN sebagai penyedia layanan listrik bertanggung jawab untuk menyediakan layanan yang reliabel kepada pelanggannya, di mana pun lokasi tinggalnya. Tentu saja tidak mungkin PLN bisa menyediakan layanan tanpa pemadaman, faktor eksternal seperti cuaca dan bencana alam pasti diluar kendali PLN. Tetapi apa yang terjadi jika layanan PLN sering kali putus nyambung? Di mana batas "normal" jika terjadi pemadaman?

Kali ini penulis akan bercerita pengalaman penulis selama satu tahun terakhir (2023-2024) dengan PLN di Kabupaten Bogor. Data yang digunakan dalam artikel ini berasal dari server [Ritsu-Pi](/post/membangun-home-server-menggunakan-raspberry-pi-dan-ansible-bagian-1/) dan dikumpulkan menggunakan Prometheus.

Pada artikel ini kita akan menjawab pertanyaan-pertanyaan penting seperti seberapa sering mati listrik? Berapa lama mati listrik? dan lainnya!

Seperti biasa, kita mulai dengan mengimpor *library* yang diperlukan.

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_style("white")
```

## Memuat Data

Tahap selanjutnya adalah memuat data yang akan kita analisis. Seperti biasa data yang akan kita gunakan sudah saya sediakan secara terbuka dan bisa digunakan dengan bebas asalkan mencantumkan nama penulis😁

```python
df = pd.read_csv("https://l.kodesiana.com/setahun-pln-2024-dataset", storage_options={'User-Agent': 'Mozilla/5.0'})
df.info()
```

Output:

```plain
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 1119427 entries, 0 to 1119426
Data columns (total 2 columns):
 #   Column     Non-Null Count    Dtype  
---  ------     --------------    -----  
 0   timestamp  1119427 non-null  float64
 1   value      1119427 non-null  int64  
dtypes: float64(1), int64(1)
memory usage: 17.1 MB
```

Dataset ini terdiri atas dua kolom/atribut, yaitu:

1. `timestamp` yang berisi waktu baris data tersebut direkam oleh Prometheus
2. `value` waktu kapan server pertama kali menyala setelah *restart* terakhir

Waktu dalam kedua kolom ini adalah *UNIX timestamp (seconds)*. Karena kolom `value` memiliki nilai yang konstan sejak waktu terakhir server di-*restart*, maka kita bisa menggunakan informasi ini untuk mengukur selisih waktu antara dua baris data dengan nilai `value` yang berbeda untuk menentukan *downtime* dan *uptime*.

*Uptime* didefinisikan sebagai lama waktu tidak terjadi mati listrik dan *downtime* adalah lama waktu mati listrik.

## Praproses Data

Untuk dapat menurunkan nilai *uptime* dan *downtime*, kita bisa menggunakan manipulasi *date time* menggunakan Pandas. Tetapi sebelum itu, kita perlu mengonversi waktu UTC pada kolom *timestamp* menjadi `pandas.datetime` agar kita bisa lebih mudah mengakses datanya menggunakan aksesor `.dt`

```python
df["timestamp"] = pd.to_datetime(df["timestamp"], unit="s", utc=True).dt.tz_convert("Asia/Jakarta")
```

Sekarang pada kolom `timestamp` sudah bukan `float64` lagi, melainkan `datetime64`. Tahap selanjutnya adalah menentukan waktu awal dan akhir dari setiap nilai unik pada kolom `value`. Idenya adalah jika kita mengelompokkan nilai unik pada kolom `values`, kita bisa mendapatkan waktu kapan server pertama menyala dan waktu kapan server terakhir menyala.

```python
df_sla = pd.merge(
    df.groupby("value").min().reset_index().rename(columns={"timestamp": "ts_start"}),
    df.groupby("value").max().reset_index().rename(columns={"timestamp": "ts_end"}),
    on="value"
)
```

Sampai di sini kita sudah mendapatkan waktu awal dan akhir server menyala. Tahap selanjutnya adalah menghitung berapa lama waktu server menyala dan mati berdasarkan waktu awal dan akhir yang sudah dihitung sebelumnya. Untuk menghitung *downtime*, penulis menggunakan fungsi `shift` untuk menghilangkan satu baris teratas agar bisa dicari selisih waktu mati.

Selain itu data dari Prometheus terdapat sedikit anomali yang menghasilkan nilai negatif pada *down time* atau ada *maintenance* dengan server sehingga perlu dilakukan penghapusan data pencilan.

```python
# menghitung uptime, lama waktu listrik menyala
df_sla["uptime"] = df_sla["ts_end"] - df_sla["ts_start"]

# menghitung downtime, lama waktu listrik mati
df_sla["downtime"] = df_sla["ts_start"] - df_sla["ts_end"].shift(1)

# menghilangkan outlier (mati listrik < 0 detik dan lebih dari 3 hari)
df_sla = df_sla[(df_sla["downtime"].dt.total_seconds() > 0) & (df_sla["downtime"].dt.days < 3)]

# menampilkan 5 data teratas
df_sla.head()
```

![Tampilan data setelah praproses data](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/setahun-pln/table1.png)

## Analisis Data

Setelah kita memiliki data *downtime* dan *uptime*, selanjutnya kita bisa memulai proses analisis dan visualisasi data untuk menjawab pertanyaan-pertanyaan penulis yang penasaran, apa iya PLN ini sering banget mati listrik atau perasaan penulis aja?

### Service Level Agreement (SLA)

*Service Level Agreement (SLA)* dalam konteks jasa IT adalah komitmen antara penyedia layanan dan pengguna yang menjelaskan apa saja metrik atau ukuran performa layanan yang diberikan [1]. Misalnya dalam kasus layanan internet, SLA 99.9% dengan *bandwidth* 50 Mbps berarti penyedia layanan internet harus menyediakan internet dengan *bandwidth* 50 Mbps dan jaminan gangguan maksimal 1 menit 26 detik per hari atau 8 jam 41 menit 38 detik per tahun. Kamu bisa menghitung berapa batasan *downtime* menggunakan [layanan ini](https://uptime.is/).

```python
total_time = df_sla["ts_end"].max() - df_sla["ts_start"].min()
downtime   = df_sla["downtime"].sum()
uptime     = df_sla["uptime"].sum()

sla_percentage = (total_time - downtime) / total_time * 100

print(f"Total time = {total_time}")
print(f"Downtime   = {downtime}")
print(f"Uptime     = {uptime}")
print(f"SLA        = {sla_percentage:.4f}%")

print(f"Count      = {df_sla.shape[0]}")
print(f"Start date = {df_sla['ts_start'].min()}")
print(f"End date   = {df_sla['ts_end'].max()}")
```

Output:

```plain
Total time = 393 days 20:41:20.342000009
Downtime   = 4 days 18:22:09.415999888
Uptime     = 356 days 06:31:57.893000124
SLA        = 98.7901%
Count      = 81
Start date = 2023-08-26 16:05:07.263000010+07:00
End date   = 2024-09-23 12:46:27.605000019+07:00
```

Pada kasus ini ternyata dalam kurun waktu satu tahun, terjadi mati listrik selama 4 hari 18 jam 22 menit. Jika dikonversi menjadi SLA, didapatkan SLA sebesar 98,7901%. Biasanya, bagi penyedia layanan IT, SLA yang disepakati adalah 99,1% tetapi penulis tidak tahu bagaimana SLA untuk PLN.

Kalau kamu tau, bisa komentar di bawah ya!

Jika dilihat dari berapa banyak kejadian mati listrik, ternyata mulai dari tanggal 26 Agustus 2023 s.d. 23 September 2024, telah terjadi 81 kali mati listrik! Apakah PLN di daerah kamu juga sering mati listrik sesering ini?😭

### Durasi Mati Listrik Kumulatif Harian

Setelah kita tau beberapa statistik kunci pada analisis SLA, tahap selanjutnya kita bisa coba melakukan analisis dari sisi durasi mati listrik. Pada contoh ini kita melihat durasi kumulatif mati listrik sepanjang tahun. Dengan visualisasi ini kita bisa melihat seberapa lama durasi mati listrik dan melihat "seberapa parah" mati listrik dalam satu hari tertentu.

Untuk melakukan analisis tersebut, kita akan menggunakan fungsi `cumsum` untuk mendapatkan jumlah kumulatif dari waktu *downtime* kemudian kia lakukan konversi menjadi satuan jam.

```python
df_down_daily = df_sla[["ts_end","downtime"]].copy()
df_down_daily["date"] = df_down_daily["ts_end"].dt.date

df_down_daily = df_down_daily.groupby("date")["downtime"].sum().reset_index()
df_down_daily["cumsum"] = df_down_daily["downtime"].cumsum().dt.total_seconds() / 60 / 60

df_down_daily.head()
```

![Tabel durasi mati listrik kumulatif harian](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/setahun-pln/downtime_cumulative.png)

```python
sns.lineplot(data=df_down_daily, x="date", y="cumsum")
```

![Grafik durasi mati listrik kumulatif harian](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/setahun-pln/downtime_cumulative_line.png)

Jika kita perhatikan, sekitar bulan Maret 2024 terjadi mati listrik dengan durasi yang panjang, ditandai dengan garis tegak pada bulan tersebut. Kita perlu visualisasi yang lebih ringkas untuk dapat melihat pola mati listrik ini.

Bagaimana kalau kita coba visualisasikan datanya per bulan?

### Durasi Mati Listrik Kumulatif Bulanan

Untuk membantu kita memahami bagaimana perilaku mati listrik PLN, kita akan coba melakukan pengelompokkan per bulan. Informasi yang akan kita cari masih sama seperti sebelumnya, yaitu durasi kumulatif, tetapi kita juga akan menjumlahkan durasi mati listrik per bulan, mungkin kita bisa melihat apakah ada "musim mati listrik."

```python
df_down_monthly = df_sla[["ts_end","downtime"]].copy()
df_down_monthly["date"] = df_down_monthly["ts_end"].dt.strftime("%Y-%m")

df_down_monthly = df_down_monthly.groupby("date")["downtime"].sum().reset_index()
df_down_monthly["hours"]  = df_down_monthly["downtime"].dt.total_seconds() / 60 / 60
df_down_monthly["cumsum"] = df_down_monthly["hours"].cumsum()

df_down_monthly.head()
```

![Tabel durasi mati listrik kumulatif bulanan](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/setahun-pln/downtime_cumulative_monthly.png)

Pada visualisasi kali ini kita akan membuat *combo chart* dengan menggabungkan diagram batang dan diagram garis menggunakan Matplotlib dan Seaborn.

Tahap pertama adalah memanggil fungsi `plt.subplots` untuk mendapatkan `Axis` yang nantinya akan diisi diagram. Tahap selanjutnya adalah memanggil fungsi `sns.barplot` untuk membuat diagram batang, dilanjutkan dengan menambahkan label pada bagian luar batang dan memiringkan *tick* pada sumbu X. Tahap selanjutnya adalah membuat sumbu X baru dengan memanggil fungsi `twinx` dan membuat diagram garis pada sumbu X tersebut menggunakan fungsi `sns.lineplot`. Berbeda dengan `sns.barplot`, pada `sns.lineplot` perlu dilakukan anotasi manual menggunakan fungsi `Axis.text`.

```python
fig, ax = plt.subplots(figsize=(12,6))

sns.barplot(data=df_down_monthly, x="date", y="hours", ax=ax, color='lightsteelblue')
ax.bar_label(ax.containers[-1], fmt='%.2f')
ax.tick_params(axis='x', rotation=45)

ax2 = ax.twinx()
sns.lineplot(data=df_down_monthly, x=ax.get_xticks(), y="cumsum", ax=ax2, color='red', marker='o')
for x, y in zip(ax2.get_xticks(), df_down_monthly["cumsum"]):
    ax2.text(x, y-8, f"{y:.2f}", ha='center', va='bottom', color='red')

plt.title("Durasi Mati Listrik Bulanan")
```

![Grafik durasi mati listrik kumulatif bulanan](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/setahun-pln/downtime_cumulative_monthly_chart.png)

Berdasarkan grafik di atas, kita bisa identifikasi bahwa terdapat dua bulan "musim" mati listrik, yaitu bulan September dan bulan Maret, ditandai dengan durasi mati listrik di atas 20 jam. Ada apa di bulan Maret dan September? Kenapa jadi musim mati listrik?

Grafik yang sama juga menunjukkan bahwa bulan November dan Desember adalah bulan dengan total waktu mati listrik paling pendek. Pendek bukan berarti tidak ada. Artinya, selama satu tahun, PLN PASTI ada mati listrik setidaknya satu kali per bulan. Crazy🤯

### Rasio Durasi dan Banyaknya Mati Listrik

Selain durasi mutlak, kita bisa coba bandingkan rasio antara durasi mati listrik dan berapa banyak mati listrik per bulan. Nilai rasio ini dapat menunjukkan bulan yang "sering mati listrik tapi sebentar" dan "jarang mati tapi sekalinya mati lama"

```python
df_down_ratio = df_sla[["ts_end","downtime"]].copy()
df_down_ratio["date"] = df_down_ratio["ts_end"].dt.strftime("%Y-%m")
df_down_ratio_grouper = df_down_ratio.groupby("date")["downtime"]

df_down_ratio = df_down_ratio_grouper.sum().reset_index()
df_down_ratio["count"] = df_down_ratio_grouper.count().reset_index()["downtime"]
df_down_ratio["ratio"] = (df_down_ratio["downtime"].dt.total_seconds()  / 60 / 60) / df_down_ratio["count"]
df_down_ratio
```

![Tabel rasio durasi dan banyaknya mati listrik](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/setahun-pln/downtime_ratio.png)

```python
fig, ax = plt.subplots(figsize=(12,6))

sns.barplot(data=df_down_ratio, x="date", y="ratio", ax=ax, color='lightsteelblue')
ax.bar_label(ax.containers[-1], fmt='%.2f')
ax.tick_params(axis='x', rotation=45)

ax2 = ax.twinx()
sns.lineplot(data=df_down_ratio, x=ax.get_xticks(), y="count", ax=ax2, color='red', marker='o')
for x, y in zip(ax2.get_xticks(), df_down_ratio["count"]):
  ax2.text(x, y+0.2, f"{y}", ha='center', va='bottom', color='red')

plt.title("Rasio Durasi dan Banyaknya Kejadian Mati Listrik Bulanan")
```

![Grafik rasio durasi dan banyaknya mati listik](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/setahun-pln/downtime_ratio_chart.png)

Pada grafik di atas, terdapat beberapa bulan yang "sering mati listrik dan sekalinya mati listrik, durasinya lama" misalnya September 2023 dan 2024 dengan jumlah kejadian mati listrik lebih dari 10 kali per bulan dan durasi lebih dari 1,8 jam. Jika dilihat pada bulan Agustus 2024, hanya terjadi satu kali mati listrik, tetapi durasinya 3,79 jam.

Mana yang lebih buruk? Sering mati atau sekalinya mati lama?😭

### *Key Statistics* Lainnya

Berikut ini adalah beberapa pertanyaan lain dari penulis mengenai data mati listrik PLN ini.

#### Berapa lama durasi mati listrik paling lama?

```python
row = df_sla.sort_values("downtime", ascending=False).iloc[1, :]
print("Durasi  =", row.downtime)
print("Tanggal =", row.ts_start, "s.d.", row.ts_end)
```

```plain
Durasi  = 0 days 10:18:48.168999912
Tanggal = 2023-09-02 22:20:25+07:00 s.d. 2023-09-10 09:26:25+07:00
```

#### Berapa lama durasi listrik menyala paling lama?

```python
row = df_sla.sort_values("uptime", ascending=False).iloc[1, :]
print("Durasi  =", row.uptime)
print("Tanggal =", row.ts_start, "s.d.", row.ts_end)
```

```plain
Durasi  = 22 days 17:02:30
Tanggal = 2023-12-24 16:25:29+07:00 s.d. 2024-01-16 09:27:59+07:00
```

#### Berapa rata-rata dan median mati listrik?

```python
print("Rata-rata =", df_sla["downtime"].mean())
print("Median    =", df_sla["downtime"].median())
```

```plain
Rata-rata = 0 days 01:24:43.079209875
Median    = 0 days 00:19:30
```

#### Berapa kali rata-rata terjadi mati listrik?

```python
print("Rata-rata mati listrik per bulan =", df_sla.shape[0] / 30)
print("Rata-rata mati listrik per tahun =", df_sla.shape[0] / 365)
```

```plain
Rata-rata mati listrik per bulan = 2.7
Rata-rata mati listrik per tahun = 0.2219178082191781
```

Menurut kalian, apa wajar kalau listrik PLN mati 3x per bulan?😭 Atau apa wajar PLN paling lama nyala itu hanya 22 hari, setelah itu mati listrik lagi?

## Penutup

Berdasarkan beberapa hasil analisis di atas, dapat kita ambil simpulan kalau layanan PLN khususnya di daerah pegunungan yang jauh dari pusat kota. Dengan rekor 81 kali mati listrik dalam kurun waktu satu tahun, semoga kedepannya PLN bisa meningkatkan layanannya agar lebih reliabel dan bisa diandalkan oleh pelanggannya,

Apalagi jika Indonesia akan bergerak mengadopsi mobil listrik (EV), maka transisi tersebut harus didukung dengan ketersediaan listrik yang memadai, bukan hanya untuk keperluan sehari-hari, tetapi juga dapat memenuhi kebutuhan untuk kendaraan listrik [2].

## Referensi

1. “What is an SLA? Best practices for service-level agreements,” CIO. Diakses: 15 Oktober 2024. [Daring]. Tersedia pada: https://www.cio.com/article/274740/outsourcing-sla-definitions-and-solutions.html
2. Perusahaan Listrik Negara, “300 Home Charging Menyala Serentak di Jakarta, PLN Mudahkan Pengguna Mobil Listrik,” Press Release 116.PR/STH.00.01/III/2024, Apr 2024. Diakses: 15 Oktober 2024. [Daring]. Tersedia pada: https://web.pln.co.id/media/siaran-pers/2024/04/300-home-charging-menyala-serentak-di-jakarta-pln-mudahkan-pengguna-mobil-listrik
