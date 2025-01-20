---
title: 'Membuat Link Shortener di CloudFlare Workers⛅'
categories: Tutorial
tags: [cloud, backend, javascript, typescript, cloudflare]
date: 2024-01-01
---

{{< button content="Soure Code & Deploy" icon="brand-github" href="https://github.com/Kodesiana/pendekin" >}}

Halo teman-teman, ini adalah artikel pertama penulis di tahun 2024! Pada artikel kali ini penulis akan berbagi mengenai pengalaman penulis menggunakan CloudFlare Worker dengan studi kasus membuat *link shortener* dengan Worker dan KV.

## Short Link🔗

*Short link* merupakan layanan untuk memperpendek tautan/*link*/URL dengan cara membuat tautan baru dengan domain pendek yang nantinya akan mengarahkan ke alamat tujuan. *Short link* merupakan salah satu pilihan ketika kita ingin mengirim tautan/*link* di media sosial yang biasanya memiliki batasan panjang konten seperti Twitter/X. Kita mungkin sudah cukup familiar dengan layanan seperti Bit.ly, s.id, atau TinyURL. Selain untuk memperpendek tautan, beberapa layanan *short link* juga bisa membantu kita untuk membuat *microsite*, misalnya LinkTree.

Biasanya layanan *link shortener* memiliki beberapa fitur utama yaitu:

1. Memperpendek tautan dan membuat *custom slug* (URL khusus)
2. Laporan statistik tautan, misalnya berapa banyak tautan dibuka
3. Manajemen tautan (membuat/menghapus tautan)

Nah pada artikel kali ini, kita akan coba membuat *link shortener* dengen tiga fungsi utama di atas menggunakan CloudFlare Worker dan KV.

## CloudFlare Worker⛅

CloudFlare Worker merupakan layanan *serverless compute* yang bisa kita gunakan untuk men-*deploy* aplikasi *backend* tanpa perlu memikirkan *hosting*. Pada artikel sebelumnya penulis pernah membahas mengenai [Jamstack dan Serverless](http://localhost:1313/post/mengenal-jamstack-dan-serverless/) dan pada artikel ini kita akan lihat bagaimana implementasinya untuk membuat sebuah aplikasi *link shortener*.

> Selanjutnya penulis akan menyingkat istilah menjadi Worker dan KV

Secara umum Worker tersedia secara global dan gratis untuk semua pengguna CloudFlare. Maka dari itu, jika teman-teman belum punya akun CloudFlare, silakan daftar dahulu! Layanan Worker ini tersedia gratis dengan batasan 100.000 invokasi per hari, berarti 100.000 kali di *hit* per hari sebelum kita harus *upgrade* ke versi Pro.

## Membuat Worker⚙️

Pada artikel ini kita akan menggunakan bahasa pemrograman TypeScript untuk membuat *backend*-nya. Selain itu kita akan menggunakan `itty-router` untuk membantu *routing* API dan `zod` untuk memvalidasi *payload*. Mungkin teman-teman lebih familiar dengan `express` tapi sayangnya Express tidak didukung pada Worker.

Untuk membuat *project* Worker baru, caranya jalankan perintah `npm create cloudflare@latest` kemudian ikuti petunjuk dari Wrangler untuk mengatur nama proyek dan lainnya.

Karena fitur yang akan dibuat lumayan banyak, kita akan menggunakan kode yang sudah penulis buat dan teman-teman bisa akses melalui tombol di bagian atas artikel. Kita akan mulai perjalanan kita dari `wrangler.toml`.

### `wrangler.toml`

`wrangler.toml` berisi konfigurasi Worker yang akan kita *deploy*. Pada proyek ini kita perlu menambah dua pengaturan baru, yaitu `kv_namespaces` dan `vars`.

- `kv_namespaces` berisi *binding* antara Worker dan KV berdasarkan ID. Untuk membuat ID KV, kita bisa menjalankan perintah `npx wrangler kv:namespace create NAMA_KV`
- `vars` berisi *environment variable* yang bersifat publik. Jika kita ingin menyimpan *secrets*, Worker memiliki konfigurasi terpisah pada file `.dev.vars`

Buat dua *KV namespace*, yaitu `SHORT_URLS` untuk menampung *slug* atau URL pendek dan URL panjangnya beserta `SHORT_URL_STATS` untuk menyimpan statistik *slug* yang di hit, total sukses, dan total *error*.

Selain itu, set juga `HOST_URL` yang merupakan alamat Worker dan `HOMEPAGE_URL` yaitu alamat yang akan dialihkan jika ada *user* yang mengakses `HOST_URL` tanpa *slug*. Perlu dicatat bahwa `HOST_URL` akan kita dapatkan ketika Worker sudah di-*deploy* atau ketika kita menggunakan *custom domain*. Sementara ini bisa diisikan *localhost* saja atau ikuti contoh penulis.

```toml
name = "kodesiana-pendekin"
main = "src/index.ts"
compatibility_date = "2023-12-23"

kv_namespaces = [
  { binding = "SHORT_URLS", id = "1268ed17e5864c38b6ccaf7e36332127" },
  { binding = "SHORT_URL_STATS", id = "4ed2362d1a2d417eb1226dae2f71ddf1" }
]

[vars]
HOST_URL = "https://l.kodesiana.com"
HOMEPAGE_URL = "https://www.kodesiana.com"
```

Contoh di atas merupakan konfiguasi yang penulis pakai, silakan disesuaikan dengan kebutuhan teman-teman!

### `index.ts`

Berkas ini merupakan *entry point* aplikasi kita ketika pertama kali dijalankan oleh Worker. Secara umum berkasi ini berisi *routing* yang kita sudah cukup familiar jika kita pernah menggunakan `express` atau sejenisnya.

### `middleware.ts`

Berkas ini berisi *middleware* untuk melakukan autentikasi sederhana yaitu membandingkan *API key* yang sudah disimpan sebagai *secret* pada Worker sebagai kunci akses untuk membuat, menghapus, dan melihat statistik data. Ini memang bukan cara yang optimal untuk melakukan autentikasi tetapi ini sudah cukup untuk *use case* kita.

### `kv.ts`

Berkas ini berisi beberapa fungsi bantuan (*helper functions*) untuk mengambil URL dari KV dan menambah data statistik. Nah perlu diingat nih teman-teman, KV memiliki konsistensi dengan jaminan *eventual consistency*, sehingga apabila data pada KV diakses pada *data center* yang berbeda secara bersamaan, ada kemungkinan akan terjadi *race condition*. Tetapi pada *use case* ini penulis tidak masalah dengan adanya kemungkinan inkonsistensi data, karena tujuan utama untuk membuat *short link* sudah tercapai dan fitur statistik bersifat *nice to have*.

Tetapi jika teman-teman ingin memiliki hasil statistik yang akurat, maka teman-teman bisa mencoba menggunakan Durable Object untuk menyimpan data statistik. Tetapi sayangnya Durable Object merupakan layanan berbayar, sehingga pembahasannya di luar dari artikel ini.

### `routes.ts`

Berkas ini berisi fungsi-fungsi yang dapat di-*hit* melalui *host* Worker kita atau lokasi API kita diimplementasikan. Secara umum logika yang penulis buat tidak terlalu rumit dan terdapat komentar yang cukup *explanatory* pada kode. Tetapi kode untuk membuat *slug* akan sedikit penulis ulas karena disinilah ide utama bagaimana *short link* dapat dibuat.

Potongan kode pertama yang akan kita bahas adalah proses validasi *payload* menggunakan `zod`. Pada bagian awal fungsi kita membuat skema Zod yang bisa menerima `slug` berupa *string* dan `url` yang akan dipendekkan.

`slug` bersifat opsional yang berarti kita bisa membuat *slug* sendiri atau kita bisa menggunakan *slug* acak seperti halnya kita membuat URL menggunakan *bit.ly*. Jika proses validasi gagal, maka kita akan mengembalikan pesan *error*.

> Catatan: pada bagian ini penulis menggunakan `req.content` bukan `req.json()` karena penulis menggunakan *middleware* `withContent` pada `index.ts`. *Middleware* ini akan memanggil `req.json()` dan menyimpan hasilnya pada *field* `content`. Kenapa? Karena pada Worker kita hanya boleh memanggil `req.json()` **satu kali**, jika kita perlu memanggil data atau memanipulasi data pada *body*, maka kita harus men-*cache*-nya dulu agar kita tidak memanggil `req.json()` lebih dari sekali, maka dari itu penulis memilih untuk menggunakan *middleware* `withContent`.

```ts
const CreateSchema = z.object({
  slug: z.string().trim().max(100).optional(),
  url: z.string().url(),
});

// load data
const parsed = CreateSchema.safeParse(req.content);
if (!parsed.success) {
  return json(
    { message: "Invalid request", error: parsed.error },
    { status: HTTP_STATUS_CODES.BAD_REQUEST }
  );
}
```

Nah bagian ini adalah bagian yang paling menarik yaitu proses untuk membuat *string* acak sebagai *slug*. Pada implementasi ini penulis menggunakan fungsi `Math.random` untuk membangkitkan bilangan acak dan memanggil `toString(36)` pada hasil angka acak untuk mengonversi angka menjadi *string* (ingat terdapat 36 karakter alfabet) dan penulis ingin mengambil enam karakter awal saja sebagai *slug*.

Perhatikan operator `||` pada variabel *slug*, artinya penulis mengambil *slug* yang sudah diinputkan jika ada atau membangkitkan *slug* baru jika belum ada. Pada blok `else` penulis juga menggunakan perulangan `while` untuk mengecek apakah `slug` tersebut sudah tersimpan pada KV atau belum.

Kenapa perlu `while`? Karena *slug* yang dibuat adalah acak, **mungkin** ada kasus di mana kita akan mendapatkan *slug* yang sama dengan yang tersimpan pada KV.

*Ga mungkin lah!*

Ingat teori probabilitas, semakin banyak data yang kita simpan pada KV maka semakin besar pula kemungkinan kita **mungkin** akan mendapatkan *slug* yang sama sehingga kita perlu memastikan pada perulangan `while` bahwa jika terjadi mendapatkan *slug* yang sama, kita perlu membuat *slug* baru.

```ts
// check if the slug already exists
let slug = data.slug || "";
if (data.slug) {
  const url = await getUrl(data.slug, env);
  if (url) {
    return json(
      { message: "Slug already exists" },
      { status: HTTP_STATUS_CODES.CONFLICT }
    );
  }
} else {
  // generate a slug if one doesn't exist
  slug = Math.random().toString(36).slice(2, 8);

  // check if the slug is available
  while (await getUrl(slug, env)) {
    slug = Math.random().toString(36).slice(2, 8);
  }
}
```

Oke sepertinya sudah cukup sedikit penjelasan penulis mengenai logika pembuatan *slug* dan sisanya teman-teman bisa cek pada repositori GitHub ya.

## Deploy🚀

Oke sekarang kita sudah sampai di tahap terakhir yaitu *deployment*. Untuk *deploy* proyek ini sebenarnya sangat sederhana, ikuti langkah-langkah berikut.

1. *Clone* repositori yang terdapat pada bagian awal artikel.
2. `npm install`
3. `npx wrangler login` kemudian login dengan akun CloudFlare kamu
4. Buat dua *KV namespace* dengan cara `npx wrangler kv:namespace create SHORT_URLS` dan `npx wrangler kv:namespace create SHORT_URL_STATS`, catat ID nya
5. Buka berkas `wrangler.toml` kemudian ganti ID yang ada dengan ID baru yang kamu dapatkan dari tahap 4
6. Ganti juga isi `HOST_URL` dan `HOMEPAGE_URL` sesuai kebutuhan
7. Buat berkas `.dev.env` kemudian tambahkan satu baris `AUTH_KEY=key-here` sebagai *API key* untuk membuat, menghapus, dan melihat statistik data
8. Setelah semuanya siap, jalankan `npm run deploy`

Setelah proses *deploy*, teman-teman akan melihat Worker pada dasbor CloudFlare.

![CloudFlare worker dashboard](https://assets.kodesiana.com/posts/2024/short-link/workers-dash_comp.png)

Sekarang teman-teman bisa meng-*import* *Postman collection* yang penuli sudah buatkan juga di repositori GitHub.

Contoh membuat *short link*:

```bash
curl --location 'https://some-worker.dev/short_links' \
--header 'Content-Type: application/json' \
--header 'Authorization: API-Key api-key-here' \
--data '{
    "slug": "source-pendekin",
    "url": "https://github.com/Kodesiana/pendekin"
}'


Response:
{
  "slug": "source-pendekin",
  "url": "https://github.com/Kodesiana/pendekin"
}
```

Setelah *short link* berhasil dibuat, ketika teman-teman membuka laman misalnya `https://l.kodesiana.com/source-pendekin` maka teman-teman akan diarahkan ke halaman GitHub. Masih ada beberapa API lain yang bisa teman-teman coba di Postman, silakan bereksplorasi!

## Penutup🔗

Ternyata tidak sulit ya untuk membuat aplikasi *backend* menggunakan Worker. Fleksibilitas yang ditawarkan Worker dan akses gratisnya yang lumayan besar bisa menjadi alternatif untuk membuat API yang *low-cost* dan *high performance*. Selain itu karena layanan ini bersifat *serverless*, kita tidak perlu pusing memikirkan *hosting* dan *scale* karena semuanya sudah diatur oleh CloudFlare.

Selain itu kita juga telah berhasil menggunakan KV, salah satu jenis basis data non-relasional untuk menyimpan data URL dan statistiknya dengan mudah. Dengan ketersediaan global, kombinasi antara Worker dan KV bisa menyajikan API dengan waktu respons sekitar ~1 ms.

Kita akan ketemu lagi nanti dengan pembahasan yang lebih menarik!

## Referensi📚

1. https://github.com/Kodesiana/pendekin
2. https://workers.cloudflare.com/
3. https://developers.cloudflare.com/workers/
