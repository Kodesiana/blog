---
title: Membangun Home Server📺 menggunakan Raspberry Pi dan Ansible⛵ - Bagian 1
categories: [Networking]
tags: [tutorial, tips, internet, cloud]
series: [Ritsu-Pi Home Server]
date: 2023-11-26
---

Netflix, Youtube, Google Drive, dan berbagai layanan *cloud* sudah menjadi bagian tak terpisahkan dari kehidupan kita di dunia digital. Penulis sendiri sangat bergantung dengan layanan *cloud* seperti Notion untuk menyimpan catatan penting dan Office 365 untuk keperluan kerja. Tapi pernahkah kita membayangkan apa jadinya kalau kita kehilangan akses ke layanan *cloud* tersebut? Apakah data yang kita simpan aman? Berapa besar biaya yang kita keluarkan untuk langganan?

Kalau kamu mulai punya pemikiran untuk menjadi **independen** atau ingin bereksperimen dengan membuat server rumah sendiri, kamu bisa coba **Ritsu-Pi**!

## Kenapa *Home Server*?📺

Layanan *online* untuk *streaming* seperti Youtube, Netflix, Disney Hotstar, dan lainnya membuat kita lebih mudah untuk mengakses *entertainment*. Selain itu layanan seperti Office 365, OneDrive, dan Google Workspace memudahkan kita untuk membuat jadwal, melakukan *video conference*, dan menyimpan file-file kita agar mudah diakses di manapun dan kapanpun.

Meskpun kebayakan layanan tersebut ditawarkan tanpa biaya, saya selalu ingat ungkapan ini:

> If you're not paying for the product, then you're the product
>
> -The Social Dilemma

Kita tidak menggunakan layanan tersebut secara *gratis*, tapi kita juga membagikan data kita dengan *provider*, baik itu berupa riwayat penggunaan maupun sebagai target *A/B testing* untuk mengingkatkan performa aplikasi. Lebih bahayanya lagi, jika data yang kita punya dapat tersebar luas dan digunakan untuk kejahatan (*overthinking?* 😭).

