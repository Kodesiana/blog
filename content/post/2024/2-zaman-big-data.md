---
title: "Zaman Big Data, tapi Susah Cari Data😔"
categories: Data Science
tags: [big data, data science, data mining, dataset]
date: 2024-01-15
---

**Big data**, salah satu istilah yang sudah sangat sering kita dengar dan menjadi tren beberapa tahun ke belakang ini. Big data secara umum dapat didefinisikan data yang lebih besar dan kompleks dibandingkan data pada umumnya dan berasal dari sumber-sumber baru. Karena ukurannya yang sangat besar teknologi pemprosesan data tradisional tidak bisa digunakan untuk mengolahnya tetapi data tersebut memiliki nilai yang terpendam dan apabila bisa dimanfaatkan, akan menghasilkan *insight* yang sangat bernilai [1].

Berbagai sektor sekarang ini sudah menafaatkan *big data* sebagai dasar pengambilan keputusan seperti untuk mengoptimalkan *marketing*, meningkatkan *revenue*, analisis *churn*, dan berbagai aplikasi lain yang salah satunya kita juga sudah sangat familiar, pengembangan *large language models (LLM)* seperti ChatGPT.

Sebagian besar pemanfaatakn *big data* dilakukan oleh perusahaan-perusahaan besar seperti Google, Microsoft, dan META karena mereka mempunyai basis data yang sangat besar mulai dari indeks sebagian besar laman di internet dan data media sosial yang bisa digunakan untuk diolah. Untuk dapat mengolah data yang masif tersebut, perusahaan-perusahaan ini menggunakan pendekatan *machine learning* dan pemprosesan terdistribusi untuk dapat mengekstrak *insight* dari dalam data.

Penulis juga merupakan peneliti yang berfokus sektor pada *machine learning* dan tentunya sangat membutuhkan akses ke data dan juga server komputasi yang cukup untuk dapat mengolah dan menganalisis data.

Tetapi pada kenyatannya, meskipun kita sekarang hidup di zaman *big data*, tidak mudah bagi kita untuk bisa mendapatkan data.

Kenapa?

## 5️⃣ V's of Big Data

Sebelum kita membahas mengenai masalah dengan *big data*, kita perlu tau karakteristik dari *big data*. Secara umum *big data* memiliki lima karakteristik [2], yaitu:

- **Volume**, ukuran dan banyaknya data untuk disimpan dan dianalisis
- **Value**, nilai yang dapat dihasilkan dari analisis data berupa pola atau *insight*
- **Variety**, diversitas atau varietas data seperti data terstruktur (tabel), semi-terstruktur (teks), dan tidak terstruktur (audio, video)
- **Velocity**, seberapa cepat aliran data mulai dari sumber hingga penyimpanan dan manajemennya
- **Veracity**, akurasi atau validitas data

