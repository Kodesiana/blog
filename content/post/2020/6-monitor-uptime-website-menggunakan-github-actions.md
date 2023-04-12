---
title: Monitor Uptime Website menggunakan GitHub Actions🆗
category: Programming
tags: [nodejs, programming, tutorial, devops]
date: 2020-10-01
slug: monitor-uptime-website-menggunakan-github-actions
---

Uptime website merupakan salah satu hal yang menjadi elemen penting dalam pengembangan sebuah sistem. Selain itu, uptime juga merupakan salah satu nilai _market_ yang saat krusial untuk bisnis.

Khususnya dengan teknologi yang semakin berkembang ini, banyak sekali layanan DevOps seperti layanan CI/CD sudah menjadi bagian yang tidak bisa lepas dari _development pipeline_ suatu aplikasi.

Salah satu penyedia layanan _source control_ yaitu GitHub juga memiliki layanan CI yang dapat digunakan secara cuma-cuma (GitHub Actions) . Kamu bisa menggunakan CI ini untuk membuat _pipeline_ aplikasi kamu lebih _streamlined_.

GitHub Actions yang merupakan layanan CI, biasanya hanya digunakan untuk melakukan _build_ dan _test_ pada sistem aplikasi, tetapi, bagaimana jika GitHub Actions digunakan sebagai layanan untuk memonitor _uptime_ website atau API?

## GitHub Actions... untuk Functions?