{{< unsplash "photo-1516534775068-ba3e7458af70" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzI4OTYxOTE5fA" "Unsplash" "woman biting pencil while sitting on chair in front of computer during daytime " >}}

Selain masalah *vendor lock-in* dan privasi, ada kelebihan lain juga yang bisa kita dapatkan jika kita punya server pribadi.

Penulis sendiri suka nonton film, musik, dan juga internetan ke berbagai forum dan website. Selain itu  penulis juga sering *gaming* dan *sharing file* antara komputer dan laptop. Dengan menggunakan layanan seperti Google Workspace dan Office 365 tentu semua masalah penulis bisa dikerjakan dengan mudah, tapi dengan satu kelemahan: wajib ada koneksi internet.

Seperti yang teman-teman tahu dari [artikel](https://www.kodesiana.com/post/indihome-suck-kualitas-internet-semakin-rendah/) yang penulis pernah buat dulu, penulis menggunakan layanan internet dari Indihome dan kadang koneksi internetnya terputus atau koneksinya tidak begitu cepat untuk *streaming* dan *file sharing*, apalagi penulis sering memindahkan file dengan ukuran besar. Maka dari itu, tujuan penulis untuk membuat server sendiri di rumah adalah:

1. *Home entertainment system* agar bisa menonton film, serial TV, dan musik secara *offline* di komputer, laptop, dan *smart TV*
2. Membuat *file share* untuk memudahkan berbagi file pada jaringan rumah
3. Buka blokir website *TRUSTPositif* dan **blokir iklan**
4. *Download* file di server agar tidak perlu menyalakan komputer terus-menerus
5. Monitoring kondisi jaringan dan server

Apakah hal-hal tersebut bisa kita lakukan dengan server lokal? Tentunya🦄

## Ritsu-Pi Stack📦

Untuk mencapai tujuan penulis agar bisa lebih *terbebas* dari layanan *cloud*, penulis ingin membangun layanan *cloud* untuk pribadi, khususnya untuk *home entertainment, download*, privasi, dan tentunya *monitoring* jaringan rumah.

Secara umum, aplikasi yang terdapat dalam sistem **Ritsu-Pi** (ini adalah nama server penulis) dapat digambarkan sebagai berikut.

![Arsitektur Ritsu-Pi](https://blob.kodesiana.com/kodesiana-public-assets/posts/2023/ritsu-pi/ritsupi-stack_comp.png "Arsitektur Ritsu-Pi")

Semua aplikasi mulai akan dijalankan menggunakan Docker Container untuk memudahkan proses instalasi dan *maintenance* semua aplikasi pada server. Lalu, apa saja aplikasi yang terdapat dalam Ritsu-Pi?

Lihat juga: [Yuk Belajar Docker Container!🐳](https://www.kodesiana.com/post/yuk-belajar-docker-container-chapter-1-2/)

### Media Server

{{< unsplash "photo-1461151304267-38535e780c79" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzI4OTYzNDExfA" "Photo by Jens Kreuter on Unsplash" "flat screen tv" >}}

Kategori aplikasi pertama yang terdapat dalam Ritsu-Pi adalah ***media server***. Penulis ingin membuat sistem *home entertainment* seperti Netflix dan dapat ditonton di komputer, *smart TV*, maupun *smartphone*. Selain itu, penulis juga ingin dapat berbagi file ke semua perangkat yang terhubung dengan jaringan Wi-Fi di rumah, sehingga penulis bisa mengirimkan file dari komputer, HP, laptop, dan lainnya dengan mudah.

#### [Jellyfin](https://jellyfin.org/)

Jellyfin merupakan aplikasi *media system* untuk mengatur semua jenis media mulai dari film, serial TV, hingga musik menjadi satu pustaka seperti Netflix. Kamu mungkin pernah dengar aplikasi Windows Media Center, Kodi, atau Plex? Jellyfin ini mirip seperti aplikasi tersebut, tapi menurut penulis aplikasi Jellyfin lebih ringan dan juga lebih fokus pada privasi, karena kita tidak perlu mendaftar untuk menggunakan aplikasi Jellyfin.

Selain itu aplikasi ini juga memiliki versi Android yang bisa digunakan untuk *streaming* dan menjadi *remote control* untuk mengatur pemutaran film di komputer/laptop. Sesuai fungsi aplikasinya yaitu *media system*, artinya kita perlu menyimpan semua media kita dalam satu server, semua film, musik, dan lainnya harus tersimpan di server sebelum dapat diputar.

#### [Samba](https://www.samba.org/)

Samba merupakan aplikasi untuk membuat *SMB share* atau jika di Windows lebih dikenal sebagai *network shared folder*. Dengan menggunakan aplikasi ini, kita bisa membagikan folder di server dan folder tersebut bisa diakses oleh semua komputer, laptop, dan HP yang terhubung ke satu jaringan yang sama.

Sangat memudahkan untuk membagikan file tanpa perlu menggunakan diskalepas maupun *hardd rive* eksternal. Tapi tentu saja seberapa cepat proses pengiriman file bergantung pada kapasitas koneksi Wi-Fi dan jaringan rumah kita. Penulis sendiri menggunakan koneksi *ethernet* 1Gbps dan Wi-Fi 6.0 yang bisa mencapai 1Gbps.

### Networking Tools

Kategori selanjutnya adalah aplikasi jaringan. Dua hal yang penulis tidak suka adalah (1) sensor dan penyadapan yang berlebihan dan (2) iklan. Untungnya, metode blokir *website* yang digunakan oleh Kominfo yang diterapkan oleh semua ISP di Indonesia berbasis pada *DNS blocking* dan bisa dengan mudah di-*bypass* dengan mengganti DNS atau dengan menggunakan enskripsi kueri DNS. Menggunakan cara yang sama, kita bisa memblokir sebagian besar iklan di internet juga lho!

#### [DNSCrypt](https://dnscrypt.info/)

DNSCrypt merupakan program untuk mengenskripsi, mengotentikasi, dan menganonimkan komunikasi DNS antara klien dan *DNS resolver*. Dengan kata lain, penggunaan protokol ini dapat menyembunyikan kueri DNS dan memastikan kita terhindari dari *DNS spoofing*. Program ini juga yang membuat kita bisa menghindari pemblokiran *website* dari TRUSTPositif.

#### [Pi-hole](https://pi-hole.net/)

Pi-hole mungkin adalah salah satu aplikasi yang paling dikenal oleh komunitas *geek* di dunia karena kemampuannya untuk melakukan pemblokiran pada level DNS utamanya untuk memblokir iklan. Selain itu, Pi-hole juga merupakan server DNS sendiri, sehingga kita bisa membuat domain khusus untuk mengakses aplikasi dalam jaringan yang sama.

Dengan mengintegrasikan Pi-hole dan DNSCrypt, kita bisa mendapatkan keamanan dan juga pemblokiran iklan dan pelacakan dari *website* dengan mudah! Kita juga bisa memblokir akses ke *website-website* tertentu melalui Pi-hole misalnya kita ingin memblokir TikTok dan aplikasi lainnya.

### Downloader

{{< unsplash "photo-1499914485622-a88fac536970" "M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzI4OTU5OTg2fA" "Photo by Christin Hume on Unsplash" "person using macbook" >}}

*Downloader* merupakan kategori aplikasi untuk mengunduh/*download* file dari internet. Seperti yang sudah dibahas sebelumnya pada bagian *media server*, semua file media harus berada pada penyimpanan server yang artinya, film, serial TV, dan musik harus diunduh ke server. Tentunya kita tidak mau harus menunggu proses unduhan selesai satu per satu kemudian memindahkannya ke server, maka dari itu kita bisa menggunakan dua aplikasi *download manager*,

#### [JDownloader 2](https://jdownloader.org/)

JDownloader 2 merupakan *download manager* paling keren setelah *IDM (Internet Download Manager)*. Aplikasi ini memiliki versi Android sehingga kita bisa memulai proses unduhan dari manapun dan kita bisa atur proses unduhannya secara *remote* melalui *website* MyJDownloader. Kita juga hanya perlu menginputkan URL *website* dan tidak perlu *direct link* untuk memulai unduhan. Misalnya kita mau mengunduh dari Youtube, otomatis konversi ke audio, dan lebih dari 200+ *website* lainnya secara otomatis.

#### [qBittorrent](https://www.qbittorrent.org/)

qBittorrent merupakan aplikasi *torrent* terbaik saat ini. Kita bisa menggunakan qBittorrent Web untuk dapat melakukan manajmen unduhan.

### Monitoring Tools

*Monitoring tools* merupakan aplikasi yang digunakan untuk memantau aktivitas server dan juga jaringan rumah. Sistem monitoring ini penting karena kita perlu memantau penggunaan CPU, memori, dan *disk* server.

#### [Portainer](https://www.portainer.io/)

Portainer merupakan aplikasi manajemen Docker dan Kubernetes berbasis web. Dengan menggunakan ini kita tidak perlu melakukan SSH ke server untuk menjalankan, menghapus, dan men-*debug* aplikasi pada server.

#### [Prometheus](https://prometheus.io/)

Prometheus merupakan *time series database* yang dirancang khusus untuk menyimpan data monitoring dan *metrics* server. Program ini merupakan standar industri untuk membangun *observability platform*, yaitu platform untuk melakukan monitoring sistem yang terintegrasi.

#### [Grafana](https://grafana.com/)

Grafana merupakan aplikasi visualisasi dan *dashboard* untuk monitoring sistem. Data yang sudah dikumpulkan dari Prometheus akan divisualisasikan menggunakan Grafana. Ritsu-Pi sudah dilengkapi banyak dasbor yang secara otomatis akan tersedia setelah proses instalasi.

#### [Node Exporter](https://github.com/prometheus/node_exporter)

Secara umum *exporter* adalah program/aplikasi yang dapat mengambil metrik dari suatu komponen sistem dan mengirimkan metrik tersebut ke Prometheus. *Node exporter* merupakan aplikasi untuk mengumpulkan informasi mengenai penggunaan CPU, memori, *disk*, dan lain sebagainya dan mengirimkannya ke Prometheus. Dari sini kita bisa memantau bagaimana kondisi server secara *real-time*.

#### [cAdvisor Exporter](https://github.com/google/cadvisor)

cAdvisor merupakan aplikasi untuk memonitor penggunaan CPU, memori, dan *disk* untuk Docker. Jika *node exporter* berfungsi untuk memonitor sistem secara keseluruhan, cAdvisor digunakan untuk memonitor tiap-tiap *container* yang aktif sehingga kita bisa melihat dengan rinci aplikasi apa yang paling banyak menggunakan sumber daya sistem.

#### [Blackbox Exporter](https://github.com/prometheus/blackbox_exporter)

*Blackbox exporter* adalah *exporter* Prometheus yang digunakan untuk melakukan *probing* ke *endpoint* melalui protokol HTTP(s), DNS, TCP, ICMP, dan gRPC. Mungkin agak membingungkan, tapi program ini akan kita gunakan untuk melakukan *HTTP request* ke beberapa *website* seperti Google untuk mengecek konektivitas internet. Jika *request* tersebut gagal, berarti ada masalah koneksi internet (Indihome😭) sehingga kita bisa tau kondisi internet dan jika ada masalah, seberapa masalah internet tersebut berlangsung.

#### [Mikrotik Exporter](https://github.com/akpw/mktxp)

Sesuai namanya, *Mikrotik exporter* berfungsi untuk mengirimkan metrik dari Mikrotik ke Prometheus. Tentu saja kita bisa menggunakan Winbox untuk melihat status mikrotik, tapi kita tidak akan mendapatkan data historis karena Winbox hanya menampilkan data terbaru saja. Dengan menggunakan *exporter* ini, kita bisa melihat aktivitas router Mikrotik secara *real-time* dan juga data historisnya.

#### [Speedtest Exporter](https://github.com/MiguelNdeCarvalho/speedtest-exporter)

Sesuai namanya, *exporter* ini terintegrasi dengan Speedtest.net untuk mengukur kecepatan unduh/unggah jaringan rumah dari server. Data dari *exporter* ini penulis pernah gunakan sebelumnya untuk melakukan analisis kecepatan Indihome pada artikel sebelumnya.

*Exporter* ini sifatnya opsional tapi sangat disarankan untuk dipasang untuk memberikan kita *insight* mengenai server kita.

## Selanjutnya: Provision Server🦄

Sampai di sini kita sudah melakukan perencanaan, apa saja fitur yang akan kita bangun pada server dan aplikasi apa saja yang diperlkukan untuk mencapai tujuan tersebut. Pada artikel selanjutnya penulis akan memaparkan mengenai Ansible, yaitu program untuk melakukan otomasi proses *provisioning* infrastruktur dan bagaimana cara mengakses server yang sudah dibuat.

Sampai jumpa lagi nanti!
