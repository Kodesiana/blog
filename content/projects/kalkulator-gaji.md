---
title: Kalkulator Gaji
description: Konversi nilai gaji antara dua negara
date: 2026-02-12
comments: false
math: true
---

> **Kalkulator Gaji** dalam fase **Production**

{{<button-group>}}
{{<button content="Buka Aplikasi" icon="external-link" href="https://gaji.kodesiana.com/">}}
{{<button content="Repositori" icon="brand-github" href="https://github.com/Kodesiana/ppp-calculator">}}
{{</button-group>}}

**Kalkulator Gaji** merupakan aplikasi sederhana untuk menghitung gaji ekuivalen di dua negara berdasarkan ***Purchasing Power Parity (PPP)***. Data PPP didapatkan dari [Bank Dunia](https://data.worldbank.org/indicator/PA.NUS.PPP) dengan data terbaru adalah data PPP tahun 2024 (terakhir diperbarui 10 Februari 2026).

Kenapa membandingkan gaji berdasarkan PPP?

PPP didefinisikan sebagai nilai tukar dua mata uang yang disesuaikan dengan daya beli barang dan jasa yang sama di dua negara berbeda. Metode PPP menyesuaikan pendapatan terhadap biaya hidup, sehingga perbandingan gaji pada dua negara berbeda dapat merefleksikan perbedaan biaya hidup, tidak hanya nilai mata uang.

## Formula Konversi

$$
\mathrm{Gaji_B} = \frac{\mathrm{Gaji_A} \times \mathrm{PPP_B}}{\mathrm{PPP_A}}
$$

dengan:

- $\mathrm{Gaji_A}$ = gaji di negara asal
- $\mathrm{Gaji_B}$ = gaji di negara tujuan
- $\mathrm{PPP_A}$ = PPP di negara asal
- $\mathrm{PPP_B}$ = PPP di negara tujuan
