---
title: Maraton 4 Lomba Data Science! I'm Top 5 IEEE CS GSC 2021😋
categories: [Life Story]
tags: [tips, programming, kuliah, pengalaman, data science]
date: 2021-10-22
slug: maraton-lomba-data-science-top-5-ieee-cs-gsc
---

Haloo sobat ngampus! Semoga dalam keadaan sehat semua ya. Hari ini penulis mau sharing pengalaman nih, agak berbeda
dengan format blog seperti biasa, tetapi semoga tetap menarik dan bisa menginspirasi ya!

Teman-teman khususnya yang sedang menempuh kuliah, sudah ikut organisasi apa aja nih? Selama kuliah khususnya di tengah
pandemi ini udah ngapain aja? Semoga kita selalu fokus ya kuliah menimba ilmu yang bermanfaat. Nah selain kuliah dan
organisasi, sebagai mahasiswa kita juga perlu melakukan self improvement selain dari kegiatan sehari-hari kita di kampus
agar kita bisa membandingkan skillset kita dengan teman-teman kita di kampus atau masyarakat umum. Kenapa? Karena saat
kita lulus nanti, kita pasti akan terjun ke masyarakat yang tentunya akan memiliki persaingan yang lebih ketat
dibandingkan lingkungan kampus sendiri.

Nah salah satu kegiatan yang bisa kita ikuti adalah kegiatan perlombaan! Khususunya di tengah pandemi ini, banyak event
yang bisa kita sebagai mahasiswa ikuti. Apalagi sebagai mahasiswa ilmu komputer, banyak event perlombaan khususnya
programming dan data science yang sekarang sedang tren.

Pada kesempatan ini penulis ingin sharing pengalaman penulis mengikuti empat kegiatan lomba dalam waktu dua bulan!

## [1 Datathon KA 2021](https://datathon.ai-innovation.id)

Datathon KA merupakan kegiatan yang diselenggarakan oleh BPPT dan Kecerdasan Artifisial Indonesia dan diorganisasi oleh
Telkom University. Lomba ini bertemakan penerapan kecerdasan artifisial (AI) dan pembelajaran mesin (machine learning)
untuk mencari solusi berdasarkan permasalahan dari pandemi COVID-19.

Terdapat dua sesi lomba, yaitu babak penyisihan dengan tema "prediksi kapan PPKM bisa dihentikan saat tingkat vaksinasi
mencapai 50%" dan babak final dengan tema "berapa persen kapasitas ruangan untuk WFO." Data yang digunakan oleh penulis
bersumber dari portal data seperti kawal Covid-19, Google Mobility Index, dan Apple Mobility Index.

