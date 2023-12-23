---
title: 'Indihome Suck🙁 Kualitas Internet Semakin Rendah'
categories: Internet
tags: [internet, data mining]
series: [Ritsu-Pi Home Server]
date: 2023-05-15
slug: indihome-suck-kualitas-internet-semakin-rendah
mathjax: true
mermaid: true
---

<div class="flex justify-center">
{{< button content="Akses Jupyter Notebook" icon="logos:jupyter" href="https://l.kodesiana.com/indihome-suck-jupyter" >}}
</div>

Indihome, salah satu ISP yang memiliki *coverage* paling luas di Indonesia dari Telkom Indonesia dan juga tempat kerja penulis saat ini😃. Ceritanya, penulis sudah menggunakan layanan Indihome sejak 2020. Indihome juga merupakan ISP pertama yang tersedia di daerah rumah penulis karena lokasi rumah penulis yang berada di gunung sehingga sulit akses internet baik melalui layanan GSM maupun *broadband*.

Pada tahun awal penggunaan Indihome, penulis sangat puas dengan layanan Indihome. Koneksi selalu bagus, *ping* rendah, dan tidak pernah ada gangguan.

Tapi sayang, tidak semua yang indah akan kekal selamanya☹️

Sejak tahun lalu, penulis merasa sepertinya koneksi internet lebih lambat daripada biasanya, dan pada April 2021 lalu penulis melakukan *upgrade* kecepatan internet dari 20 Mbps ke 30 Mbps. Dengan *upgrade* ini tentunya penulis kembali ke rutinitas dengan koneksi internet yang lebih stabil dan lancar.

Tapi, sejak awal tahun 2023 ini, lagi-lagi koneksi Indihome di rumah penulis terasa tidak optimal, tapi sebelum penulis meminta *upgrade* lagi ke plasa Telkom, penulis ingin cari tahu, apakah benar koneksi Indihome semakin hari semakin lambat atau hanya perasaan penulis saja?

> SPOILER ALERT! Artikel ini merupakan artikel pembuka untuk seri **Ristu-Pi Home Server**. *Stay tuned* untuk melihat kelanjutan dari proyek *home server* penulis ya!

## Apa Iya Indihome Lambat?

Untuk menjawab pertanyaan ini, penulis akan menggunakan metode sains dan uji statistik untuk membuktikan apakah koneksi internet Indihome lebih lambat dari biasanya atau koneksi lambat ini hanya perasaan penulis saja?

