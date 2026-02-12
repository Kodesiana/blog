---
title: IPB Promotor Network
description: Ansible Playbook untuk provision media server Raspberry Pi
date: 2026-02-12
comments: false
---

> **IPB Promotor Network** dalam fase **Maintenance**
>
> Aplikasi terakhir diperbarui pada 31 Desember 2025.

{{<button-group>}}
{{<button content="Buka Aplikasi" icon="external-link" href="https://ipb-promotor.kodesiana.com/">}}
{{<button content="Repositori" icon="brand-github" href="https://github.com/Kodesiana/ipb-repo-analysis">}}
{{<button content="Artikel" icon="books" href="/post/mencari-promotor-melalui-co-authorship-network-peneliti-ipb">}}
{{</button-group>}}

**IPB Promotor Network** merupakan aplikasi untuk memvisualisasikan jaringan peneliti di IPB University. Jaringan ini dibuat dengan menggunakan data hasil *scraping* dari [Repository IPB](https://repository.ipb.ac.id) yang kemudian diolah menggunakan Python untuk menghasilkan jaringan berupa *co-authorship network*. Aplikasi ini bisa membantu Anda untuk:

- mencari calon promotor/komisi pembimbing,
- apa saja topik penelitian dosen tersebut, hingga
- siapa saja dosen yang sering berkolaborasi bersama dengan dosen tersebut.

Aplikasi ini bisa diakses secara gratis dan tanpa akun.

## Cara Menggunakan

Sebelum menggunakan aplikasi ini, Anda harus mengetahui setidaknya satu nama dosen peneliti sebagai permulaan perjalanan pencarian Anda😉

1. Buka aplikasi dengan klik tombol di atas
2. Klik kolom pencarian kemudian cari nama dosen
3. Anda juga bisa centang pada kotak **Show second level neighbors** untuk menampilkan hubungan antara dosen yang dicari beserta kolaborator yang lebih luas

## Keterangan

- Ketebalan *edge* menunjukkan berapa banyak publikasi yang pernah dikerjakan bersama, dengan kata lain seberapa sering kedua dosen ini terdapat dalam satu penelitian yang sama
- Grafik jumlah publikasi menunjukkan berapa banyak publikasi **disertasi di Repository IPB**. Nilai ini tidak menunjukkan jumlah publikasi jurnal, prosiding, buku, atau publikasi lainnya
- Kata kunci penelitian diambil dari IPB Repository, oleh karena itu kata kunci yang ditampilkan belum tentu mencakup topik riset yang menyeluruh pada dosen yang dicari

### Warna *Node*

- Merah = dosen yang dicari
- Kuning = kolaborator langsung dan pernah terlibat dalam satu penelitian yang sama dengan dosen yang dicari
- Biru = kolaborator yang pernah terlibat dalam penelitian dengan kolaborator tidak langsung dan kemungkinan belum pernah berkolaborasi dengan dosen yang dicari

### Ukuran *Node Centrality*

- B = *betweenness*
- D = *degree*
- E = *eigenvector*
- PR = *PageRank*