{{< unsplash "photo-1518729242175-4ca26a4d355d" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzI4OTY0NzA2fA" "Photo by Tetiana Shevereva on Unsplash" "people crossing on road between buildings during daytime" >}}

Pada kedua penelitian tersebut, peneliti menggunakan pendekatan *data mining* untuk menggali informasi dari data yang
diberikan oleh panitia. Pada penelitian pertama penulis menggunakan metode *exponential smoothing* untuk melakukan
*forecasting* kapan tingkat vaksinasi mencapai 50% berdasarkan tren vaksinasi. Berdasarkan proses *mining*, diprediksi
50% populasi Indonesia akan mendapat vaksinasi penuh dua dosis pada tanggal 11 Maret 2022 dengan *mean* 135.113.897,15
orang penduduk.

Pada penelitian kedua peneliti menggunakan simulasi menggunakan model SIRV (*Susceptible-Infected-Recovered-Vaccinated*)
untuk mensimulasikan bagaimana persebaran virus COVID-19 pada suatu populasi tertutup. Penulis mendapatkan hasil bahwa
dengan memberlakukan aturan WFO kembali dengan asumsi tingkat vaksinasi, tingkat infektivitas virus, dan tingkat
pemulihan korban yang konstan maka tingkat infeksi ditaksir akan berada di bawah 8,63% dari total populasi, sehingga
pelaksanaan WFO bisa dilakukan tanpa restriksi.

Perlu diingat bahwa penelitian yang penulis lakukan belum sempurna dan masih diperlukan banyak kajian dan verifikasi
oleh pakar, karena paper yang penulis tulis belum di-*submit* ke penerbit sehingga belum melalui proses *peer-review*.

Teman-teman bisa mengakses paper dan *source code* yang penulis buat pada penelitian ini pada tautan berikut.

1. [Kapan PPKM Bisa Dihentikan? Studi Mobilitas Masyarakat dan Forecasting Tingkat Vaksinasi menggunakan Model Exponential Smoothing](https://www.researchgate.net/publication/355190613_Simulasi_Infeksi_COVID-19_untuk_Menunjang_Aturan_Work-from-Office_berbasis_Model_SIRV)
2. [Simulasi Infeksi COVID-19 untuk Menunjang Aturan Work-from-Office berbasis Model SIRV](https://www.researchgate.net/publication/355190768_Kapan_PPKM_Bisa_Dihentikan_Studi_Mobilitas_Masyarakat_dan_Forecasting_Tingkat_Vaksinasi_menggunakan_Model_Exponential_Smoothing)
3. [Source code Datathon KA 2021](https://github.com/fahminlb33/datathon-ai-2021)

Tapi sayang sekali, pada *event* ini penulis belum lolos sebagai pemenang. Tapi kesempatan masih terbuka lebar, masih
benyak *event* lain yang menarik untuk diikuti, salah satunya adalah BPJS Hackathon 2021!

## [2 BPJS AI Hackathon 2021](https://healthkathon.bpjs-kesehatan.go.id/)

Sesuai namanya, *event* ini diselenggarakan oleh BPJS dan terbagi menjadi tiga kegiatan, yaitu AI, IOT, dan Pentest.
Penulis tentunya mengikuti lomba AI karena berhubungan dengan data tentunya :D. Nah pada lomba AI BPJS ini peserta
diberikan dua topik yaitu klasifikasi apakah klaim BPJS merupakan *fraud* atau regresi untuk memprediksi jumlah kasus
dan unit cost pada sebuah daerah akibat penambahan rumah sakit kerja sama dengan BPJS.

Pada lomba ini penulis mengambil kategori *fraud detection* karena penulis sudah mencoba melakukan *preliminary
modelling* dan mendapatkan akurasi yang penulis rasa cukup tinggi untuk menjadi submisi lomba. Pada saat submisi,
penulis mendapat posisi terbaik di peringkat 7 dan terakhir kali penulis cek, penulis berada di posisi ke 10.

{{< unsplash "photo-1505751172876-fa1923c5c528" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzI4OTYwOTAzfA" "Photo by Hush Naidoo Jade Photography on Unsplash" "black and gray stethoscope yo01Z" >}}

Sayang sekali pada lomba ini hanya diberikan kesempatan tiga kali untuk melakukan submisi, sehingga penulis juga
mengalami kesulitan untuk mencoba beberapa jenis model dan melakukan *hyperparameter tuning* untuk mendapatkan model
yang terbaik. Akhirnya, penulis tidak lolos ke babak final karena tidak masuk ke dalam tiga besar.

Sayangnya penulis tidak bisa share kode pada *event* ini karena dibatasi oleh persyaratan lomba dan NDE. Masih belum
menang juga, selanjutnya penulis mencoba lomba lain secara paralel yaitu BPS Big Data!

## [3 BPS Big Data 2021](https://bigdata.bps.go.id)

BPS Big Data sesuai dengan namanya merupakan lomba mengenai *big data*, pada kategori umum peserta diminta untuk membuat
*dashboard* yang berisi *official statistics* berdasarkan dataset yang sudah disediakan oleh panitia. Peserta dibebaskan
untuk melakukan pemodelan dan visualisasi menggunakan data yang disediakan untuk mencari insight dari dalam data.

Pada lomba ini penulis membuat tiga dasbor yaitu:

1. Tren Lowongan Pekerjaan + *forecasting* tren lowongan pekerjaan
2. Mobilitas Penduduk
3. Sentimen Berita

Berikut beberapa tampilan dasbor yang penulis buat.

![Dashboard 1](https://blob.kodesiana.com/kodesiana-public-assets/posts/2021/6/loker1.jpg)

![Dashboard 2](https://blob.kodesiana.com/kodesiana-public-assets/posts/2021/6/loker2.jpg)

![Dashboard 3](https://blob.kodesiana.com/kodesiana-public-assets/posts/2021/6/sentimen.jpg)

![Dashboard 4](https://blob.kodesiana.com/kodesiana-public-assets/posts/2021/6/mobilitas.jpg)

Pada proses *forecasting*, penulis menggunakan model **Facebook Prophet** yang merupakan model *time series forecasting*
berbasis *bayesian statistics*. Sayangnya, karena penulis terikat dengan NDE, penulis tidak bisa mempublikasikan paper
dan *source code* yang penulis buat pada lomba ini.

Masih belum nyerah! Penulis sekarang mencoba *step up the game* dengan mengikuti lomba berskala internasional, IEEE
Computer Society Global Student Challenge 2021!

## [4 IEEE Computer Society Global Student Challenge 2021](https://syp.computer.org/gsc)

Nah *event* ini merupakan event yang sedikit berbeda nih dengan beberapa lomba sebelumnya karena lomba ini
diselenggarakan oleh IEEE Computer Science Community. Pada *event* ini penulis harus mengerjakan dua set masalah, yaitu:

1. Prediksi kegagalan sistem komputer berdasarkan data metrik sistem
2. Analisis sentimen multi-label pada *tweet* bertopik COVID-19

*Problem* pertama dibagi lagi menjadi dua bagian, yaitu *model complete* yang mengharuskan penulis untuk membuat model
menggunakan semua data yang tersedia dan *model abridged* yang harus dikerjakan dengan menggunakan reduksi dimensi, pada
kasus ini menggunakan metode *Principal Component Analysis (PCA)*.

Pada *problem* pertama data yang disediakan memiliki distribusi kelas yang sangat tidak seimbang, yaitu hanya 8% data
dengan label positif dan sisanya negatif (hal ini wajar karena pada prediksi kegagalan sistem, tidak mungkin sistem
gagal pada 50% masa kerjanya :D). Untuk menyelesaikan masalah pertama ini penulis menggunakan pendekatan *data mining*
dengan cara menguji beberapa algoritma dasar seperti KNN, *decision tree*, *random forest*, dan model-model lain untuk
menentukan basis model terbaik.

Selanjutnya penulis menggunakan model terbaik berdasarkan data percobaan awal tersebut untuk melakukan *hyperparameter
tuning* menggunakan metode *grid search*.

Pada *problem* kedua, penulis sedikit kewalahan karena penulis belum pernah melakukan *multi-label classification*
apalagi pada dataset berupa teks, karena penulis sendiri jarang melakukan *text mining* atau NLP pada umumnya. Selain
itu, ukuran dataset yang besar juga menjadi tantangan tersendiri karena komputer yang penulis gunakan saat itu tidak
cukup kuat untuk memproses data dalam jumlah besar.

Akhirnya penulis menemukan solusi dengan menggunakan Apache Spark dan Spark NLP untuk melakukan pemodelannya. Meskipun
membutuhkan waktu sekitar 2 jam untuk melakukan satu kali *training* model, hasilnya bisa dibilang cukup memuaskan.

{{< unsplash "photo-1588534510807-86dfb5ed5d5b" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzI4OTY0ODA2fA" "Unsplash" "woman in black and white plaid dress shirt using laptop computer" >}}

Lomba ini diselenggarakan melalui *platform* Kaggle, salah satu *platform* untuk perlombaan dan komunitas *data
science*. Pada saat kompetisi, semua peserta bisa melihat posisinya pada *leaderboard*, penulis sendiri saat itu berada
di posisi tengah, sehingga membuat penulis tidak percaya diri.

Tapi ternyata, pagi hari tanggal 5 September 2021 penulis mendapatkan email bahwa penulis lolos sebagai finalis lima
besar IEEE CS GSC 2021!!

Penulis tentu sangat terkejut karena penulis yang ada di pertengahan *leaderboard* ternyata bisa lolos jadi finalist.
Setelah lolos menjadi finalist, penulis kemudian melaksanakan presentasi dan mengikuti pengumuman pada konferensi *IEEE
IC2E Conference: 9th IEEE International Conference on Cloud Engineering*.

![Pertmuan semua finalis dan pemenang IEEE CS GSC 2021](https://blob.kodesiana.com/kodesiana-public-assets/posts/2021/6/ieee-cs.png "Pertmuan semua finalis dan pemenang IEEE CS GSC 2021")

Ini merupakan salah satu momen yang paling berkesan untuk penulis karena ini pertama kalinya penulis memenangkan lomba
tingkat internasional, meskipun belum bisa mendapat juara 1-3. *Event* ini direncanakan akan diselenggarakan secara
rutin tahunan, jadi buat teman-teman yang ingin mencoba, bisa cek laman resminya di tautan berikut.

https://syp.computer.org/gsc/

Kegiatan ini juga sudah dipublikasikan oleh
[IEEE Computer Science Comunity](https://www.computer.org/publications/tech-news/events/global-student-challenge-competition-2021),
[Portal Berita Universitas Pakuan](https://www.unpak.ac.id/berita/mahasiswa-fmipa-unpak-memenangkan-kompetisi-data-science-ieee),
[Instagram IEEE Student Branch Universitas Pakuan](https://www.instagram.com/p/CUzpFdGlOtf), dan beberapa media sosial
kampus juga, senangnya penulis jadi lebih terkenal di kampus :P.

Nah karena lomba ini tidak ada NDE, teman-teman bisa cek *source code* yang penulis gunakan pada perlombaan ini pada
tautan berikut.

https://github.com/fahminlb33/ieee-gsc-2021

## Penutup🎁

Buat teman-teman khususnya yang masih berkuliah, yuk kita isi waktu senggang selama kuliah kita dengan kegiatan-kegiatan
yang bermanfaat dan bisa menjadi bekal kita untuk *self improvement* dan mempersiapkan diri ke dunia kerja. Memang bukan
sesuatu yang mudah, tapi setidaknya kita harus mau mencoba agar kita bisa tahu bagaimana persaingan di luar sana.

*In the end*, penulis sendiri merasa mengikuti empat lomba dalam waktu yang sama bukanlah sesuatu yang baik karena
jujur, penulis sangat *exhausted* setelah *event-event* tersebut karena penulis harus pintar-pintar membagi waktu untuk
bukan hanya empat lomba, tapi juga pekerjaan dan kuliah.

*So, keep trying* ya teman-teman! Yuk kita coba sedikit demi sedikit, tidak ada salahnya mencoba kan? :)
