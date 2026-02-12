---
title: Padi-CNN
description: Aplikasi untuk diagnosisi dan lokalisasi penyakit pada citra padi
date: 2026-02-12
comments: false
---

> **Padi-CNN** dalam fase **End-of-Life**

{{<button-group>}}
{{<button content="Buka Aplikasi" icon="external-link" href="https://padi.kodesiana.com">}}
{{<button content="Repositori" icon="brand-github" href="https://github.com/fahminlb33/rice-paddy-classification">}}
{{<button content="Paper Prosiding" icon="books" href="https://doi.org/10.1109/ICOIACT59844.2023.10455786">}}
{{</button-group>}}

**Padi-CNN** merupakan aplikasi web untuk mendiagnosis dan lokalisasi penyakit pada citra tanaman padi. Model deteksi dibuat menggunakan metode *transfer learning* tepatnya dengan model [MobileNetV2](https://openaccess.thecvf.com/content_cvpr_2018/papers/Sandler_MobileNetV2_Inverted_Residuals_CVPR_2018_paper.pdf) sebagai *feature extractor* dan men-*training* *classification head* baru. Tidak hanya model klasifikasi, tetapi penelitian ini juga menerapkan metode [*Gradient-Weighted Class Activation Mapping (Grad-CAM)*](https://doi.org/10.1109/ICCV.2017.74) untuk memvisualisasikan *lokasi penyakit* pada tanaman padi.

## Referensi

1. Fiqri, Fahmi Noor, Sri Setyaningsih, and Asep Saepulrohman. “Rice Disease Image Classification Using MobileNetV2 Pretrained Model with Attention Visualization Using Gradient-Weighted Class Activation Mapping (Grad-CAM).” *2023 6th International Conference on Information and Communications Technology (ICOIACT)*, November 2023, 367–71. https://doi.org/10.1109/ICOIACT59844.2023.10455786.
2. Sandler, Mark, Andrew Howard, Menglong Zhu, Andrey Zhmoginov, and Liang-Chieh Chen. “MobileNetV2: Inverted Residuals and Linear Bottlenecks.” *2018 IEEE/CVF Conference on Computer Vision and Pattern Recognition*, June 2018, 4510–20. https://doi.org/10.1109/CVPR.2018.00474.
3. Selvaraju, Ramprasaath R., Michael Cogswell, Abhishek Das, Ramakrishna Vedantam, Devi Parikh, and Dhruv Batra. “Grad-CAM: Visual Explanations from Deep Networks via Gradient-Based Localization.” 2017 IEEE International Conference on Computer Vision (ICCV), October 2017, 618–26. https://doi.org/10.1109/ICCV.2017.74.
