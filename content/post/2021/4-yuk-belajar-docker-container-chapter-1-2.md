---
title: Yuk Belajar Docker Container!🐳 Chapter 1 & 2
category: Programming
tags: [cloud, tips, programming, tutorial]
date: 2021-09-02
slug: yuk-belajar-docker-container-chapter-1-2
---

Docker merupakan salah satu teknologi yang sekarang marak digunakan untuk _mendeploy_ atau
mendistribusikan aplikasi yang terisolasi dalam sebuah kontainer. Sebagian _provider cloud_
seperti Azure, AWS, dan GCP sudah menawarkan layanan Docker ini sejak cukup lama sebagai
salah satu _killer feature_ bagi _developers_.

Apa sih Docker itu dan bagaimana cara kerjanya?

![](https://source.unsplash.com/jOqJbvo1P9g)

Sebelum memulai, teman-teman sebaiknya meng-install Docker terlebih dahulu.

Untuk menginstall Docker pada sistem operasi Windows, kamu bisa menggunakan WSL 2 (_Windows
Subsystem for Linux 2_) dan _Docker for Windows_. Ikuti tutorial berikut:

- [Install WSL on Windows 10](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
- [Install Docker Desktop on Windows](https://docs.docker.com/desktop/windows/install/)

## Chapter 1 - Docker Fundamentals

Pada sebuah proses pengembangan perangkat lunak (SDLC), setiap _developer_ pasti akan melakukan
poses _deployment_ untuk mengirimkan program yang sudah dibuat agar bisa digunakan oleh pengguna,
bisa melalui _setup installer_, upload ke hosting, atau metode _deployment_ lain. Sering kali,
proses _deployment_ tersebut rentan akan terjadinya _error_, umumnya **it works on my machine**,
saat dicoba di komputer sendiri, programnya bisa _running_, sedangkan saat di server, program
tersebut _error_.

Kasus lain, mungkin teman-teman _developers_ ingin mendistribusikan aplikasi khususnya _backend service_
agar bisa digunakan dengan mudah oleh _developers_ lain atau untuk memudahkan proses instalasi agar
tidak perlu menginstall _dependencies_ seperti runtime (C#, NodeJS, PHP, Go, dll.) dan _packages_ lainnya.

Di sini Docker hadir menghadirkan solusi untuk dua masalah umum di atas. Docker merupakan ekosistem
platform yang menghadirkan solusi kontainer untuk memudahkan proses _deployment_ aplikasi melalui
_container_ dan _images_.

Tentu Docker memiliki banyak fitur lain yang akan kita bahas di artikel yang akan datang.

Ekosistem Docker terdiri atas beberapa komponen, yaitu:

- Docker Client
- Docker Server
- Docker Machine
- Docker Hub
- Docker Compose

Terdapat dua konsep utama dalam Docker, yaitu **image** dan **container**. **Image** adalah _blueprint_
atau rancangan yang berisi aplikasi dan segala _dependency_ yang dibutuhkan, sedangkan **container**
merupakan bentuk konkrit dari _image_ yang merepresentasikan _instance_ aplikasi yang berjalan.

Secara umum, _developers_ akan menggunakan Docker Client untuk mengeksekusi perintah ke Docker Server atau
yang biasa disebut sebagai Docker Daemon. Jadi, _container_ yang kita buat akan berjalan di dalam Docker
Server dan bukan di Docker Client!

### Docker 101 - How Docker Run Things

Hmm, gimana caranya Docker bisa menjalankan aplikasi kita di dalam _container?_

Secara umum, kita bisa ambil flow seperti berikut:

1. Kita mengeksekusi perintah untuk menjalankan _container_ melalui Docker Client
2. Perintah tersebut akan diterima oleh Docker Server dan akan dieksekusi di Docker Machine
3. Docker Server akan mencari _image_ dari _container_ yang akan kita jalankan melalui _registry_, misalnya Docker Hub.
4. _Container_ siap berjalan!

Dengan menggunakan teknik ini, aplikasi kita akan berjalan di dalam _container_ yang
terisolasi sehingga semua kebutuhan aplikasi kita bisa dipenuhi sesuai dengan _image_
yang kita buat. Mirip seperti menjalankan aplikasi di dalam VM!

### Docker 101 - Docker Container v.s. Virtual Machine

Secara garis besar jika kita lihat konsep _container_ dan VM itu mirip, sama-sama
menyajikan isolasi untuk mengeksekusi aplikasi kita. Tetapi terdapat perbedaan penting
yang membedakan _Docker container_ dengan _virtual machine_!

![](https://blob.kodesiana.com/kodesiana-public-assets/posts/2021/4/system-calls.png)

Pada sebuah VM, OS dijalankan di atas hypervisor yang akan membagi-bagi _resource host_
ke VM. Pada VM, 100% semua fitur OS akan dijalankan oleh hypervisor. Pada _container_,
Docker akan menerjemahkan _system calls_ dari _binary_ aplikasi secara langsung di atas Linux VM sehingga menghilangkan _overhead_ untuk memvirtualkan _resources_ pada _host_.

tl;dr;

- _VM = heavy, bulky, full featured OS, slow to deploy_
- _Container = lightweight, miminalistic, fast to deploy_

### Docker 101 - Linux Alpine Image

Linux Alpine merupakan distribusi Linux dengan ukuran yang sangat kecil dan cocok digunakan
untuk _deploy_ aplikasi. Distribusi Linux ini memiliki sedikit _package_ sehingga ukurannya
kecil dan sangat fleksibel untuk dikustomisasi. Sebagian besar _image_ Docker publik
seperti NodeJS, Python, dan lainnya menggunakan _image_ ini sebagai dasarnya.

Cek Linux Alpine: https://www.alpinelinux.org/

## Chapter 2 - Docker CLI

Docker CLI (command-line interface) merupakan sebuah _tool_ untuk dapat mengakses
fitur-fitur pada Docker. Kita bisa membuat _image_, menjalankan _container_, dan lainnya.

Sekarang kita akan belajar beberapa perintah pada Docker yang teman-teman _developers_
bisa coba di komputer masing-masing. Jangan lupa install Docker dan WSL 2 jika teman-teman
menggunakan OS Windows.

### docker run

Perintah ini berfungsi untuk menjalankan sebuah _image_ menjadi sebuah _container_.

Sintaks: `docker run <container name> [command]`

Contoh: `docker run alpine echo Saya Fahmi!`

Catatan! parameter `[command]` bersifat opsional!

### docker start

Perintah ini mirip seperti `docker run`, perbedaannya pada perintah ini _standard output_
dan _standard error_ tidak adan di _redirect_, sehingga setelah menjalankan perintah ini
_container_ akan berjalan tanpa memberikan output apa pun dari dalam _container_, melainkan
perintah ini akan memberikan _contianer ID_ yang menunjukkan _container_ yang _running_
pada Docker.

Sintaks: `docker start <container ID>`

### docker ps

Perintah ini digunakan untuk _list_ semua _container_ yang _running_ pada Docker. Untuk
menampilkan _container_ dalam kondisi berhenti, bisa dengan menggunakan _option_ `--all`.

Sintaks: `docker ps [--all]`

### docker system prune

Perintah ini berfungsi untuk menghapus semua _image_ dan _container_ yang tidak berjalan.
Selain perintah `docker system prune`, kita bisa menggunakan perintah `docker rm` untuk
menghapus _image_ dan _container_ satu-persatu.

Sintaks: `docker system prune`

### docker stop/kill

Perintah ini digunakan untuk menghentikan _container_ yang sedang berjalan. Terdapat dua
variasi perintah ini yaitu `stop` dan `kill`. Pada perintah `docker stop`, Docker akan
memberikan sinyal `SIGINT` dan `SIGTERM` untuk memberitahu aplikasi yang _running_ di dalam
_container_ untuk berhenti, bisa kita analogikan seperti meng-klik tombol _close_ pada
Window. Sedangkan `docker stop` akan mengirimkan sinyal `SIGKILL` ke aplikasi untuk
menghentikan aplikasi secara paksa.

Sintaks: `docker stop <container ID>` dan `docker kill <container id>`

Nah konsep ini akan menjadi sangat penting nih, khususnya untuk menciptakan aplikasi yang
mampu melakukan **graceful shutdown**. Apa itu? Kita akan bahas di artikel yang akan datang
:D Untuk belajar lebih lanjut mengenai _termination signals_, teman-teman bisa cek:

- [Termination Signals](https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html)
- [How Linux Signals Work: SIGINT, SIGTERM, and SIGKILL](https://www.cloudsavvyit.com/11072/linux-signals-hacks-definition-and-more/)

### docker exec

Perintah ini berfungsi untuk menjalankan perintah tambahan di dalam _container_ yang
sudah berjalan. Misalnya kita ingin menjalankan perintah tambahan ke dalam _container_
atau ingin membuka _shell/terminal_ di dalam _container_ untuk menjalankan perintah
tertentu.

Sintaks: `docker exec <container ID> <command>`

Contoh menjalankan peritah non-interaktif:

`docker exec dsad3qe4ad echo Saya Fahmi!`

Contoh menjalankan perintah interaktif:

`docker exec -it dsad3qe4ad sh`

Apa perbedaan mode non-interaktif dan interaktif? Saat menggunakan mode non-interaktif,
perintah yang dieksekusi akan dijalankan dan dikembalikan outputnya ke dalam terminal tanpa
menerima input dari terminal, sedangkan pada mode interaktif kita bisa memberikan input
pada terminal.

tl;dr; _Interactive mode_ akan me-_redirect standard input_ pada terminal.

## Learn More!

Teman-teman bisa belajar lebih lanjut mengenai Docker dan Kubernetes yang akan dibahas
di Innovation Day Telkom! https://innovationday.ddbtelkom.id/id020921/

Nantikan lanjutan dari seri Docker dan Kubernetes lainnya!

Terima kasih!