![man sitting on bench](https://source.unsplash.com/C2SRmUGYxYE/1200x657)

Photo by [Simeon Jacobson](https://unsplash.com/@closed) on [Unsplash](https://unsplash.com/?utm_source=kodesiana&utm_medium=referral)

Mungkin terdengar asing, untuk apa kita menggunakan CI untuk memonitor uptime website? Jawabannya penulis beberapa pekan lalu mengikuti GitHub Actions Hackathon yang diselenggarakan oleh **dev.to**. Platform blogging dev.to mengadakan _hackathon_ untuk membuat inovasi unik dengan menggunakan GitHub Actions dan ini adalah submisi penulis.

Kamu bisa cek artikel ini pada **dev.to**
[https://dev.to/fahminlb33/service-uptime-monitor-using-github-actions-2egp](https://dev.to/fahminlb33/service-uptime-monitor-using-github-actions-2egp)

Kembali ke topik, bagaimana caranya layanan CI bisa digunakan untuk memonitor uptime? Sedangkan untuk monitoring uptime pasti dibutuhkan basis data untuk menyimpan hasil pengecekan uptime, solusinya?

Untungnya, GitHub punya semua tool yang dibutuhkan untuk mencapai tujuan ini!

- GitHub Repo, untuk menyimpan perubahan uptime.
- GitHub Actions, untuk mengecek dan menyimpan perubahan uptime.
- GitHub Pages, untuk menampilkan data uptime.

Mungkin ini pertama kalinya kamu mendapati penggunaan Git sebagai basis data dan CI sebagai CRON job. Yap, ide bisa muncul dari mana saja, yang penting kita bisa selalu kreatif menggunakan sumber daya yang kita miliki.

### Membuat repo

Pada tutorial ini kita akan menggunakan NodeJS sebagai backend yang nantinya akan mengecek website kita dan akan menyimpan riwayat _uptime_ website kita.

Kita akan menggunakan _library axios_ pada backed untuk melakukan _request_ ke server yang akan kita monitor dan _Vue.js_ sebagai framework untuk UI nya.

Anda bisa mengakses kode project ini pada repositori berikut.
[https://github.com/fahminlb33/playcourt-tricks](https://github.com/fahminlb33/playcourt-tricks)

### Membuat backend

Buat sebuah folder baru dan inisialisasi foldernya dengan package.json (seperti pada artikel [sebelumnya](https://kodesiana.com/post/membuat-invoice-pdf-menggunakan-nodejs/)). Kemudian install _library_ _axios_.

Pastikan file _package.json_ kamu terlihat seperti ini!

```json
{
  "name": "playcourt-tricks",
  "version": "1.0.0",
  "description": "",
  "main": "app/index.js",
  "scripts": {
    "start": "node app/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.20.0"
  }
}
```

Buat folder app, kemudian buat file _index.js_.

```js
const fs = require('fs');
const axios = require('axios').default;

// configs
const config = Object.freeze({
    maxIncidents: 6,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44'
});

const main = async () => {
   const monitoredUrls = JSON.parse(fs.readFileSync('data/monitored.json', 'utf-8'));
   const checkResult = [];
   const reqs = [];

    // run request
    console.log("Checking services...");
    for (let i = 0; i < monitoredUrls.length; i++)
    {
        const item = monitoredUrls[i];
        const opt = {
            url: item.uri,
            responseType: 'text',
            transformResponse: [],
            timeout: 1000 * 5,
            headers: {
                'User-Agent': config.userAgent
            }
        };

        console.debug(`Checking ${item.desc}, env: ${item.env}`);
        const req = axios(opt).then(response => {
            if (response.status >= 400 || !response.data || response.data.includes("Application is not available")) {
                checkResult.push({
                    ...item,
                    status: "error",
                    date: new Date().toISOString()
                });
            } else {
                checkResult.push({
                    ...item,
                    status: "ok",
                    date: new Date().toISOString()
                });
            }
        }).catch(_ => {
            checkResult.push({
                ...item,
                status: "error",
                date: new Date().toISOString()
            });
        });
        reqs.push(req);
    }

    await Promise.all(reqs);

    // load latest data
    console.log("Fetching last data...");
    const lastIncidentData = fs.readFileSync('data/last_incident.json', 'utf-8');
    let lastIncident;
    if (lastIncidentData)
    {
        lastIncident = JSON.parse(lastIncidentData);
    }
    else
    {
        lastIncident = {
            date: new Date().toISOString(),
            incident: "All monitored service is up.",
            status: "ok",
            services: []
        };
    }

    // save global result
    console.log("Checking latest incident...");
    const checkedOk = checkResult.filter(x => x.status === "ok").length;
    const lastOk = lastIncident.services.filter(service => service.status === "ok").length;
    if (checkedOk != lastOk) {
        lastIncident.date = new Date().toISOString();
    }

    if (lastOk != checkResult.length) {
        const repos = checkResult.filter(x => x.status === "error").map(y => `${y.desc}:${y.env}`);
        lastIncident.incident = `${repos.join(', ')} is down.`;
        lastIncident.status = "error";
    } else {
        lastIncident.incident = `All monitored service is up.`;
        lastIncident.status = "ok";
    }

    // save services status
    console.log("Saving incidents...");
    checkResult.forEach(item => {
        const currentServiceIndex = lastIncident.services.findIndex(x => x.desc == item.desc && x.env == item.env);
        const currentService = lastIncident.services[currentServiceIndex\];
        if (!currentService)
        {
            lastIncident.services.push({
                desc: item.desc,
                env: item.env,
                status: item.status,
                incidents: [
                    {
                        date: item.date,
                        status: item.status
                    }
                ]
            });
        }
        else
        {
            const currentServiceLastIncident = currentService.incidents[0];
            currentService.status = item.status;
            if (currentServiceLastIncident.status !== item.status)
            {
                if (lastIncident.services[currentServiceIndex].incidents.length >= config.maxIncidents)
                {
                    lastIncident.services[currentServiceIndex].incidents.pop();
                }

                lastIncident.services[currentServiceIndex].incidents.unshift({
                    date: item.date,
                    status: item.status
                });
            };
        }
    });

    // save updated data
    console.log("Serializing...");
    fs.writeFileSync('data/last_incident.json', JSON.stringify(lastIncident, null, 2));
}


// bootstrap
main().catch(error => console.error(error));
```

Kode di atas akan melakukan beberapa proses berikut:

1. Membaca data website apa saja yang akan dimonitor pada file _monitored.json_.
2. Melakukan _HTTP request_ ke URI yang dibaca dari file JSON.
3. Menyimpan hasil pengecekan ke file _last_incident.json_.

Selanjutnya kamu harus mendefinisikan URI mana yang akan dimonitor oleh sistem ini. Buat folder _data_, kemudian buat file _monitored.json_.

```json
[
  {
    "uri": "https://kodesiana.com",
    "desc": "Kodesiana",
    "env": "production"
  }
]
```

Nah file ini nantinya akan menyimpan URI mana saja yang akan dicek dan dimonitor. Tambahkan semua URI yang ingin kamu cek di sini.

Untuk backend hanya sampai di sini. Selanjutnya kamu akan setting GitHub Actions agar mengeksekusi kode ini setiap lima menit. Waktu ini merupakan batas minimum untuk jadwal eksekusi kode pada CI.

Buat folder _.github/workflows_, kemudian buat file _node.js.yml_.

```yaml
name: Node.js CI

on:
  workflow\_dispatch:
  schedule:
    - cron: '*/5 * * * *'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: 12.x
      - run: npm install
      - run: npm start
      - name: Commit and push if changed
        run: |
          git add .
          git diff
          git config --global user.email "github-action-bot@example.com"
          git config --global user.name "GitHub Action Bot"
          git commit -m "Updated incident" -a || echo "No changes to commit"
          git push
```

Workflow di atas akan mengeksekusi _npm install_ dan _npm start_, setelah itu workflow ini akan mengeksekusi kode untuk melakukan _commit_ perubahan yang baru disimpan ke dalam git.

### Membuat frontend

Seperti yang sudah disebutkan sebelumnya, bahwa pada frontend kita akan menggunakan Vue.js dan juga Bulma CSS untuk mempercantik tampilan webnya.

Buat file _index.html_ pada root folder kamu, kemudian salin kode berikut.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Playpocalypse - Playcourt Tricks</title>

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.0/css/bulma.min.css"
      integrity="sha512-ADrqa2PY1TZtb/MoLZIZu/Z/LlPaWQeDMBV73EMwjGam43/JJ5fqW38Rq8LJOVGCDfrJeOMS3Q/wRUVzW5DkjQ=="
      crossorigin="anonymous"
    />
  </head>

  <body>
    <div id="app">
      <div class="container">
        <section class="hero">
          <div class="hero-body">
            <div class="container has-text-centered">
              <h1 class="title is-spaced">DAYS SINCE PLAYCOURT TRICKS</h1>
              <div class="columns">
                <div class="column is-2 is-offset-2"></div>
                <div class="column is-1">
                  <p class="subtitle is-1">{{ clock?.days }}</p>
                  <p class="subtitle is-6">DAYS</p>
                </div>
                <div class="column is-1">
                  <p class="subtitle is-1">{{ clock?.hours }}</p>
                  <p class="subtitle is-6">HOURS</p>
                </div>
                <div class="column is-1">
                  <p class="subtitle is-1">{{ clock?.minutes }}</p>
                  <p class="subtitle is-6">MINUTES</p>
                </div>
                <div class="column is-1">
                  <p class="subtitle is-1">{{ clock?.seconds }}</p>
                  <p class="subtitle is-6">SECONDS</p>
                </div>
              </div>

              <h2 class="subtitle mt-4">Latest incident:<br />{{ incident }}</h2>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="container">
            <h2 class="title has-text-centered mb-6">Services</h2>

            <table class="table is-fullwidth">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Environment</th>
                  <th>Incidents</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="service in services">
                  <td>{{ service.desc }}</td>
                  <td>
                    <span
                      class="tag"
                      v-bind:class="{ 'is-success': service.status === 'ok', 'is-danger': service.status === 'error' }"
                      >{{ service.status }}</span
                    >
                  </td>
                  <td>{{ service.env }}</td>
                  <td>
                    <ul v-for="incident in service.incidents">
                      <li>{ { prettyDate(incident.date) } }, { { statusToMessage(incident.status) } }</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>

    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/js/all.min.js"
      integrity="sha512-YSdqvJoZr83hj76AIVdOcvLWYMWzy6sJyIMic2aQz5kh2bPTd9dzY3NtdeEAzPp/PhgZqr4aJObB3ym/vsItMg=="
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.20.0/axios.min.js"
      integrity="sha512-quHCp3WbBNkwLfYUMd+KwBAgpVukJu5MncuQaWXgCrfgcxCJAq/fo+oqrRKOj+UKEmyMCG3tb8RB63W+EmrOBg=="
      crossorigin="anonymous"
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="static/app.js"></script>
  </body>
</html>
```

Kode di atas merupakan frontend web yang nantinya akan menampilkan waktu uptime/downtime terakhir web yang dimonitor.

Selanjutnya buat file _static/app.js_.

```js
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

var app = new Vue({
    el: '#app',
    data: {
        clock: null,
        date: null,
        incident: null,
        services: null,
        updateTimer: null
    },
    methods: {
        updateData() {
            const opt = {
                url: "data/last_incident.json?nokey=" + Math.random() \* 1000,
                responseType: "json",
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            };
            axios(opt).then(response => {
                const latestData = response.data;
                this.date = new Date(latestData.date);
                this.incident = latestData.incident;
                this.services = latestData.services;

                this.updateTimer = setInterval(() => {
                    let now = new Date().getTime();
                    let distance = now - this.date;
                    this.clock = prettyClock(distance);
                }, 1000);
            });
        },

        statusToMessage(status) {
            return status === "ok" ? "Service is up" : "Service is down";
        },

        prettyDate(date) {
            return new Date(date).toLocaleString();
        }
    },
    created () {
        this.updateData();
    },
    beforeDestroy () {
        clearInterval(this.updateTimer)
    },
});

function prettyClock(distance) {
    return {
        days:  Math.floor(distance / (day)),
        hours: Math.floor((distance % (day)) / (hour)),
        minutes: Math.floor((distance % (hour)) / (minute)),
        seconds: Math.floor((distance % (minute)) / second)
    };
}
```

Kode di atas merupakan kode untuk membaca data dari file _last_incident.json_ yang terdapat pada repositori yang nantinya akan menyimpan program ini.

### Push sistem ke GitHub

Setelah kamu memiliki semua file yang dibutuhkan, jangan lupa untuk commit semua kode Anda dan push ke repositori GitHub kamu. Untuk memastikan apakah Actions yang sudah dibuat terdeteksi oleh GitHub Actions, klik tab Actions pada menu repositori.

Jika menu ini sudah tampil, artinya sistem kamu sudah terdaftar pada GitHub Actions dan akan segera dieksekusi. Tunggu 10-15 menit untuk peluncuran pertama kali. Jika _pipeline_ tidak kunjung aktif, klik _Run workflow > Run workflow_ untuk menjalankan _workflow_ secara manual.

Siip! Sekarang kamu sudah memiliki web yang dapat memonitor _uptime_ website atau API kamu setiap lima menit sekali, bahkan tanpa perlu menyewa hosting dan layanan cloud berbayar!

## Rekomendasi: UptimeRobot

Tutorial yang dijelaskan di atas hanya merupakan _hack_ atau lebih tepatnya proyek iseng untuk memanfaatkan sistem yang ada untuk kebutuhan lain. Jika dilihat dari sisi bisnis, kamu pasti butuh laporan yang lebih mendalam mengenai _downtime_ yang terjadi di aplikasi kamu, tidak hanya sekadar waktu kapan terjadinya _downtime_.

Maka dari itu penulis sangat menyarankan layanan dari UptimeRobot. Layanan ini merupakan penyedia monitoring _uptime_ website atau API yang sudah penulis gunakan sangat lama. Layanan ini juga memiliki versi gratis yang bisa langsung kamu pakai dengan hanya mendaftar di website-nya.

![](https://imgur.com/a/ERblQPB)

Dasbor UptimeRobot.

Dengan UptimeRobot kamu bisa melihat riwayat _downtime_ dan juga laporan _time series_ kapan terjadi _downtime_, waktu respons server, dan bisa memonitor lebih dari satu URI.

Overall, layanan yang sangat bagus dengan fitur dasar yang sesuai dengan kebutuhan. Give it a try!

Semoga artikel kali ini bermanfaat ya teman-teman! **#NgodingItuMudah**
