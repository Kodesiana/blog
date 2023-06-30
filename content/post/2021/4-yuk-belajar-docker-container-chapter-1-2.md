---
title: Yuk Belajar Docker Container!🐳 Chapter 1 & 2
categories: Programming
tags: [cloud, tips, programming, tutorial]
date: 2021-09-02
slug: yuk-belajar-docker-container-chapter-1-2
---

Docker merupakan salah satu teknologi yang sekarang marak digunakan untuk *mendeploy* atau mendistribusikan aplikasi
yang terisolasi dalam sebuah kontainer. Sebagian *provider cloud* seperti Azure, AWS, dan GCP sudah menawarkan layanan
Docker ini sejak cukup lama sebagai salah satu *killer feature* bagi *developers*.

Apa sih Docker itu dan bagaimana cara kerjanya?

![Gambar](https://source.unsplash.com/jOqJbvo1P9g)

Sebelum memulai, teman-teman sebaiknya meng-install Docker terlebih dahulu.

Untuk menginstall Docker pada sistem operasi Windows, kamu bisa menggunakan WSL 2 (*Windows Subsystem for Linux 2*) dan
*Docker for Windows*. Ikuti tutorial berikut:

- [Install WSL on Windows 10](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
- [Install Docker Desktop on Windows](https://docs.docker.com/desktop/windows/install/)

## Chapter 1 - Docker Fundamentals

Pada sebuah proses pengembangan perangkat lunak (SDLC), setiap *developer* pasti akan melakukan poses *deployment* untuk
mengirimkan program yang sudah dibuat agar bisa digunakan oleh pengguna, bisa melalui *setup installer*, upload ke
hosting, atau metode *deployment* lain. Sering kali, proses *deployment* tersebut rentan akan terjadinya *error*,
umumnya **it works on my machine**, saat dicoba di komputer sendiri, programnya bisa *running*, sedangkan saat di
server, program tersebut *error*.

Kasus lain, mungkin teman-teman *developers* ingin mendistribusikan aplikasi khususnya *backend service* agar bisa
digunakan dengan mudah oleh *developers* lain atau untuk memudahkan proses instalasi agar tidak perlu menginstall
*dependencies* seperti runtime (C#, NodeJS, PHP, Go, dll.) dan *packages* lainnya.

Di sini Docker hadir menghadirkan solusi untuk dua masalah umum di atas. Docker merupakan ekosistem platform yang
menghadirkan solusi kontainer untuk memudahkan proses *deployment* aplikasi melalui *container* dan *images*.

Tentu Docker memiliki banyak fitur lain yang akan kita bahas di artikel yang akan datang.

Ekosistem Docker terdiri atas beberapa komponen, yaitu:

- Docker Client
- Docker Server
- Docker Machine
- Docker Hub
- Docker Compose

Terdapat dua konsep utama dalam Docker, yaitu **image** dan **container**. **Image** adalah *blueprint* atau rancangan
yang berisi aplikasi dan segala *dependency* yang dibutuhkan, sedangkan **container** merupakan bentuk konkrit dari
*image* yang merepresentasikan *instance* aplikasi yang berjalan.

Secara umum, *developers* akan menggunakan Docker Client untuk mengeksekusi perintah ke Docker Server atau yang biasa
disebut sebagai Docker Daemon. Jadi, *container* yang kita buat akan berjalan di dalam Docker Server dan bukan di Docker
Client!

### Docker 101 - How Docker Run Things

Hmm, gimana caranya Docker bisa menjalankan aplikasi kita di dalam *container?*

Secara umum, kita bisa ambil flow seperti berikut:

1. Kita mengeksekusi perintah untuk menjalankan *container* melalui Docker Client
2. Perintah tersebut akan diterima oleh Docker Server dan akan dieksekusi di Docker Machine
3. Docker Server akan mencari *image* dari *container* yang akan kita jalankan melalui *registry*, misalnya Docker Hub.
4. *Container* siap berjalan!

Dengan menggunakan teknik ini, aplikasi kita akan berjalan di dalam *container* yang terisolasi sehingga semua kebutuhan
aplikasi kita bisa dipenuhi sesuai dengan *image* yang kita buat. Mirip seperti menjalankan aplikasi di dalam VM!

### Docker 101 - Docker Container v.s. Virtual Machine

Secara garis besar jika kita lihat konsep *container* dan VM itu mirip, sama-sama menyajikan isolasi untuk mengeksekusi
aplikasi kita. Tetapi terdapat perbedaan penting yang membedakan *Docker container* dengan *virtual machine*!

![cgroup](https://blob.kodesiana.com/kodesiana-public-assets/posts/2021/4/system-calls.png)

Pada sebuah VM, OS dijalankan di atas hypervisor yang akan membagi-bagi *resource host* ke VM. Pada VM, 100% semua fitur
OS akan dijalankan oleh hypervisor. Pada *container*, Docker akan menerjemahkan *system calls* dari *binary* aplikasi
secara langsung di atas Linux VM sehingga menghilangkan *overhead* untuk memvirtualkan *resources* pada *host*.

tl;dr;

- *VM = heavy, bulky, full featured OS, slow to deploy*
- *Container = lightweight, miminalistic, fast to deploy*

### Docker 101 - Linux Alpine Image

Linux Alpine merupakan distribusi Linux dengan ukuran yang sangat kecil dan cocok digunakan untuk *deploy* aplikasi.
Distribusi Linux ini memiliki sedikit *package* sehingga ukurannya kecil dan sangat fleksibel untuk dikustomisasi.
Sebagian besar *image* Docker publik seperti NodeJS, Python, dan lainnya menggunakan *image* ini sebagai dasarnya.

Cek Linux Alpine: <https://www.alpinelinux.org/>

## Chapter 2 - Docker CLI

Docker CLI (command-line interface) merupakan sebuah *tool* untuk dapat mengakses fitur-fitur pada Docker. Kita bisa
membuat *image*, menjalankan *container*, dan lainnya.

Sekarang kita akan belajar beberapa perintah pada Docker yang teman-teman *developers* bisa coba di komputer
masing-masing. Jangan lupa install Docker dan WSL 2 jika teman-teman menggunakan OS Windows.

### docker run

Perintah ini berfungsi untuk menjalankan sebuah *image* menjadi sebuah *container*.

Sintaks: `docker run <container name> [command]`

Contoh: `docker run alpine echo Saya Fahmi!`

Catatan! parameter `[command]` bersifat opsional!

### docker start

Perintah ini mirip seperti `docker run`, perbedaannya pada perintah ini *standard output* dan *standard error* tidak
adan di *redirect*, sehingga setelah menjalankan perintah ini *container* akan berjalan tanpa memberikan output apa pun
dari dalam *container*, melainkan perintah ini akan memberikan *contianer ID* yang menunjukkan *container* yang
*running* pada Docker.

Sintaks: `docker start <container ID>`

### docker ps

Perintah ini digunakan untuk *list* semua *container* yang *running* pada Docker. Untuk menampilkan *container* dalam
kondisi berhenti, bisa dengan menggunakan *option* `--all`.

Sintaks: `docker ps [--all]`

### docker system prune

Perintah ini berfungsi untuk menghapus semua *image* dan *container* yang tidak berjalan. Selain perintah
`docker system prune`, kita bisa menggunakan perintah `docker rm` untuk menghapus *image* dan *container* satu-persatu.

Sintaks: `docker system prune`

### docker stop/kill

Perintah ini digunakan untuk menghentikan *container* yang sedang berjalan. Terdapat dua variasi perintah ini yaitu
`stop` dan `kill`. Pada perintah `docker stop`, Docker akan memberikan sinyal `SIGINT` dan `SIGTERM` untuk memberitahu
aplikasi yang *running* di dalam *container* untuk berhenti, bisa kita analogikan seperti meng-klik tombol *close* pada
Window. Sedangkan `docker stop` akan mengirimkan sinyal `SIGKILL` ke aplikasi untuk menghentikan aplikasi secara paksa.

Sintaks: `docker stop <container ID>` dan `docker kill <container id>`

Nah konsep ini akan menjadi sangat penting nih, khususnya untuk menciptakan aplikasi yang mampu melakukan **graceful
shutdown**. Apa itu? Kita akan bahas di artikel yang akan datang :D Untuk belajar lebih lanjut mengenai *termination
signals*, teman-teman bisa cek:

- [Termination Signals](https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html)
- [How Linux Signals Work: SIGINT, SIGTERM, and SIGKILL](https://www.cloudsavvyit.com/11072/linux-signals-hacks-definition-and-more/)

### docker exec

Perintah ini berfungsi untuk menjalankan perintah tambahan di dalam *container* yang sudah berjalan. Misalnya kita ingin
menjalankan perintah tambahan ke dalam *container* atau ingin membuka *shell/terminal* di dalam *container* untuk
menjalankan perintah tertentu.

Sintaks: `docker exec <container ID> <command>`

Contoh menjalankan peritah non-interaktif:

`docker exec dsad3qe4ad echo Saya Fahmi!`

Contoh menjalankan perintah interaktif:

`docker exec -it dsad3qe4ad sh`

Apa perbedaan mode non-interaktif dan interaktif? Saat menggunakan mode non-interaktif, perintah yang dieksekusi akan
dijalankan dan dikembalikan outputnya ke dalam terminal tanpa menerima input dari terminal, sedangkan pada mode
interaktif kita bisa memberikan input pada terminal.

tl;dr; *Interactive mode* akan me-*redirect standard input* pada terminal.

## Learn More

Teman-teman bisa belajar lebih lanjut mengenai Docker dan Kubernetes yang akan dibahas di Innovation Day Telkom!
<https://innovationday.ddbtelkom.id/id020921/>

Nantikan lanjutan dari seri Docker dan Kubernetes lainnya!

Terima kasih!
