---
title: Sentiment Analysis Menggunakan Accord.NET😁
categories: Data Science
tags: [csharp, machine learning]
date: 2018-12-26
slug: sentiment-analysis-menggunakan-accord-net
---

{{< button content="Soure Code" icon="brand-github" href="https://l.kodesiana.com/legacy-emotex" >}}

Sentiment analysis itu apa? Kenapa tiba-tiba admin menulis artikel tentang sentiment analysis? Singkat kata admin sedang
mengikuti lomba **Piala MIPA 2018** yang diadakan oleh **Fakultas Ilmu Pengetahuan Alam Universitas Pakuan**.

## Apa itu Sentiment Analysis?

*Sentiment analysis* merupakan bentuk text mining yang bertujuan untuk mengidentifikasi dan mengambil informasi
subjektif dari suatu informasi (Wikipedia, 2018). Penulis memilih membuat *sentiment analysis* karena menurut penulis
*sentiment analysis* merupakan salah satu topik yang sangat menarik untuk diteliti karena memiliki implementasi yang
luas dan tidak terlalu sulit untuk membuat implementasinya menggunakan C#.

## Flowchart

Dalam program Emotex, penulis menggunakan berbagai kombinasi algoritma yang sudah disediakan oleh Accord.NET yaitu:

- **Tokenizer**, menggunakan library *Accord.Text*.
- **Stemmer**, menggunakan algoritma Porter yang diporting dari *Snowball language* menggunakan library *Accord.Text*.
- **Bag of Words** dan **Naive Bayes**, menggunakan library *Accord.MachineLearning*.
- **Confusion Matrix** dan **ROC curve**, menggunakan library *Accord.Statistics*.

Dapat dilihat bahwa Accord.NET memiliki fitur yang sangat lengkap untuk mengimplementasikan *machine learning* pada C#
dan .NET Framework. Meskipun demikian, ada banyak alternatif seperti ML.NET yang secara resmi dikembangkan oleh
Microsoft untuk berbagai kebutuhan yang berkaitan dengan *machine learning*.

Bisa dikatakan bahwa Accord.NET merupakan versi alternatif untuk C# dari library seperti *scikit-learn* pada Python.
Tetapi tentu masing-masing library memiliki kelebihan dan kekurangannya masing-masing.

## Training dan Evaluation

Penulis menggunakan *Naive Bayes Classifier* untuk membuat *predictor* dari teks. Dengan menggunakan 1000 kalimat untuk
proses *training* dan 1000 kalimat lain untuk proses evaluasi. Dataset tersebut dikumpulkan dari repositori ML.NET yang
merupakan ulasan film dari IMDb.

Penulis menggunakan dataset berbahasa Inggris karena tidak dapat menemukan cukup banyak data untuk diolah. Sebelumnya
penulis membuat angket untuk mengumpulkan ulasan film, tetapi data tersebut tidak mencukupi untuk melakukan *training*.

## Hasil dan Analisis

Setelah proses evaluasi, didapatkan hasil akurasi sebesar 66,30%. Hasil yang tidak terlalu buruk mengingat keterbatasan
penelitian. Dengan menggunakan bantuan Accord.NET, proses pembuatan aplikasi ini jauh lebih mudah karena Accord.NET
menyediakan abstraksi dari algoritma *Naive bayes* pada kelas *NaiveBayesLearning*.

Penulis berharap bahwa penelitian ini dapat bermanfaat bagi orang lain yang sedang meneliti atau membuat aplikasi
serupa. Untuk informasi lebih lanjut, Anda dapat membaca paper dan mengunduh kode Emotex melalui tautan berikut.

Anda dapat mengunduh paper ini melalui tautan berikut.
[**Emotex: Implementasi Sentiment Analysis menggunakan Accord.NET dan Naive Bayes Classifier**](https://www.researchgate.net/publication/347485448_Emotex_Implementasi_Sentiment_Analysis_menggunakan_AccordNET_dan_Naive_Bayes_Classifier)

## Referensi

1. Wikipedia. 2018. [Sentiment Analysis](https://en.wikipedia.org/wiki/Sentiment_analysis). Diakses 11 November 2018.
2. Untuk referensi lebih lanjut, silakan untuk paper penelitian ini pada tautan di atas.
