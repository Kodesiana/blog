---
title: Sentiment Analysis Menggunakan Accord.NET😁
category: Data Science
tags: [csharp, machine learning]
date: 2018-12-26
slug: sentiment-analysis-menggunakan-accord-net
---

Sentiment analysis itu apa? Kenapa tiba-tiba admin menulis artikel tentang sentiment analysis? Singkat kata admin sedang mengikuti lomba **Piala MIPA 2018** yang diadakan oleh **Fakultas Ilmu Pengetahuan Alam Universitas Pakuan**.

## Apa itu Sentiment Analysis?

_Sentiment analysis_ merupakan bentuk text mining yang bertujuan untuk mengidentifikasi dan mengambil informasi subjektif dari suatu informasi (Wikipedia, 2018). Penulis memilih membuat _sentiment analysis_ karena menurut penulis _sentiment analysis_ merupakan salah satu topik yang sangat menarik untuk diteliti karena memiliki implementasi yang luas dan tidak terlalu sulit untuk membuat implementasinya menggunakan C#.

## Flowchart

Dalam program Emotex, penulis menggunakan berbagai kombinasi algoritma yang sudah disediakan oleh Accord.NET yaitu:

- **Tokenizer**, menggunakan library _Accord.Text_.
- **Stemmer**, menggunakan algoritma Porter yang diporting dari _Snowball language_ menggunakan library _Accord.Text_.
- **Bag of Words** dan **Naive Bayes**, menggunakan library _Accord.MachineLearning_.
- **Confusion Matrix** dan **ROC curve**, menggunakan library _Accord.Statistics_.

Dapat dilihat bahwa Accord.NET memiliki fitur yang sangat lengkap untuk mengimplementasikan _machine learning_ pada C# dan .NET Framework. Meskipun demikian, ada banyak alternatif seperti ML.NET yang secara resmi dikembangkan oleh Microsoft untuk berbagai kebutuhan yang berkaitan dengan _machine learning_.

Bisa dikatakan bahwa Accord.NET merupakan versi alternatif untuk C# dari library seperti _scikit-learn_ pada Python. Tetapi tentu masing-masing library memiliki kelebihan dan kekurangannya masing-masing.

## Training dan Evaluation

Penulis menggunakan _Naive Bayes Classifier_ untuk membuat _predictor_ dari teks. Dengan menggunakan 1000 kalimat untuk proses _training_ dan 1000 kalimat lain untuk proses evaluasi. Dataset tersebut dikumpulkan dari repositori ML.NET yang merupakan ulasan film dari IMDb.

Penulis menggunakan dataset berbahasa Inggris karena tidak dapat menemukan cukup banyak data untuk diolah. Sebelumnya penulis membuat angket untuk mengumpulkan ulasan film, tetapi data tersebut tidak mencukupi untuk melakukan _training_.

## Hasil dan Analisis

Setelah proses evaluasi, didapatkan hasil akurasi sebesar 66,30%. Hasil yang tidak terlalu buruk mengingat keterbatasan penelitian. Dengan menggunakan bantuan Accord.NET, proses pembuatan aplikasi ini jauh lebih mudah karena Accord.NET menyediakan abstraksi dari algoritma _Naive bayes_ pada kelas _NaiveBayesLearning_.

Penulis berharap bahwa penelitian ini dapat bermanfaat bagi orang lain yang sedang meneliti atau membuat aplikasi serupa. Untuk informasi lebih lanjut, Anda dapat membaca paper dan mengunduh kode Emotex melalui tautan berikut.

Anda dapat mengunduh paper ini melalui tautan berikut.
[_**Emotex: Implementasi Sentiment Analysis menggunakan Accord.NET dan Naive Bayes Classifier**_](https://www.researchgate.net/publication/347485448_Emotex_Implementasi_Sentiment_Analysis_menggunakan_AccordNET_dan_Naive_Bayes_Classifier)

Untuk mengunduh source code aplikasi Emotex, kunjungi laman GitHub pribadi penulis.
[https://github.com/fahminlb33/Emotex](https://github.com/fahminlb33/Emotex)

## Referensi

1. Wikipedia. 2018. Sentiment Analysis (_[https://en.wikipedia.org/wiki/Sentiment_analysis](https://en.wikipedia.org/wiki/Sentiment_analysis)_). Diakses 11 November 2018.
2. Untuk referensi lebih lanjut, silakan untuk paper penelitian ini pada tautan di atas.
