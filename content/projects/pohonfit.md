---
title: Pohonfit
description: Regresi nonlinier untuk mengestimasi pertumbuhan cincin heartwood dan sapwood pada pohon
date: 2026-02-12
comments: false
math: true
---

> **Pohonfit** dalam fase **Maintenance**
>
> Aplikasi ini masih dalam proses penelitian dan pengembangan.

{{<button-group>}}
{{<button content="Buka Aplikasi" icon="external-link" href="https://pohonfit.kodesiana.com">}}
{{<button content="GitHub Repository" icon="brand-github" href="https://github.com/fahminlb33/pohonfit">}}
{{<button content="Artikel Jurnal" icon="books" href="https://doi.org/10.3390/f14081643">}}
{{</button-group>}}

**Pohonfit** merupakan aplikasi untuk melakukan analisis dan pemodelan pertumbuhan cincin *hearwood* dan *sapwood* pada pohon berkayu. Pemodelan dilakukan menggunakan persamaan yang dibuat oleh Alm. Prof. Effendi Tri Bahtiar, dosen Fakultas Kehutanan IPB. Model regresi nonlinear yang digunakan adalah:

$$
r_{i} = \frac{r_{o} \left(\left(a^{2} - b^{2}\right) \sin ⁡ \left(\theta_{i} - k \pi\right) \sin ⁡ \left(\theta_{o} - k \pi\right) + b^{2} \cos ⁡ \left(\theta_{i} - \theta_{o}\right)\right) \pm a b \\sqrt{\left(a^{2} - b^{2}\right) \sin^{2} ⁡ \left(\theta_{i} - k \pi\right) + b^{2} - r_{o}^{2} \sin^{2} ⁡ \left(\theta_{i} - \theta_{o}\right)}}{\left(a^{2} - b^{2}\right) \sin^{2} ⁡ \left(\theta_{i} - k \pi\right) + b^{2}} + \mathcal{E}_{i}
$$

> Sumber: Bahtiar *et al.* (2023), Denih *et al.* (2023)

Selain estimasi parameter model regresi di atas, aplikasi Pohonfit mampu melakukan pemodelan pertumbuhan pohon (diameter, volume, dan tinggi). Akhirnya, aplikasi ini bisa memodelkan pertumbuhan menggunakan model pertumbuhan Gompertz, Chapman-Richard, von Bertalanffy.

## Referensi

1. Bahtiar, Effendi Tri, and Apri Heri Iswanto. “Annual Tree-Ring Curve-Fitting for Graphing the Growth Curve and Determining the Increment and Cutting Cycle Period of Sungkai (Peronema Canescens).” Forests 14, no. 8 (2023): 1643. https://doi.org/10.3390/f14081643.
2. Denih, Asep, Gustian Rama Putra, Zaqi Kurniawan, and Effendi Tri Bahtiar. “Developing a Model for Curve-Fitting a Tree Stem’s Cross-Sectional Shape and Sapwood–Heartwood Transition in a Polar Diagram System Using Nonlinear Regression.” Forests 14, no. 6 (2023): 1102. https://doi.org/10.3390/f14061102.
