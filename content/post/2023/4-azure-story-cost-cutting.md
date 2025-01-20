---
title: 'Cara Penulis Menghemat Tagihan Azure Hingga 70%💸'
categories: [Software Engineering]
tags: [architecture, azure, tips, internet, cloud]
date: 2023-08-24
---

> Please review your Azure billing for this month.

Kalimat di atas mungkin sudah tidak asing lagi untuk teman-teman developers yang berlangganan layanan *cloud* khususnya Azure. Azure yang merupakan salah satu penyedia layanan *cloud* adalah salah satu pilihat favorit dari *the big three AWS/AZ/GCP* karena memiliki berbagai layanan yang lengkap untuk semua kebutuhan infrastruktur *cloud*. Sayangnya, sama seperti *cloud provider* lainnya, *billing* Azure bisa dibilang tegolong mahal.

![Azure billing meme](https://assets.kodesiana.com/posts/2023/azure-story-cost-cutting/az-billing-meme.png)

Azure sebagai salah satu penyedia layanan *cloud* memiliki lebih dari 40 layanan dan tersedia di seluruh dunia. Karena Azure menawarkan banyak layanan, sering kali developer khususnya yang baru menjajal Azure atau *cloud* pada umumnya tidak tahu cara membuat arsitektur sistem yang *cost effective*. Pada artikel ini penulis ingin berbagi pengalaman penulis ketika men-*deploy* aplikasi di Azure dan bagaimana pilihan arsitektur dapat menekan pengeluaran penulis.

Tips ini bisa teman-teman gunakan pada semua *cloud* pada umumnya!

## Memahami *Requirements* 🧐

Setiap aplikasi membutuhkan berbagai dependensi seperti *virtual machine* untuk menjalankan aplikasi, basis data untuk menyimpan data, dan sering kali *object storage* untuk menyimpan file. Sebelum populernya layanan *public cloud*, sebagian besar aplikasi bisa di *hosting* melalui cPanel atau VPS. Pada kasus ini, semua dependensi aplikasi dapat dipasang di atas satu VPS yang sama dan pilihan *scaling*-nya terbatas pada ukuran VPS yang tersedia.

Sejak *Netflix* memperkenalkan istilah *microservice* dan *cloud native*, banyak aplikasi mulai mengadopsi layanan *public cloud* untuk meningkatkan skalabilitas dan juga menekan pengeluaran. Pada banyak kasus, menggunakan layanan *public cloud* dapat mengurangi pengeluaran dan meningkatkan respons aplikasi. Tetapi sayangnya, tidak semua proses adopsi dapat menghasilkan output yang diharapkan.

Misalnya kita ingin men-*deploy* aplikasi berbasis ASP.NET Core dengan SQL Server (Azure SQL) dan penyimpanan file (Azure Storage Accounts/Blob). Berikut adalah beberapa alternatif yang bisa kita lakukan:

1. Azure WebApps
2. Azure Container Instances (ACI)
3. Azure Virtual Machine (VM)

Dari contoh empat alternatif di atas, penulis awalnya menggunakan pilihan nomor 1, karena pilihan tersebut merupakan pilihan yang paling logis karena aplikasi yang penulis buat juga merupakan *web apps*. Tapi, layanan *web apps* ini ternyata mahal!😫

![Mr Krabs bathing in money](https://media.giphy.com/media/LdOyjZ7io5Msw/giphy.gif)

*Requirement* aplikasi yang penulis akan *deploy* sebenarnya sangat sederhana, hanya aplikasi sistem informasi kecil dengan DB dan penyimpanan file. Setelah penulis periksa kembali perbedaan dari layanan Azure di atas,

1. Azure WebApps, merupakan layanan *compute* lengkap dengan penyimpanan dan dukungan untuk *deploy* aplikasi berbasis Docker atau kodenya langsung dengan *runtime* dari Azure. Layanan ini lebih ditujukan untuk *deploy* aplikasi *monolithic* dan *traffic* yang besar.
2. Azure Container Instances, merupakan layanan *compute* berbasis kontainer. Ditujukan untuk aplikasi *container* dengan proses yang bersifat *burst/occasional*.
3. Azure Virtual Machine, layanan VM seperti pada umumnya VPS di hosting.

Jika dibandingkan dari kompleksitas proses integrasi dan *deploy* melalui Github Actions, Azure WebApps merupakan layanan yang paling mudah untuk diinterasikan. ACI juga bisa dibilang mudah, tetapi agak rumit untuk mengatur *DNS pointing* ke domain `kodesiana.com`. Pilihan terakhir adalah VM yang bisa dibilang paling rumit karena untuk proses *deploy* penulis harus membuat sendiri skrip untuk *deploy* melalui SSH.

## Overengineering? 😐

*Overengineering* merupakan kondisi mendesain/membuat produk yang terlalu kompleks daripada yang dibutuhkan [1]. Sebagai *programmer*, penulis sering *overthinking* mau pakai DB apa, *framework* apa, versi *library* berapa, dan sering kali di tengah pengerjaan aplikasi, penulis ingin menggunakan teknologi baru yang sedang *trending*. Hal-hal ini termasuk pada praktik *overengineering* dan tidak terbatas pada proses koding, tetapi juga bisa terjadi pada proses pemilihan infrastruktur apa yang akan digunakan untuk men-*deploy* aplikasi kita nantinya.

Pada kasus ini, awalnya menggunakan Azure WebApps karena layanan ini sangat mudah digunakan untuk men-*deploy* aplikasi, tapi sayangnya penulis hanya menggunakan satu aspek dari layanan ini, yaitu layanan *compute*-nya saja, sehingga penulis membayar biaya mahal tapi tidak menggunakan semua layanan WebApps dengan maksimal.

Setelah penulis frustasi dengan *billing* yang bisa mencapai 1jt per bulan padahal *traffic* aplikasinya kecil dan juga tidak banyak proses yang terjadi pada server, penulis akhirnya mencoba mencari alternatif lain dari Azure WebApps dan akhirnya penulis memilih untuk menggunakan Azure VM.

> Spoiler: it's the correct choice...

## *Pindahan* 🛻 dan *Invoice* 💸

Satu bulan setelah penulis dari Azure WebApps ke Azure VM, *invoice* penulis turun dari ~1jt menjadi ~300k (-70%) saja!🤯

Kita bisa memanfaatkan fitur *Cost Analysis* di Azure (Cost Management + Billing > Subscriptions > Cost Analysis) untuk memahami struktur tagihan Azure. Ternyata, layanan Azure WebApp berkontribusi 66% dari total tagihan Azure. Setelah penulis pindah ke Azure VM, ternyata Azure VM hanya menghabiskan ~150k (VM B1s) dan penggunaan CPU/RAM nya juga sudah cukup (1 CPU, 1 GB RAM) untuk keperluan aplikasi penulis.

![Azure cost analysis](https://assets.kodesiana.com/posts/2023/azure-story-cost-cutting/azure-billing-before.png)

### Amazon Prime juga melakukan hal yang sama!🦄

Dilansir dari [2], layanan *streaming* Amazon Prime beberapa waktu ini mengubah arsitektur sistem monitoring kualitas videonya dari *microservice* ke *monolith* dan memindahkan aplikasinya dari AWS Lambda ke AWS EC2. Pada kasus ini, tim AWS menemukan bahwa terdapat *overhead* yang besar antara penggunaan S3 Bucket dan AWS Lambda karena proses monitoring yang dilakukan per detik, untuk mengurangi *overhead* ini, tim AWS memilih untuk menggunakan layanan EC2 dengan memindahkan data yang perlu dicek dari S3 ke block storage yang bisa diakses lebih cepat karena terpasang ke EC2.

Pada kasus ini tim Amazon Prime berhasil mengurangi kompleksitas sistemnya dan juga menekan pengeluaran hingga 90%🤑 Dari contoh ini kita bisa lihat bagaimana pengambilan keputusan mengenai arsitektur sistem dapat berpengaruh besar pada skalabilitas dan juga *cost* aplikasi.

## Simpulan 😉

Satu hal yang bisa penulis ambil dari pengalaman ini adalah sebagai seorang *developer*, kita perlu terus belajar mengenai perkembangan teknologi bukan untuk mengimplementasikan semua teknologi baru tersebut, tapi untuk lebih memahami *use case* dari teknologi tersebut agar kita bisa membuat aplikasi dengan kualitas yang tinggi dan juga efisien secara *resource server* dan *cost*.

Selain itu, kolaborasi dengan *expert* di bidang *cloud infrastructure* juga merupakan salah satu pilar untuk dapat memahami bagaimana perbedaan layanan-layanan yang ditawarkan oleh *public cloud* agar kita bisa memilih layanan paling cocok untuk *use case* aplikasi kita dan tentunya, bisa *cost effective!*

Mungkin cukup sekian untuk artikel kali ini, *stay tuned* untuk artikel selanjutnya!

## Referensi ✏️

1. Mind the Product. 2021. [Overengineering can kill your product](https://www.mindtheproduct.com/overengineering-can-kill-your-product/). Diakses 24 Agustus 2023.
2. Kolny, Marcin. 2023. [Scaling up the Prime Video audio/video monitoring service and reducing costs by 90%](https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90). Diakses 24 Agustus 2023.
