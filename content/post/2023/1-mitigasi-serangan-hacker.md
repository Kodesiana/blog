---
title: 'Mitigasi Serangan Hacker 101🐤'
category: Security
tags: [security, azure, cloud, internet]
date: 2022-10-18
slug: mitigasi-serangan-hacker
---

Serangan _hacker_ pada sistem digital baik itu web maupun API tidak dapat dihindari. Setiap hari, website mendapat usaha serangan dari berbagai penjuru dunia dengan berbagai tujuan mulai dari melumpuhkan sistem agar tidak dapat digunakan hingga mencuri data pengguna.

Pada artikel sebelumnya, penulis berbagai mengenai bagaimana salah satu subsistem dan pada artikel ini, penulis ingin berbagai mengenai bagaimana cara penulis melakukan pencegahan dan penanganan ketika terjadi usaha serangan pada sistem.

## 1️⃣ Sistem Selalu Publik

Saat kita men-_deploy_ aplikasi ke server dan kita mengatur DNS ke IP publik sistem kita, maka semua orang yang terhubung dengan internet dapat mengakses sistem tersebut. Sekali terekspos, akan sulit untuk menghilangkan jejak sistem dari internet, karena penulis yakin, pasti teman-teman akan mengutamakan SEO agar web yang kamu buat bisa ditemukan oleh user dengan mudah melalui mesin pencari.

Sistem mesin pencari inilah yang membuat sistem kita akan terekspos dan kita sering kali tidak bisa menghapus web kita dari internet, karena setiap mesin pencari pasti memiliki indeks internalnya masing-masing.