Dari kelima karakteristik ini, masing-masing memiliki masalahnya sendiri, tetapi pada artikel ini penulis ingin berbagi mengenai pengalaman penulis mencari data untuk penelitian tesis penulis (penulis akan kolokium di semester ini!). Bicara mengenai data, penulis saat ini membutuhkan akses ke data spasial Indonesia yaitu data batas wilayah Indonesia. Ide awal penelitian penulis adalah analisis data spasial temporal di tingkat kecamatan dan salah satu sumber data yang menjadi referensi penulis adalah Badan Pusat Statistik dan Badan Informasi Geospasial [(Ina-Geoportal)](https://tanahair.indonesia.go.id/portal-web).

## Sumber Data📥

Sebagai *background*, penulis biasanya mendapatkan data dari portal seperti NASA (National Aeronautics and Space Administration) dan ESA (European Space Agency) dan penulis bisa mengakses semua data yang penulis butuhkan seperti peta muka bumi, evelasi, DEM, NDVI, dan lain-lain dengan hanya mendaftar akun saja. Tetapi ternyata kalau di BIG dan BPS, selain harus daftar kita juga harus beli😨

![harga data BPS](https://blob.kodesiana.com/kodesiana-public-assets/posts/2024/zaman-big-data/harga%20data%20bps_comp.jpg)

> Sumber: Penulis

Data is the new oil.

Ternyata data mahal juga ya harga data ini😓 Biasanya data bisa diakses dengan mudah melalui *platform* seperti Kaggle, UCI Machine Learning Repository, ESA, NASA, dan portal lainnya, sekarang penulis harus bayar untuk satu data ini.

Data itu mahal.

Karena untuk dapat mengumpulkan data tersebut, penulis yakin petugas BPS harus datang ke lapangan melakukan survei dan wawancara untuk mendapatkan data yang akurat dan semuanya pasti membutuhkan biaya. Tetapi jika dibandingkan dengan negara lain yang bisa memberikan akses ke data dalam jumlah masif dan gratis, sangat disayangkan di Indonesia belum bisa dilakukan. Padahal akses ke data yang akurat dan tersedia merupakan landasan penelitian yang memiliki dampak terhadap masyarakat.

Tapi tenang teman-teman, sumber data tidak hanya dari BPS dan BIG saja! Masih ada banyak sumber data lain [3] lho.

### Media Sosial

Media sosial merupakan salah satu sumber data yang sangat penting khususnya dalam riset opini masyarakat (*sentiment analysis*). Biasanya sumber data ini bisa kita dapat dari *scraping* data dari Twitter dan Facebook. Tapi sayangnya, sejak tahun lalu Twitter sudah mengubah model penggunaan API-nya menjadi berbayar juga. Tapi tenang, kita masih bisa melakukan *scraping* data yang terbatas untuk kebutuhan akademik.

### Cloud Services

*Cloud services* merujuk pada jasa penyedia layanan *cloud* seperti Microsoft, Google, dan Amazon sebagai penyedia data. Apa teman-teman tahu kalau Microsoft, Google, dan Amazon memiliki koleksi data terbuka yang bisa kita akses?

- [Google Dataset Search](https://datasetsearch.research.google.com/)
- [Google Earth Engine](https://earthengine.google.com/)
- [Azure Open Datasets](https://learn.microsoft.com/en-us/azure/open-datasets/dataset-catalog)
- [Azure Planetary Computer](https://planetarycomputer.microsoft.com/)
- [Registry of Open Data on AWS](https://registry.opendata.aws/)

Keuntungan dari penggunaan data dari portal di atas adalah sebagian besar data yang disediakan biasanya sudah diverifikasi dan memiliki DOI sehingga bisa kita gunakan sebagai data sekunder untuk penelitian. Selain kelima layanan tersebut, kita juga bisa mendapatkan banyak data lain dari portal berikut.

- [NASA Earth Data](https://earthdata.nasa.gov/)
- [ESA Copernicus Open Access Hub](https://scihub.copernicus.eu/)
- [National Library of Medicine](https://www.ncbi.nlm.nih.gov/)
- [Global Biodiversity Information Facility GBIF](https://www.gbif.org/)
- [iNaturalist](https://www.inaturalist.org/)
- [UCI Machine Learning Repository](https://archive.ics.uci.edu/)
- [data.world](https://data.world/datasets/free)
- [Kaggle](https://www.kaggle.com/)

Berbagai data dari portal di atas bisa kita gunakan juga untuk keperluan penelitian, tetapi perlu diingat data dari Kaggle perlu diverifikasi sumber dan bagaimana proses penyajian datanya karena Kaggle sifatnya terbuka dan semua orang bisa mengunggah datanya.

### Web Scraping

Jika variasi data yang kita butuhkan masih kurang atau kita perlu data seperti portal berita, maka *web scraping* adalah jawabannya. Konsep dari *web scraping* ini sama seperti cara kerja mesin pencari seperti Google ketika akan mengindeks suatu laman/*website*.

Pertama kita akan mengunjungi suatu laman, misal kompas.com, kemudian kita akan menemukan tautan-tautan ke berbagai berita, selanjutnya kita akan buka salah satu berita tersebut, kita simpan judul dan isinya, kemudian lanjut dengan berita lainnya sampai berhenti. Dengan demikian kita bisa mendapatkan konten suatu *website* dengan cepat tanpa perlu melakukan proses pencarian secara manual.

Terdapat dua *library* yang menurut penulis sangat *powerful* adalah Scrapy dan Selenium. Jika kita ingin melakukan *scraping* pada *website biasa* (*server-side rendered/SSR*) seperti portal berita dan sebagian besar laman *website* pada umumnya, kita bisa menggunakan Scrapy. Tetapi jika tidak berhasil (misalnya laman tersebut menggunakan *client-side rendering/CSR*) maka kita perlu menggunakan Selenium. Perbedaan utama antara kedua solusi ini adalah Selenium menggunakan *headless browser* sedangkan Scrapy hanya menggunakan *HTTP request* biasa, sehingga Selenium lebih *powerful* untuk melakukan *scraping* segala jenis *website* tetapi membutuhkan lebih banyak sumber daya.

### Internet of Things (IoT)

Perangkat berbasis *Internet of Things (IoT)* sekarang juga mengalami *booming* dan bisa kita temukan di mana-mana. Mulai dari lampu, soket listrik, dan TV, semua perangkat tersebut bisa terhubung dengan internet untuk memudahkan kita melakukan otomasi dan perekaman data.

Teman-teman mungkin familiar dengan Google Home, Alexa, Phillips Hue, Bardi, TP-Link Tapo, dan berbagai *brand* lain yang memiliki perangkat cerdas seperti soket listrik yang mampu mencatat penggunaan energi. Nah alat-alat ini bisa dimanfaatkan sebagai sumber data pada skala kecil hingga masif.

Jika kita perlu untuk mengumpulkan data dengan sensor tertentu, kita bisa membuat sendiri alat IoT dengan menggunakan *platform* Aruduino, ESP, Raspberry Pi, atau solusi lain. Dengan demikian kita bisa mengumpulkan data primer dengan lebih mudah dan murah. Tentunya kita tidak harus membuat alat sendiri, sebagian besar *platform* IoT menyediakan layanan ekspor data sehingga kita bisa analisis sendiri data dari perangkat IoT di rumah.

### Database

Jika teman-teman memiliki suatu sistem misalnya *point of sales* yang memiliki basis data sendiri, data ini bisa juga kita gunakan sebagai sumber data untuk analisis. Data transaksi dan tingkah laku pelanggan yang tercatat dalam sistem ini dapat kita gunakan untuk menganalisis sifat dan metode yang optimal untuk mendorong pelanggan untuk melakukan lebih banyak transaksi di *platform* teman-teman.

Tentunya opsi ini hanya tersedia jika teman-teman memiliki akses ke basis data tersebut ya!

> Jangan malah beli basis data dari Bjorka😂

### Lomba

Pilihan terakhir ini mungkin agak sedikit *unorthodox*. Sering kali kita bisa mendapatkan data dari lomba atau kompetisi. Tahun 2020-2021 merupakan **golden era** bagi penulis karena banyak sekali kegiatan lomba yang diselengarakan secara daring dan kerennya lagi, kebanyakan lomba tersebut berupa lomba analisis data atau *machine learning* dengan tujuan kompetisi untuk membuat model atau visualisasi, yang berarti penulis akan mendapatkan data dari penyelenggara lomba.

- [PhysioNet](https://physionet.org/)
- [EY Open Science Challenge](https://challenge.ey.com/)
- [IEEE CyberC Data Analytics Competition](https://cyberc.org/Program/Competition)
- Sayembara Data BPS
- Healthkathon BPJS

Beberapa kompetisi di atas diselenggarakan tahunan sehingga kita bisa mendapatkan banyak data baru setiap tahunnya. Selain itu kita juga bisa berkompetisi dan mendapatkan banyak pengalaman baru tentunya😂. Dulu penulis pernah ikut Datathon AI yang diselenggarakan oleh Telkom University dan penulis mendapatkan akses ke *spreadsheet* yang berisi monitoring jumlah kasus COVID-19 di Indonesia yang diperbarui per hari. Data ini tentunya sangat berharga karena saat itu COVID-19 menjadi topik penelitian yang paling *trending*. Jika penulis tidak ikut kegiatan tersebut, penulis tidak akan pernah punya akses ke data tersebut.

## Penutup🗃️

Teman-teman sekarang sudah mendapat banyak referensi di mana kita bisa menemukan data untuk penelitian dan analisis. Mulai dari media sosial, layanan *cloud*, *web scraping*, *internet of things (IoT)*, basis data, dan lomba.

Setiap sumber data memiliki domain-nya masing-masing dan memiliki tingkat kepercayaan yang berbeda-beda. Ada yang sudah terverifikasi dan ada juga yang bersifat komunitas. Kita sebagai pengguna data harus bijak dalam memilih sumber data dan memverifikasi keabsahan data sebelum mengambil *insight* dari dalam data untuk mencegah *bias*.

Nah pada artikel yang akan datang penulis akan membahas mengenai bagaimana mengimplementasikan *web scraping* dan analisis datanya.

Stay tuned!

## Referensi📚

1. “What Is Big Data?” Diakses: 5 Januari 2024. [Daring]. Tersedia pada: https://www.oracle.com/sg/big-data/what-is-big-data/
2. “What are the 5 V’s of Big Data? | Teradata.” Diakses: 5 Januari 2024. [Daring]. Tersedia pada: https://www.teradata.com/glossary/what-are-the-5-v-s-of-big-data
3. “Top 5 sources of big data | Artificial Intelligence | Data Science |.” Diakses: 5 Januari 2024. [Daring]. Tersedia pada: https://www.allerin.com/blog/top-5-sources-of-big-data
