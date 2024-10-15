---
title: Mamba! Conda on Steroids🐍
categories: [Software Engineering]
tags: [tips, python, programming]
date: 2022-01-16
slug: mamba-conda-on-steroids
---

Siapa yang tidak kenal dengan Anaconda Distribution? Anaconda merupakan salah satu distribusi Python lengkap dengan
*package manager*, *virtual environment* dan fitur-fitur lainnya untuk membantu kita mengembangkan aplikasi berbasis
Python dan R, khususnya untuk keperluan *data science*.

Seperti yang kita tahu, saat kita bekerja dengan sebuah proyek khususnya yang berkaitan dengan *data science*
menggunakan Python, kita sebaiknya memiliki *virtual environment*. Kenapa? Tujuan utamanya adalah membuat ruang kerja
yang terisolasi dan dapat direplikasi dan disdistribusikan dengan lebih mudah, misalnya kode kita akan digunakan oleh
kolega atau akan di-*deploy* ke server. Dengan menggunakan *virtual environment*, kita bisa mengisolasi *package* apa
saja yang dibutuhkan oleh proyek kita sehingga kita bisa dengan mudah membuat `requirements.txt` yang hanya mencakup
proyek yang kita kerjakan.

{{< unsplash "photo-1467299705673-a8a455767418" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzI4OTY0ODc1fA" "Photo by Julia Joppien on Unsplash" "green snake on tree branch" >}}

Tapi ada satu masalah dengan Anaconda. Teman-teman yang mungkin sudah lama menggunakan Anaconda dan banyak menginstall
berbagai *library* baik dari `pip` dan `conda` akan mengalami masalah waktu install *package*. Sudah menjadi rahasia
umum kalau `conda` memang sangat *powerful*, tetapi sayangnya jika kita akan membuat *environment* yang besar, proses
instalasi *package*-nya akan memakan waktu sangat lama, bahkan terkadang ada beberapa *package* yang tidak kompatibel
padahal seharusnya kompatibel.

Nah selanjutnya kita akan berkenalan dengan `mamba`, *package manager* alternatif `conda` dengan banyak fitur untuk
melengkapi `conda`!

## Masalah dengan `conda`

Seperti yang sudah penulis sampaikan pada awal artikel ini, `conda` memiliki banyak sekali fitur yang krusial untuk
pengembangan perangkat lunak menggunakan Python, tetapi tidak bisa dipungkiri bahwa `conda` memiliki beberapa masalah
yang kadang menghambat proses pengembangan aplikasi, misalnya:

1. `conda` tidak dapat menghasilkan *dependency tree* yang memenuhi semua kebutuhan *package*. Dulu penulis pernah
   mencoba untuk menginstall `opencv` dan `tensorflow` menggunakan `conda`, tetapi gagal karena ada konflik bahwa kedua
   *package* tersebut memiliki *dependency* yang tidak kompatibel, padahal seharusnya tidak ada masalah karena penulis
   bisa *build* manual dan tidak menemukan masalah apapun.
2. `conda` membutuhkan waktu yang lama untuk menginstall *package*. *Package* seperti `opencv` dan `tensorflow-gpu`
   memiliki ukuran yang besar dan banyak *dependency*, karena `conda` hanya dapat mengunduh satu *package* dalam satu
   waktu, maka proses install menjadi sangat lama.

Dua masalah tersebut yang akhirnya menggerakkan penulis untuk mencari solusi, bagaimana cara *improve* performa `conda`?

Secara tidak sengaja, penulis menemukan repositori https://github.com/mamba-org/mamba, yang mengklaim sebagai
*the fast cross-patform package manager*. Hmm, apa benar tool ini bisa menjadi solusi untuk masalah penulis di atas?

Jawabannya IYA!

## Berkenalan dengan `mamba`

Mungkin bagi teman-teman yang juga menulis kode program menggunakan NodeJS pasti mengenal `npm`. Selain `npm` terdapat
beberapa alternatif *package manager* seperti `yarn` dan `pnpm`, nah `mamba` ini seperti halnya `yarn` atau `pnpm`.
Fungsinya sama-sama *package manager* dan punya sintaks yang sama seperti `conda`, tetapi secara internal `mamba`
menggunakan `libsolv` dan dibuat menggunakan C++ dan mendukung instalasi *package* secara paralel, sehingga performanya
jauh lebih cepat dibandingkan `conda` yang dibuat menggunakan Python (ironi :")

> *Compiled code* C++ memang lebih cepat daripada Python

`mamba` memiliki perintah yang sebagian besar sama persis dengan versi `conda`, jadi kita tidak perlu mempelajari lagi
perintah-perintah untuk menggunakan `mamba`. Untuk menginstall `mamba`, jalankan perintah berikut pada Anaconda Prompt.

```bash
conda install mamba -n base -c conda-forge
```

Setelah proses instalasi selesai, kita sudah bisa menggunakan `mamba` seperti halnya menggunakan `conda`, misalnya:

```bash
mamba create -n coba-env
mamba activate coba-env
mamba install tensorflow
```

Pada percobaan ini output yang penulis dapatkan adalah sebagai berikut.

```text
                  __    __    __    __
                 /  \  /  \  /  \  /  \
                /    \/    \/    \/    \
███████████████/  /██/  /██/  /██/  /████████████████████████
              /  / \   / \   / \   / \  \____
             /  /   \_/   \_/   \_/   \    o \__,
            / _/                       \_____/  `
            |/
        ███╗   ███╗ █████╗ ███╗   ███╗██████╗  █████╗
        ████╗ ████║██╔══██╗████╗ ████║██╔══██╗██╔══██╗
        ██╔████╔██║███████║██╔████╔██║██████╔╝███████║
        ██║╚██╔╝██║██╔══██║██║╚██╔╝██║██╔══██╗██╔══██║
        ██║ ╚═╝ ██║██║  ██║██║ ╚═╝ ██║██████╔╝██║  ██║
        ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝ ╚═╝  ╚═╝

        mamba (0.15.3) supported by @QuantStack

        GitHub:  https://github.com/mamba-org/mamba
        Twitter: https://twitter.com/QuantStack

█████████████████████████████████████████████████████████████

Looking for: ['tensorflow']

pkgs/main/linux-64       [====================] (00m:00s) No change
pkgs/main/noarch         [====================] (00m:00s) No change
pkgs/r/linux-64          [====================] (00m:00s) No change
pkgs/r/noarch            [====================] (00m:00s) No change
conda-forge/noarch       [====================] (00m:03s) Done
conda-forge/linux-64     [====================] (00m:09s) Done
Transaction

  Prefix: /home/fahmi/miniconda3/envs/coba-env

  Updating specs:

   - tensorflow


  Package                         Version  Build               Channel                  Size
──────────────────────────────────────────────────────────────────────────────────────────────
  Install:
──────────────────────────────────────────────────────────────────────────────────────────────

  + _libgcc_mutex                     0.1  main                pkgs/main/linux-64     Cached
  + _openmp_mutex                     4.5  1_gnu               pkgs/main/linux-64     Cached
  + _tflow_select                   2.3.0  mkl                 pkgs/main/linux-64     Cached
  + abseil-cpp                 20210324.2  h2531618_0          pkgs/main/linux-64     Cached
  + absl-py                        0.15.0  pyhd3eb1b0_0        pkgs/main/noarch       103 KB
  + aiohttp                         3.8.1  py39h7f8727e_0      pkgs/main/linux-64     516 KB
  + aiosignal                       1.2.0  pyhd3eb1b0_0        pkgs/main/noarch        12 KB
  + astor                           0.8.1  py39h06a4308_0      pkgs/main/linux-64     Cached
  + astunparse                      1.6.3  py_0                pkgs/main/noarch       Cached
  + async-timeout                   4.0.1  pyhd3eb1b0_0        pkgs/main/noarch        10 KB
  + attrs                          21.2.0  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + blas                              1.0  openblas            pkgs/main/linux-64     Cached
  + blinker                           1.4  py39h06a4308_0      pkgs/main/linux-64     Cached
  + brotlipy                        0.7.0  py39h27cfd23_1003   pkgs/main/linux-64     Cached
  + c-ares                         1.18.1  h7f8727e_0          pkgs/main/linux-64     114 KB
  + ca-certificates            2021.10.26  h06a4308_2          pkgs/main/linux-64     Cached
  + cachetools                      4.2.2  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + certifi                     2021.10.8  py39h06a4308_2      pkgs/main/linux-64     Cached
  + cffi                           1.14.6  py39h400218f_0      pkgs/main/linux-64     Cached
  + charset-normalizer              2.0.4  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + click                           8.0.3  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + cryptography                    3.4.8  py39hd23ed53_0      pkgs/main/linux-64     Cached
  + dataclasses                       0.8  pyh6d0b6a4_7        pkgs/main/noarch       Cached
  + flatbuffers                     2.0.0  h2531618_0          pkgs/main/linux-64     975 KB
  + frozenlist                      1.2.0  py39h7f8727e_0      pkgs/main/linux-64      79 KB
  + gast                            0.4.0  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + giflib                          5.2.1  h7b6447c_0          pkgs/main/linux-64     Cached
  + google-auth                    1.33.0  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + google-auth-oauthlib            0.4.1  py_2                pkgs/main/noarch        20 KB
  + google-pasta                    0.2.0  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + grpcio                         1.42.0  py39hce63b2e_0      pkgs/main/linux-64       2 MB
  + h5py                            3.6.0  py39ha0f2276_0      pkgs/main/linux-64       1 MB
  + hdf5                           1.10.6  hb1b8bf9_0          pkgs/main/linux-64     Cached
  + icu                              68.1  h2531618_0          pkgs/main/linux-64      12 MB
  + idna                              3.3  pyhd3eb1b0_0        pkgs/main/noarch        49 KB
  + importlib-metadata              4.8.2  py39h06a4308_0      pkgs/main/linux-64     Cached
  + jpeg                               9d  h7f8727e_0          pkgs/main/linux-64     Cached
  + keras-preprocessing             1.1.2  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + krb5                           1.19.2  hac12032_0          pkgs/main/linux-64     Cached
  + ld_impl_linux-64               2.35.1  h7274673_9          pkgs/main/linux-64     Cached
  + libcurl                        7.80.0  h0b77cf5_0          pkgs/main/linux-64     Cached
  + libedit                  3.1.20210910  h7f8727e_0          pkgs/main/linux-64     Cached
  + libev                            4.33  h7f8727e_1          pkgs/main/linux-64     Cached
  + libffi                            3.3  he6710b0_2          pkgs/main/linux-64     Cached
  + libgcc-ng                       9.3.0  h5101ec6_17         pkgs/main/linux-64     Cached
  + libgfortran-ng                  7.5.0  ha8ba4b0_17         pkgs/main/linux-64     Cached
  + libgfortran4                    7.5.0  ha8ba4b0_17         pkgs/main/linux-64     Cached
  + libgomp                         9.3.0  h5101ec6_17         pkgs/main/linux-64     Cached
  + libnghttp2                     1.46.0  hce63b2e_0          pkgs/main/linux-64     Cached
  + libopenblas                    0.3.13  h4367d64_0          pkgs/main/linux-64     Cached
  + libpng                         1.6.37  hbc83047_0          pkgs/main/linux-64     Cached
  + libprotobuf                    3.14.0  h8c45485_0          pkgs/main/linux-64       2 MB
  + libssh2                         1.9.0  h1ba5d50_1          pkgs/main/linux-64     Cached
  + libstdcxx-ng                    9.3.0  hd4cf53a_17         pkgs/main/linux-64     Cached
  + markdown                        3.3.4  py39h06a4308_0      pkgs/main/linux-64     Cached
  + multidict                       5.2.0  py39h7f8727e_2      pkgs/main/linux-64      64 KB
  + ncurses                           6.3  h7f8727e_2          pkgs/main/linux-64     Cached
  + numpy                          1.21.2  py39hd8d4704_0      pkgs/main/linux-64     Cached
  + numpy-base                     1.21.2  py39h2b8c604_0      pkgs/main/linux-64     Cached
  + oauthlib                        3.1.1  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + openssl                        1.1.1m  h7f8727e_0          pkgs/main/linux-64     Cached
  + opt_einsum                      3.3.0  pyhd3eb1b0_1        pkgs/main/noarch       Cached
  + pip                            21.2.4  py39h06a4308_0      pkgs/main/linux-64     Cached
  + protobuf                       3.14.0  py39h2531618_1      pkgs/main/linux-64     306 KB
  + pyasn1                          0.4.8  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + pyasn1-modules                  0.2.8  py_0                pkgs/main/noarch       Cached
  + pycparser                        2.21  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + pyjwt                           2.1.0  py39h06a4308_0      pkgs/main/linux-64     Cached
  + pyopenssl                      21.0.0  pyhd3eb1b0_1        pkgs/main/noarch       Cached
  + pysocks                         1.7.1  py39h06a4308_0      pkgs/main/linux-64     Cached
  + python                          3.9.7  h12debd9_1          pkgs/main/linux-64     Cached
  + python-flatbuffers               1.12  pyhd3eb1b0_0        pkgs/main/noarch        24 KB
  + readline                        8.1.2  h7f8727e_1          pkgs/main/linux-64     354 KB
  + requests                       2.27.1  pyhd3eb1b0_0        pkgs/main/noarch        54 KB
  + requests-oauthlib               1.3.0  py_0                pkgs/main/noarch       Cached
  + rsa                             4.7.2  pyhd3eb1b0_1        pkgs/main/noarch       Cached
  + scipy                           1.7.3  py39h492baa0_0      pkgs/main/linux-64      17 MB
  + setuptools                     58.0.4  py39h06a4308_0      pkgs/main/linux-64     Cached
  + six                            1.16.0  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + snappy                          1.1.8  he6710b0_0          pkgs/main/linux-64     Cached
  + sqlite                         3.37.0  hc218d9a_0          pkgs/main/linux-64     999 KB
  + tensorboard                     2.6.0  py_1                pkgs/main/noarch         5 MB
  + tensorboard-data-server         0.6.0  py39hca6d32c_0      pkgs/main/linux-64       3 MB
  + tensorboard-plugin-wit          1.6.0  py_0                pkgs/main/noarch       Cached
  + tensorflow                      2.6.0  mkl_py39haac40d1_0  pkgs/main/linux-64       4 KB
  + tensorflow-base                 2.6.0  mkl_py39h3d85931_0  pkgs/main/linux-64      77 MB
  + tensorflow-estimator            2.6.0  pyh7b7c402_0        pkgs/main/noarch       Cached
  + termcolor                       1.1.0  py39h06a4308_1      pkgs/main/linux-64     Cached
  + tk                             8.6.11  h1ccaba5_0          pkgs/main/linux-64     Cached
  + typing-extensions            3.10.0.2  hd3eb1b0_0          pkgs/main/noarch       Cached
  + typing_extensions            3.10.0.2  pyh06a4308_0        pkgs/main/noarch       Cached
  + tzdata                          2021e  hda174b7_0          pkgs/main/noarch       Cached
  + urllib3                        1.26.7  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + werkzeug                        2.0.2  pyhd3eb1b0_0        pkgs/main/noarch       Cached
  + wheel                          0.35.1  pyhd3eb1b0_0        pkgs/main/noarch        38 KB
  + wrapt                          1.13.3  py39h7f8727e_2      pkgs/main/linux-64      52 KB
  + xz                              5.2.5  h7b6447c_0          pkgs/main/linux-64     Cached
  + yarl                            1.6.3  py39h27cfd23_0      pkgs/main/linux-64     Cached
  + zipp                            3.7.0  pyhd3eb1b0_0        pkgs/main/noarch        12 KB
  + zlib                           1.2.11  h7f8727e_4          pkgs/main/linux-64     Cached

  Summary:

  Install: 100 packages

  Total download: 122 MB

──────────────────────────────────────────────────────────────────────────────────────────────

Confirm changes: [Y/n]
```

Keren ya! Dengan hanya mengganti satu perintah dari `conda` menjadi `mamba`, kita bisa mendapatkan *performance boost*
dan unduhan paralel sehingga proses pemasangan *package* jadi lebih cepat.

Semoga artikel kali ini bermanfaat! Penulis akan lanjut seri mengenai desain sistem dan arsitektur di artikel yang akan
datang!