Seperti semua jenis penelitian, kita mulai dengan mendefinisikan rumusan masalah. Catatan: untuk mempermudah proses penelitian, penulis akan menguji hanya kecepatan unduh/*download* saja.

**Apakah terdapat perbedaan yang signifikan antara kecepatan unduh Indihome di rumah penulis dibandingkan dengan harga layanan Indihome 30 Mbps?**

$$
H_0: \mu = 30\newline
H_1: \mu \neq 30
$$

Berdasarkan rumusan masalah, dapat diambil hipotesis nol (H0) bahwa tidak ada perbedaan yang signifikan antara kecepatan unduh Indihome di rumah penulis dan langganan 30 Mbps dan hipotesis alternatif (H1) bahwa terdapat perbedaan yang signifikan antara kecepatan unduh Indihome di rumah penulis dan langganan 30 Mbps.

### Akuisisi Data

Untuk menjawab hipotesis penelitian, kita perlu mengumpulkan data. Nah kebetulan sejak awal bulan Mei ini, penulis sedang membangun *home server* dengan nama **Ritsu-Pi** dan untuk melakukan akuisisi data ini, penulis akan menggunakan Prometheus untuk melakukan *speed test* setiap jam per harinya. Konsep sistem yang penulis gunakan adalah sebagai berikut.

{{< mermaid >}}
graph LR
    A[Mikrotik MKTXP Exporter] --> C[Prometheus]
    B[Speedtest.net Exporter] --> C[Prometheus]
    C -->D[Grafana]
{{< /mermaid >}}

Melalui sistem yang sudah dibuat penulis, kita bisa mengumpulkan data kecepatan internet per jam per hari yang berarti 24 observasi per hari. Pada penelitian ini penulis mengumpulkan data sejak 01 Mei 2023 s.d. 14 Mei 2023 atau selama dua pekan.

Untuk melihat data secara *real-time*, penulis menggunakan Grafana untuk menampilkan visualisasi data dari Prometheus.

![Visualisasi data Prometheus menggunakan Grafana](https://blob.kodesiana.com/kodesiana-public-assets/posts/2023/indihome-suck/grafana_viscomp.png)

Nah dari grafik ini, sekilas kita bisa lihat kalau rata-rata kecepatan unduh Indohome ini sebesar 22,2 Mbps. Sudah terlihat kurang dari langganan Indihome penulis sebesar 30 Mbps. Untuk mempermudah mengambil data dari Prometheus, penulis menggunakan kode Python berikut.

```python
import requests
import pandas as pd

BASE_URL = "http://10.20.20.102:8005"
TIME_RANGE = "30d"

def load_metrics(metric_name: str, range: str):
    # load from prometheus API
    url = f"{BASE_URL}/api/v1/query?query={metric_name}[{range}]"
    response = requests.get(url)
    if response.status_code != 200:
        return None

    # load into pandas dataframe
    data = response.json()['data']['result'][0]['values']
    df = pd.DataFrame(data, columns=['timestamp', 'value'])

    # parse datetime
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit='s', utc=True)
    df["value"] = df["value"].astype(float)
    df = df.assign(name=metric_name)

    return df
```

Setelah kita punya fungsi untuk mengunduh data dari Prometheus, tahap selanjutnya adalah mengunduh data tersebut menjadi `DataFrame`.

```python
# download from prometheus
download_speed = load_metrics('speedtest_download_bits_per_second', TIME_RANGE)
upload_speed   = load_metrics('speedtest_upload_bits_per_second', TIME_RANGE)

# create single dataframe
df = pd.concat([download_speed, upload_speed])

df.head()
```

Tabel sampel data Prometheus.

|              timestamp              |    value   |                 name               |
|-------------------------------------|------------|------------------------------------|
| 2023-05-01 04:40:46.320000+00:00    | 24199472.0 | speedtest_download_bits_per_second |
| 2023-05-01 05:40:46.321000192+00:00 | 22518976.0 | speedtest_download_bits_per_second |
| 2023-05-01 06:40:46.321000192+00:00 | 24287568.0 | speedtest_download_bits_per_second |
| 2023-05-01 07:40:46.321000192+00:00 | 24375656.0 | speedtest_download_bits_per_second |
| 2023-05-01 08:40:46.321000192+00:00 | 23379304.0 | speedtest_download_bits_per_second |

<div class="flex justify-center">
{{< button content="Download Dataset RAW" icon="tabler:download" href="https://l.kodesiana.com/2023-1-indihome_raw.csv" >}}
</div>

Tahap selanjutnya adalah kita perlu melakukan *preprocessing* untuk memperbaiki tipe data dan struktur data.

```python
# convert to Jakarta timezone
df["timestamp"] = df["timestamp"].dt.tz_convert('Asia/Jakarta')
df["timestamp"] = pd.to_datetime(df["timestamp"].dt.strftime('%Y-%m-%d %H:00'))

# convert bps to Mbps
df["value"] = df["value"] / 1000000

# limit to 2023-05-14
df = df[df["timestamp"] < "2023-05-15"]
```

Proses yang kita lakukan menggunakan kode di atas adalah sebagai berikut.

1. Mengonversi waktu pada kolom `timestamp` dari zona waktu UTC ke zona waktu Jakarta
2. Mengonversi satuan bps menjadi Mbps
3. Memfilter data ke dua pekan lalu

Sampai di sini, data yang kita miliki sudah bisa diproses untuk melakukan analisis. Tahap selanjutnya adalah kita akan melakukan visualisasi data untuk mendapatkan gambaran data yang kita miliki.

### Visualisasi Data

Sebelum kita lanjut dengan analisis statistik, kita perlu mengimpor *library* `matplotlib`.

```python
import matplotlib.pyplot as plt
```

Pada data mentah yang kita punya, terdapat tiga kolom yaitu *timestamp*, *name*, dan *value*. Untuk meringkas data tersebut agar lebih mudah dipahami, kita bisa melakukan peringkasan data menggunakan **pivot table**.

```python
df.pivot_table(index='timestamp', columns='name', values='value', margins=True)
```

Tabel sampel dataset kecepatan internet Indihome.

|   Tanggal, Waktu    | Unduh (Mbps) | Unggah (Mbps) |
|---------------------|--------------|---------------|
| 2023-05-01 11:00:00 | 24.199472    | 10.272168     |
| 2023-05-01 12:00:00 | 22.518976    | 10.386192     |
| 2023-05-01 13:00:00 | 24.287568    | 10.304112     |
| 2023-05-01 14:00:00 | 24.375656    | 10.465504     |
| 2023-05-01 15:00:00 | 23.379304    | 10.662784     |

Nah, lebih mudah dibaca kan? Dari tabel ini bisa kita lihat perubahan kecepatan internet Indihome sejak awal Mei s.d. tanggal 14 Mei 2023.

Agar lebih intutif, kita bisa memvisualisasikan data ini sebagai grafik menggunakan `matplotlib`.

```python
fig, ax = plt.subplots()
df.pivot_table(index='timestamp', columns='name', values='value').plot(title="Hourly internet speed", ax=ax)

ax.set_ylabel("Mbps")
ax.set_xlabel("Date")
ax.set_ylim(bottom=0)
plt.show()
```

![Kecepatan Indihome per jam](https://blob.kodesiana.com/kodesiana-public-assets/posts/2023/indihome-suck/hourlycomp.png)

Woww, ternyata sering gangguan😂. Tapi ingat ini adalah data per jam, mungkin kebetulan saja koneksi internet penulis sedang gangguan atau terputus. Karena kecepatan internet per jam juga tidak begitu representatif untuk menggambarkan secara umum kecepatan internet Indihome, sekali lagi kita akan meringkas data dengan melakukan *resampling* data dengan cara merata-ratakan kecepatan internet dari per jam menjadi per hari.

```python
# drop zeros
df_temp = df.copy()
df_temp = df_temp[df_temp["value"] > 0.0]

# create pivot table
df_pivot = df_temp.pivot_table(index='timestamp', columns='name', values='value').reset_index()
df_pivot = df_pivot.set_index('timestamp')

# rename columns
df_pivot = df_pivot.rename(columns={"speedtest_download_bits_per_second": "download_mbps", "speedtest_upload_bits_per_second": "upload_mbps"})

# resample to daily
df_pivot = df_pivot.resample('D').mean()

df_pivot.head()
```

Tabel kecepatan internet Indihome per hari.

|  timestamp | download_mbps | upload_mbps |
|------------|---------------|-------------|
| 2023-05-01 | 22.99         | 10.39       |
| 2023-05-02 | 23.49         | 10.38       |
| 2023-05-03 | 24.07         | 10.47       |
| 2023-05-04 | 23.79         | 10.45       |
| 2023-05-05 | 24.12         | 10.51       |

<div class="flex justify-center">
{{< button content="Download Dataset Harian" icon="tabler:download" href="https://l.kodesiana.com/2023-1-indihome_daily.csv" >}}
</div>

Setelah kita memiliki data kecepatan internet harian, kita bisa melakukan visualisasi data kembali.

```python
fig, ax = plt.subplots()
df_pivot.plot(title="Daily internet speed", ax=ax)

ax.set_ylabel("Mbps")
ax.set_xlabel("Date")
ax.set_ylim(bottom=0)
plt.show()
```

![Kecepatan Indihome per hari](https://blob.kodesiana.com/kodesiana-public-assets/posts/2023/indihome-suck/dailycomp.png)

Dari visualisasi ini kita bisa lihat bahwa semakin hari kecepatan unduh Indihome semakin turun😓. Apakah ini hanya kebetulan atau sedang gangguan sementara?

### Uji Statistik (*Null Hyphotesis Significance Testing*)

Untuk menguji apakah penenurunan kecepatan unduh Indihome selama dua pekan ini memiliki signifikansi yang tinggi atau tidak, kita akan melakukan uji statistik klasik.

Pada penelitian ini kita akan menggunakan metode uji menggunakan metode *one sample T-test* [2]. Secara umum, *t-statistic* dapat didefinisikan sebagai berikut.

$$
t=\frac{\bar{x}-\mu}{s/\sqrt{n}}
$$

Sebelum menghitung nilai *t-statistic*, kita perlu tahu rata-rata sampel \\(\bar{x}\\), rata-rata populasi \\(\mu\\), standar deviasi \\(s\\), dan banyaknya sampel  \\(n\\). Kita bisa menggunakan fungsi `describe` pada `DataFrame` untuk mendapatkan informasi tersebut.

```python
df_pivot.describe()
```

Tabel statistik deskriptif.

| name  | download_mbps | upload_mbps
|-------|---------------|------------|
| count |     14.00     | 14.00      |
| mean  |     21.50     | 10.37      |
| std   |     2.95      | 0.08       |
| min   |     14.48     | 10.15      |
| 25%   |     20.74     | 10.35      |
| 50%   |     22.81     | 10.39      |
| 75%   |     23.45     | 10.41      |
| max   |     24.12     | 10.51      |

Berdasarkan data pada tabel di atas, dapat dihitung nilai *t-statistic* sebagai berikut.

$$
\begin{align*}
\nonumber
t &= \frac{\bar{x}-\mu}{s/\sqrt{n}} \\
  &= \frac{21,50517-30}{2,954165/\sqrt{14}} \\
  &= -10,7593
\end{align*}
$$

Kita juga bisa menggunakan fungsi dari *library* `scipy` untuk menghitung nilai *t-statistic* sebagai berikut.

```python
h1_mean = 30
samples = df_pivot['download_mbps'].values
tstat = stats.ttest_1samp(samples, popmean=h1_mean, alternative="two-sided")

print(f"Mean: {samples.mean():.4f}")
print(f"Standard deviation: {samples.std():.4f}")
print(f"Sample size: {len(samples)}")
print(f"Mean difference: {samples.mean() - h1_mean:.4f}")
print("")
print(f"p-value: {tstat.pvalue:.4f}")
print(f"t-statistic: {tstat.statistic:.4f}")
print(f"df: {tstat.df}")
print(tstat.confidence_interval(0.95))
```

```
Mean: 21.5052
Standard deviation: 2.8467
Sample size: 14
Mean difference: -8.4948

p-value: 0.0000
t-statistic: -10.7593
df: 13
ConfidenceInterval(low=19.79948165148948, high=23.21085036715489)
```

Berdasarkan tabel T [1], dapat diambil nilai kritikal \\(t_{(df=13,\alpha=0,05)}=2,106\\). Karena \\(t_{hitung} < t_{tabel}\\), maka **H0 ditolak**. Kesimpulan yang sama juga bisa kita peroleh dari *p-value* yang terdapat pada hasil output kode di atas, karena *p-value < 0,05* maka **H0 ditolak**.

Jadi, sudah terbukti bahwa terdapat perbedaan yang signifikan antara kecepatan unduh Indihome di rumah penulis tidak sesuai dengan langganan seharusnya 30 Mbps. Selain itu, karena sampel data ini diambil selama dua pekan terakhir, kejadian ini bukanlah gangguan sementara karena kalau sudah dua minggu lemot berarti bukan kasus "sementara" 😂

### Kerugian

Penulis menggunakan layanan Indihome 2P (tapi hanya pakai internet-nya saja) 30 Mbps seharga Rp366.000 per bulan. Kalau kita hitung berdasarkan selisih rata-rata dari sampel data di atas, maka *seharusnya* biaya langganan per bulan penulis bisa berkurang sebesar:

$$
\begin{aligned}
Rugi &= 366.000 - \left(\frac{366.000}{30} \times 21.50517 \right) \\
     &= Rp103.721,92
\end{aligned}
$$

Lumayan juga ya kelebihan bayar ~100 ribu per bulan (**28,32%**)😂

### Silly Statistics: Linear Regression

Sekarang kita akan masuk ke bagian iseng😂

Statistika merupakan ilmu yang sangat luas dan jika diterapkan dengan benar, dapat menjawab berbagai pertanyaan dan memberikan kita *insight* untuk membantu dalam proses pengambilan keputusan. **Tapi bagaimana jadinya kalau statistika kita gunakan untuk menjawab pertanyaan yang salah?**

Sekarang kita akan coba untuk menggunakan salah satu metode statistik, yaitu **regresi linier** untuk memprediksi kecepatan unduh Indihome di bulan yang akan datang. Apakah kecepatannya akan turun atau akan naik?

Bentuk umum model regresi linier dua variabel (bivariat) adalah sebagai berikut.

$$
y = mx + c
$$

> Catatan! Apa yang akan penulis sampaikan di bawah ini merupakan implementasi regersi linier yang salah, karena penulis tidak melakukan uji homogenitas dan uji linieritas yang merupakan prasyarat analisis linier Pearson.

Dengan menggunakan *library* `statsmodels`, kita akan melakukan analisis korelasi Pearson antara variabel `timestamp` (hari) dan `download_mbps` (kecepatan unduh).

```python
from datetime import datetime
import seaborn as sns
import statsmodels.formula.api as smf

df_reg = df_pivot.copy().reset_index()
largest_diff = (pd.to_datetime(datetime.now()) - df_reg["timestamp"]).dt.days.max()

df_reg["timestamp"] = pd.to_datetime(datetime.now()) - df_reg["timestamp"]
df_reg["timestamp"] = largest_diff - df_reg["timestamp"].dt.days

results = smf.ols('download_mbps ~ timestamp', data=df_reg).fit()
print(results.summary())
```

Pada kode di atas kita mengonversi kolom `timestamp` dari tanggal menjadi hari, yang berarti tanggal 01-05-2023 berubah menjadi 1 dan seterusnya. Setelah itu, kita aken menggunakan model *Ordinary Least Squares (OLS)* untuk melakukan analisis regresi linier.

```
                            OLS Regression Results
==============================================================================
Dep. Variable:          download_mbps   R-squared:                       0.481
Model:                            OLS   Adj. R-squared:                  0.438
Method:                 Least Squares   F-statistic:                     11.14
Date:                Mon, 15 May 2023   Prob (F-statistic):            0.00592
Time:                        12:31:52   Log-Likelihood:                -29.915
No. Observations:                  14   AIC:                             63.83
Df Residuals:                      12   BIC:                             65.11
Df Model:                           1
Covariance Type:            nonrobust
==============================================================================
                 coef    std err          t      P>|t|      [0.025      0.975]
------------------------------------------------------------------------------
Intercept     24.6899      1.123     21.988      0.000      22.243      27.136
timestamp     -0.4900      0.147     -3.337      0.006      -0.810      -0.170
==============================================================================
Omnibus:                       11.614   Durbin-Watson:                   1.714
Prob(Omnibus):                  0.003   Jarque-Bera (JB):                7.333
Skew:                          -1.502   Prob(JB):                       0.0256
Kurtosis:                       4.883   Cond. No.                         14.7
==============================================================================
```

Berdasarkan hasil analisis di atas, dapat dilihat bahwa *Intercept* (konstanta) pada model regresi memiliki *p-value* yang signifikan, sedangkan variabel *timestamp* memiliki *p-value* yang tidak signifikan. Artinya, variabel waktu kemungkinan besar tidak berpengaruh besar pada hasil prediksi, melainkan nilai galat (*Intercept*) yang memiliki pengaruh paling besar pada hasil regresi.

Berdasarkan output di atas, model regresi linier kita adalah:

$$
download mbps = 24,6899 - 0,49 \times timestamp
$$

Dari hasil regresi ini saja sudah terlihat bahwa model yang dibuat sudah tidak bagus😂 meskipun kita belum melakukan uji homogenitas dan uji linieritas.

Analisis regresi tidak lengkap kalau kita tidak membuat diagram pencar dengan garis regresi, maka dari itu kita akan membuat diagram pencar beserta garis regresinya menggunakan *library* `seaborn`.

```python
sns.regplot(x="timestamp", y="download_mbps", data=df_reg)
plt.show()
```

![Garis regresi](https://blob.kodesiana.com/kodesiana-public-assets/posts/2023/indihome-suck/regressioncomp.png)

Nah, berdasarkan tren pada grafik di atas, dapat disimpulkan bahwa secara umum, kecepatan internet Indihome setiap harinya cenderung turun! Wahh...

Sekarang kita coba untuk melakukan prediksi menggunakan model yang sudah kita buat untuk 5 bulan ke depan.

```python
max_days = df_reg["timestamp"].max() - 30
df_pred = pd.DataFrame({"timestamp": [x for x in range(max_days, 30*5)]})
df_pred = df_pred.assign(predicted=results.predict(df_pred))

df_all = pd.concat([
  df_reg.drop(columns=["upload_mbps"]).rename(columns={"timestamp": "days", "download_mbps": "value"}),
  df_pred.rename(columns={"timestamp": "days", "predicted": "value"})
])

first_date = pd.to_datetime(datetime.now()) - pd.Timedelta(days=largest_diff)
df_all["date"] = df_all["days"].apply(lambda d: pd.Timedelta(days=int(d)) + first_date)

df_all.resample("M", on="date").mean().drop(columns=["days"])
```

Tabel prediksi kecepatan unduh Indihome lima bulan yang akan datang.

|    date    | value   |
|------------|---------|
| 2023-04-30 | 29,099  |
| 2023-05-31 | 18,636  |
| 2023-06-30 | 2,396   |
| 2023-07-31 | -12.547 |
| 2023-08-31 | -27.735 |
| 2023-09-30 | -41,944 |

Menurut hasil prediksi, bulan depan rata-rata kecepatan unduh Indihome akan menjadi 2,396 Mbps dan di bulan depannya akan menjadi -12,547 Mbps alias hanya unggah/*upload* saja😂.

![Youtube GIF By Shane Dawson](https://media.giphy.com/media/2zcXkGVxqn1Vn6izEN/giphy.gif)

Tentu hasil prediksi ini salah karena alasan yang sudah penulis sebutkan sebelumnya, tapi hasil ini lucu jika ini benar terjadi. Tentunya tidak akan terjadi kan ya? Ya kan?😂

## Simpulan

Simpulan utama yang bisa diambil: **Indihome suck.**

![Sad money](https://media.giphy.com/media/XOys8CeUrElIk/giphy.gif)

Indihome sebagai salah satu penyedia layanan internet terluas di Indonesia, seharusnya bisa menyediakan layanan internet yang reliabel dan stabil bagi seluruh pelanggannya. Penulis akan mencoba mengubungi kembali CS Indihome untuk komplain mengenai kecepatan internet ini, semoga bisa terselesaikan😊.

Selain itu, beberapa hal yang bisa kita ambil dari penelitian kecil ini adalah:

* Uji hipotesis menggunakan metode *one sample t-test* dapat dilakukan dengan mudah untuk menjawab pertanyaan yang berhubungan dengan membandingan dua rata-rata
* Proses analisis dapat dilakukan dengan lebih mudah menggunakan bantuan pemrograman Python
* Tidak semua model statistik dapat langsung digunakan untuk semua studi kasus, misalnya analisis korelasi Pearson membutuhkan asumsi data terdistribusi secara homogen dan linier tetapi pada penelitian ini dua asumsi tersebut tidak terpenuhi, sehingga menghasilkan analisis yang salah

Terima kasih semuanya! Sampai jumpa di artikel lainnya.

## Referensi

1. Gerstman, B. Burt. 2003. StatPrimer t Table (https://www.sjsu.edu/faculty/gerstman/StatPrimer/t-table.pdf). Diakses 15 Mei 2023.
2. JMP Statistical Discovery. 2023. The One-Sample t-Test (https://www.jmp.com/en_sg/statistics-knowledge-portal/t-test/one-sample-t-test.html). Diakses 15 Mei 2023.