![](https://source.unsplash.com/Prc64NXW5JQ)

Pada kasus serangan ke subsistem Kodesiana yang penulis bahas pada artikel sebelumnya, sistem tersebut dibuat publik, tapi penulis menggunakan aturan `robots.txt` dan _blocker_ untuk _user agent_ bot, sehingga penulis **cukup yakin** sistem ini tidak akan bisa di indeks oleh mesin pencari.

Tim Kodesiana tidak pernah mempublikasikan alamat URL sub sistem ini kepada siapa pun selain _stakeholder_ dan tim internal Kodesiana.com. Bahkan, tim internal hanya mengakses _database_ melalui VPN dan akses ke komponen sistem di sisi Azure juga menggunakan **Virtual Network** dan **Private Endpoints**. Jadi, _human error_ di sisi tim Kodesiana bisa dibilang rendah dan vektor serangan mungkin dari sisi _stakeholder_.

Meskipun kita bisa melakukan WHOIS ke domain `kodesiana.com`, kecil kemungkinan untuk orang lain untuk dapat mengetahui subdomain sub sistem ini.

> Kenapa?

Domain kodesiana.com memiliki setidaknya 4 subdomain lain yang bisa diakses publik, tapi dari sistem monitoring, tidak ada _request_ yang masuk ke subdomain selain subdomain serangan ini. Temuan ini cukup aneh bagi penulis, jika benar penyerang ingin menerobos sistem Kodesiana, kenapa hanya dari satu subdomain saja? Kenapa tidak coba semua subdomain?

Apakah ini serangan terarah yang khusus menyerang sub sistem ini karena sistem ini kebetulan untuk **pemerintah**? Hmm🤔

Oke, cukup berspekulasi dan sekarang saatnya kita membahas bagaimana cara kita bisa mencegah dan apa yang bisa kita lakukan ketika serangan sedang atau sudah terjadi.

## 2️⃣ Sebelum Serangan

Pencegahan selalu lebih baik daripada mengobati.

Maka dari itu, sebagai _developer_ dan khususnya tim _cloud engineer_ perlu mengimplementasikan beberapa _practice_ untuk menjaga agar sistem yang dibuat dapat menghalau usaha serangan dan mengurangi kemungkinan adanya serangan.

### Logging, Tracing, dan Monitoring

_Logging, tracing,_ dan _monitoring_ [1] merupakan tiga jargon yang saat ini menjadi tiga pilar keamanan dan performa aplikasi, khususnya pada arsitektur _microservice_. Tiga komponen ini merupakan bagian dari _platform observability_.

Pada dasarnya, ketiga istilah tersebut merujuk pada satu proses yang sama, yaitu pencatatan, peringkasan, dan analisis pada data mengenai kondisi sistem.

- **Logging** adalah proses untuk mencatat kejadian (biasanya _error_) pada sistem. Hasil dari log ini biasanya berupa file atau dikirim ke sistem pengumpulan data seperti Elasticsearch dan Grafana Loki.
- **Tracing** adalah versi yang lebih spesifik dari _logging_, di mana _tracing_ tidak hanya mencatat suatu proses pada sistem, tetapi informasi yang lebih detail juga seperti berapa lama suatu fungsi dieksekusi, apa saja urutan eksekusinya, dan berbagai pencatatan lain dalam bentuk _trace_ dan _span_. Beberapa contoh layanan yang menyediakan fitur ini adalah Elastic APM dan DataDog.
- **Monitoring** sendiri merupakan istilah yang bisa merujuk pada _logging_ dan _tracing_, tetapi pada konteks ini, _monitoring_ adalah proses melakukan instrumentasi pada aplikasi dan infrastruktur yang bertujuan untuk mengumpulkan, meringkas, dan menganalisis metrik dari suatu sistem.

Jadi, bisa disimpulkan sistem _observability_ yang **proper** itu penting ya! Bukan hanya untuk melacak adanya serangan, tapi juga untuk melacak performa aplikasi melalui _APM (Application Performance Monitoring)_ dan _tracing_.

Banyak platform _monitoring_ yang bisa teman-teman coba seperti **Azure Application Insights** (digunakan juga oleh Kodesiana!), DataDog, dan Dynatrace. Dengan mengintegrasikan salah satu platform _observability_ ini, kita bisa mendapat banyak _insights_ mengenai aplikasi kita.

### Codebase dan Infrastruktur yang Aman

Selain penerapan sistem _observability_ untuk dapat mengamati bagaimana sistem bekerja di _production_, salah satu faktor yang penting dalam keamanan sistem adalah _codebase_ yang digunakan. Microsoft melaporkan bahwa ~70% masalah keamanan pada sistem Microsoft terkait pada codebase dan _memory safety_ [2], WordPress memiliki hingga 5.449 CVE (laporan _vulnerability_) yang dilaporkan [3], dan tahukah kamu kalau menginstall satu _npm package_, rata-rata kamu menginstall sebanyak 79 _package_ dari 39 _maintainer_ dan ini merupakan salah satu _attack surface_ yang besar [4].

Penulis yakin, teman-teman pasti menggunakan _library_ yang bersifat _open source_ untuk membuat sistem, tanpa disadari, terdapat banyak risiko keamanan yang bisa masuk ke dalam aplikasi kita jika kita tidak hati-hati dengan _library_ yang kita gunakan.

Tim Kodesiana sendiri menggunakan ASP.NET Core dan .NET 7 dan NuGet sebagai _package manager_. Sebelum menginstall suatu _library_, penulis selalu melakukan pengecekan apakah _library_ tersebut memiliki _vulnerability_, apakah masih aktif di-_maintain_, dan apakah ada komunitas yang menggunakan _library_ tersebut? Dari beberapa pertanyaan ini penulis dapat menghindari risiko penggunaan _library_ yang tidak jelas sumber dan kondisi keamanannya.

Penulis juga menggunakan layanan cloud Azure sebagai server aplikasi, dengan demikian semua aplikasi Kodesiana sudah dilindungi oleh **Azure Defender** dan ditambah dengan integrasi dengan **CloudFlare**, penulis dapat mengamankan dan memberikan pengalaman membaca yang lebih menyenangkan bagi pembaca blog Kodesiana.com. Dengan jaringan CDN dari CloudFlare, teman-teman bisa menikmati artikel di blog Kodesiana.com ini dengan lebih cepat!

![](https://source.unsplash.com/MziCjx-fVzs)

### Web Application Firewall (WAF)

_Firewall_ merupakan salah satu komponen pertahanan pada jaringan untuk memblokir akses yang tidak sah ke dalam suatu _host_ pada jaringan. Perbedaan _firewall_ biasa dengan WAF adalah di mana _firewall_ tersebut bekerja pada lapisan OSI. WAF bekerja pada _layer 7_ yaitu _application layer_, tepatnya pada protokol HTTP [5].

WAF dapat membaca isi _HTTP request_ untuk mencegah _cross-site forgery (CSRF), cross-site scripting (XSS), file inclusion,_ hingga _SQL injection_ dan berbagai serangan lain di lapisan aplikasi L7. Sehingga, sistem yang kita buat bisa lebih aman karena adanya WAF sebelum _traffic_ bisa masuk ke dalam aplikasi.

Apakah ini artinya kita harus punya fitur WAF ini di aplikasi kita juga atau kita harus menggunakan layanan terpisah untuk mendapatkan proteksi dari WAF?

Bergantung!

Kita bisa mengimplementasikan pertahanan seperti CSRF, XSS, CORS, dan berbagai validasi lain di sisi aplikasi kita, tapi kita jugaa bisa menggunakan layanan WAF seperti yang ditawarkan oleh CloudFlare. Jadi, mana yang lebih baik?

Opini penulis adalah menggunakan gabungan keduanya. Kita bisa menggunakan WAF dari CloudFlare untuk menghalau serangan sebelum bisa masuk ke dalam aplikasi kita dan di sisi aplikasi, kita tidak perlu mengulang proses pengecekan yang sudah dilakukan oleh WAF CloudFlare, kita bisa fokus ke validasi proses bisnis saja, sehingga aplikasi kita bisa lebih cepat memproses respons dan juga cepat merespons permintaan dari pengguna.

### Backup, Backup, Backup

_Backup_ mungkin merupakan salah satu hal yang kita sering lupa untuk disiapkan. Sering kali kita hanya fokus untuk men-_deploy_ aplikasi kita tapi lupa untuk mengatur _backup_.

_Backup_ ini sangat penting, karena di saat terjadi penerobosan ke dalam sistem, khususnya karena _ransomware_, berkas-berkas yang ada di dalam sistem kita bisa dienskripsi sehingga kita tidak bisa mengakses data tersebut. Selain itu, apabila ada kasus seseorang masuk ke dalam _database_ dan menghapus data-data di dalamnya, apa yang perlu kita lakukan?

> BACKUP & RESTORE!

Berbagai layanan _cloud_ saat ini memiliki layanan _backup_ yang sangat mudah untuk digunakan, cukup beberapa klik dan semua sistem kita bisa otomatis. Ya akan ada tambahan biaya untuk penyimpanan dan retensi _backup_, tapi harganya biasanya jauh lebih murah dibandingkan harus kehilangan akses ke data aplikasi kita.

### Site Reliability dan High Availability

_Site reliability_ merujuk pada berbagai teknik dan _tools_ yang digunakan untuk menjaga agar sistem digital dapat beroperasi dengan reliabel dan dapat memproses _request_ dari pengguna dengan baik [6]. _High availability_ adalah salah satu fitur dari _site reliability_ yaitu desain sistem yang mampu melayani banyak _request_ dan dapat tersedia/_available_ dengan _uptime_ yang tinggi.

Beberapa metode untuk mencapai _high availability_ adalah melalui pemrosesan terdistribusi, salah satunya adalah penggunaan Kubernetes dengan setidaknya _3 worker_ dan _2 control plane_. Selain itu, _cloud provider_ juga memiliki fitur seperti _load balancing, availability zone,_ dan berbagai fitur _reliability_ lain untuk menjaga agar aplikasi kita bisa tetap aktif dan melayani kebutuhan pengguna.

Kenapa _site reliability_ termasuk pada salah satu aspek keamanan?

Pernahkah kamu dengar tentang _Denial of Service (DoS)_ atau _Distributed Deinal of Service (DDoS?)_ merupakan usaha untuk melumpuhkan server melalui lonjakan jumlah _traffic_ ke server. Artinya, server tempat aplikasi dijalankan harus bisa menangani adanya lonjakan _traffic_ ini. Tentunya, meningkatkan skala server tidak akan menjadi solusi karena _attacker_ akan terus meningkatkan _traffic_ hingga server tidak dapat diakses yang artinya, biaya server juga akan terus naik tak terkendali. Maka dari itu, jangan lupa atur _firewall_ dan _rate limiting_ agar sistem kita tidak menjadi sasaran empuk DoS/DDoS.

## 3️⃣ Saat Serangan

Pada kasus serangan yang pernah penulis ceritakan pada artikel sebelumnya, kasus tersebut merupakan **kasus pertama yang didokumentasikan**. Setelah penulis melakukan audit pada CloudFlare dan Azure AppInsights, ternyata ada banyak serangan yang sebelumnya penulis tidak sadar terjadi. Untunglah dengan adanya proteksi dari CloudFlare dan Azure, sistem Kodesiana masih aman dan tidak ada indikasi kebocoran data.

Saat ini, jika sistem Kodesiana diserang, kita sudah memiliki aturan _step-by-step_ apa saja yang perlu dilakukan ketika ada serangan terjadi.

Perlu diingat bahwa arahan ini bukan berasal dari _cybersecurity expert_, tapi dari pengalaman dan artikel yang penulis baca. Jika teman-teman benar-benar serius dengan keamanan sistem, teman-teman harus punya tim _cybersecurity_ untuk menangani aspek keamanan sistem.

![](https://source.unsplash.com/mVhd5QVlDWw)

### Respons Cepat

Respons yang cepat dapat menjadi penentu apakah serangan akan berdampak kecil atau masif. Semakin cepat titik serangan bisa diidentifikasi dan dihentikan, semakin kecil kemungkinan sistem kita bisa ditembus.

Saat serangan terakhir ke subsistem Kodesiana, **kebetulan** penulis sedang membuka portal Azure. Setelah penulis mengetahui adanya serangan, penulis langsung melihat data _traffic_ CloudFlare dan Azure AppInsights untuk melihat aktivitas serangan.

Untungnya, karena serangan dilakukan dengan tools yang menargetkan sistem WordPress, sistem Kodesiana sama sekali tidak terpengaruh.

### Hubungi Cloud Provider atau Tim InfoSec

Saat dicurigai terjadi adanya serangan, Anda mungkin ingin menghubungi _customer service cloud provider_ untuk mendapatkan bantuan untuk menangani kasus tersebut. Sayangnya, opsi ini biasanya hanya tersedia apabila kamu punya langganan ke layanan _enterprise_.

### Aktifkan Firewall Agresif

Beberapa provider misalnya CloudFlare, memiliki fitur **panik**, misalnya fitur **I'm Under Attack** atau **Strict Firewall**. Fitur panik ini biasanya meningkatkan agresivitas _firewall_ dan pendeteksian aktivitas mencurigakan. Misalnya CloudFlare akan menampilkan _CAPTCHA_ apabila ada IP yang dianggap mencurigakan.

Ada banyak fitur-fitur lain yang bisa kita gunakan selain CloudFlare WAF Under Attack, misalnya Azure SIEM dan lain-lain.

### Shutdown Sistem

Pilihan terakhir saat terjadi serangan adalah mematikan akses ke aplikasi.

Apabila serangan terus-menerus terjadi ke dalam sistem dan sangat sulit untuk dapat menanggulangi serangan, mematikan akses ke luar sistem mungkin menjadi satu-satunya cara untuk mencegah kebocoran data yang lebih besar.

Perlu diingat bahwa opsi ini adalah *last resort*😿 Hanya lakukan apabila sudah tidak ada cara lain.

## 4️⃣ Setelah Serangan

Oke, kita sudah bahas mengenai cara mengamankan sistem sebelum terjadi serangan dan setelah terjadi serangan. Sekarang, serangan ke sistem sudah selesai dan pengguna ingin mengakses sistem kembali.

Apa yang perlu kita dilakukan?

![](https://source.unsplash.com/Bkci_8qcdvQ)

### Site Recovery

_Site recovery_ merupakan proses yang dilakukan untuk mengembalikan sistem yang _down_ karena adanya serangan maupun karena kegagalan sistem/_maintenance_ tak terduga. Apabila sistem kita ternyata berhasil dilumpuhkan melalui DoS/DDoS, berkas-berkas di enskripsi oleh _ransomware_, atau _load balancer_ pada zona aplikasi kita mati, _recovery_ perlu dilakukan untuk mengembalikan kondisi sistem agar bisa diakses kembali oleh pengguna.

Beberapa hal yang bisa dilakukan pada proses _recovery_ adalah:

1. _Restore database_
2. _Redeploy services_ di _region_ yang berbeda
3. Melakukan _patching_ dan _update_ sistem yang dicurigai memiliki kerentanan
4. Konfigurasi ulang _firewall_ dan _load balancer_ yang mengekspos sistem ke internet
5. Mengidentifikasi bagian kode yang _vulnerable_ dan melakukan perbaikan

### Audit Monitoring dan Log Sistem

Setelah sistem kita kembali pulih dari serangan dan kita sudah memblokir sumber serangan, saatnya melakukan audit,

- bagaimana penyerang bisa mengetahui titik kelemahan sistem?
- bagaimana penyerang memanfaatkan kelemahan sistem?
- apa saja data yang berhasil diekstrafilasi dari sistem?
- apa dampaknya bagi pengguna?
- bagaimana cara mencegah agar serangan ini tidak terjadi?

Untuk melakukan ini proses audit ini, pasti akan membutuhkan banyak waktu dan sumber daya, khususnya ahli _infosec_. Hasil analisis ini akan sangat berharga bagi tim _infosec_ dan _developer_ agar dapat mengembangkan sistem yang lebih aman dari serangan.

## ⭐ Simpulan

Wah banyak sekali ya yang sudah kita bahas😐

Intinya adalah, _infosec_ merupakan salah satu bidang IT yang sangat kompleks dan memiliki dampak yang sangat besar dan kritikal terhadap keberlangsungan sistem aplikasi. Selain itu, mengikuti anjuran _infosec_, kita bisa melakukan beberapa hal seperti mengimplementasi _monitoring_, menerapkan _web application firewall_, dan _tools_ lainnya untuk menguatkan sistem kita agar lebih sulit untuk diterobos.

Saat terjadi kasus penyerangan, kita bisa mengurangi potensi kerusakan yang lebih besar melalui peningkatan agresivitas _firewall_, meningkatkan keketatan _monitoring_, dan bahkan mematikan akses ke sistem.

Akhirnya, setelah serangan selesai, dapat dilakukan _recovery_ untuk mengembalikan kondisi sistem seperti semula agar pengguna bisa kembali menggunakan aplikasi. Selain itu, proses audit bisa dilakukan juga untuk menganalisis siapa, bagaimana, dan motif serangan melalui data dari sistem _monitoring_.

Yap! Cukup sekian untuk artikel kali ini. Semoga pembahasan kali ini bisa meningkatkan kewaspadaan dan kesadaran khususnya kita sebagai _developer_ untuk meningkatkan keamanan sistem aplikasi kita🫰

## ✏️ Referensi

1. Kidd, Chrissy. 2019. [Tracing vs Logging vs Monitoring: What’s the Difference?](https://www.bmc.com/blogs/monitoring-logging-tracing). Diakses 14 Janurai 2023.
2. Thomas, Gavin. 2019. [A proactive approach to more secure code](https://msrc-blog.microsoft.com/2019/07/16/a-proactive-approach-to-more-secure-code). Diakses 14 Januari 2023.
3. NVD. 2023. [WordPress CVE](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=wordpress). Diakses 14 Januari 2023.
4. Tal, Liran. 2022. [NPM security: preventing supply chain attack](https://snyk.io/blog/npm-security-preventing-supply-chain-attacks). Diakses 14 Januari 2023.
5. CloudFlare. 2023. [What is a Web Application Firewall (WAF?)](https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf). Diakses 14 Januari 2023.
6. RedHat. 2023. [What is SRE (site reliability engineering)](https://www.redhat.com/en/topics/devops/what-is-sre). Diakses 14 Januari 2023.
