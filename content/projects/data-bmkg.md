---
title: Data BMKG
description: Arsip data gempa bumi dan peringatan cuaca BMKG
date: 2025-12-13
comments: false
---

> Sistem **Data BMKG** dalam fase **Production**.

Arsip Data BMKG merupakan program pengarsipan data gempa bumi dan peringatan cuaca untuk keperluan penelitian dan riset khususnya di lingkungan kampus.

Sumber data: [Data Terbuka BMKG](https://data.bmkg.go.id)

## 🗃️ Akses Data

<p id="last-update">Terakhir diperbarui: </p>

<table>
    <thead>
        <tr>
            <th>Dataset</th>
            <th>Total Data</th>
            <th>Level</th>
            <th>Tipe Data</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="2">Gempa Terkini</td>
            <td rowspan="2" id="gempa-terkini">0</td>
            <td>Level 1</td>
            <td>
                <a class="link" href="https://blobs.kodesiana.com/kodesiana-data-open/_bmkg-data/gempa_terkini/gempa_terkini-L1.csv">CSV</a>,
                <a class="link" href="https://blobs.kodesiana.com/kodesiana-data-open/_bmkg-data/gempa_terkini/gempa_terkini-L1.jsonl">JSON Lines</a>
            </td>
        </tr>
        <tr>
            <td>Level 2</td>
            <td>CSV, JSON Lines, GeoPackage GeoJSON</td>
        </tr>
        <tr>
            <td rowspan="2">Gempa Dirasakan</td>
            <td rowspan="2" id="gempa-dirasakan">0</td>
            <td>Level 1</td>
            <td>
                <a class="link" href="https://blobs.kodesiana.com/kodesiana-data-open/_bmkg-data/gempa_dirasakan/gempa_dirasakan-L1.csv">CSV</a>,
                <a class="link" href="https://blobs.kodesiana.com/kodesiana-data-open/_bmkg-data/gempa_dirasakan/gempa_dirasakan-L1.jsonl">JSON Lines</a>
            </td>
        </tr>
        <tr>
            <td>Level 2</td>
            <td>CSV, JSON Lines, GeoPackage, GeoJSON</td>
        </tr>
        <tr>
            <td rowspan="2">Peringatan Cuaca</td>
            <td rowspan="2" id="peringatan-cuaca">0</td>
            <td>Level 1</td>
            <td>
                <a class="link" href="https://blobs.kodesiana.com/kodesiana-data-open/_bmkg-data/peringatan_cuaca/peringatan_cuaca-L1.csv">CSV</a>,
                <a class="link" href="https://blobs.kodesiana.com/kodesiana-data-open/_bmkg-data/peringatan_cuaca/peringatan_cuaca-L1.jsonl">JSON Lines</a>,
                <a class="link" href="https://blobs.kodesiana.com/kodesiana-data-open/_bmkg-data/peringatan_cuaca/peringatan_cuaca-L1.parquet">Parquet</a>
            </td>
        </tr>
        <tr>
            <td>Level 2</td>
            <td>JSON Lines, Parquet, GeoPackage</d>
        </tr>
    </tbody>
</table>

### ⚡ *Data Processing Level*

Arsip data yang disediakan terdiri atas dua level/tingkat pemrosesan, **Level 1** dan **Level 2**. Kedua tingkat pemrosesan memiliki sedikit perbedaan dari data asli BMKG sebagai berikut.

1. **Level 1**: Data yang mendekati 1 banding 1 dengan data asli BMKG dengan pemrosesan minimal
2. **Level 2**: Data dengan transformasi lebih lanjut dari Level 1 menjadi data spasial

Akses ke data Level 1 tersedia secara **bebas** dan **gratis**. Data diperbarui setiap hari Senin.

Akses ke data Level 2 dapat dilakukan dengan cara mengirimkan surel (email) ke alamat `fahmi@kodesiana.com` untuk meminta akses ke data terbaru. Selain itu, untuk akses ke data Level 2, Anda diharapkan untuk memberikan donasi sukarela (tidak ada minimum nilai donasi) untuk membantu menjaga agar program arsip data BMKG ini dapat terus aktif.

Donasi bisa dilakukan melalui **transfer bank** atau [Saweria](https://saweria.co/fahminlb33). Silakan menghubungi penulis melalui surel untuk informasi lebih lanjut.

## 📚 Keterangan Data (*Metadata*)

Setiap format data memiliki dukungan yang berbeda-beda untuk tipe data.

Tidak semua atribut data akan terdapat pada semua tipe data (CSV, JSON Lines, Parquet, GeoPackage, GeoJSON). Data paling lengkap terdapat pada tipe data JSON Lines, Parquet, dan GeoPackage. Data CSV, GeoPackage, dan GeoJSON mungkin memiliki lebih sedikit atribut data karena beberapa atribut yang memiliki jenis `array` yang tidak bisa direpresentasikan dalam format tersebut.

### Gempa Terkini

Atribute pada kedua level:

- `id` Kode unik untuk satu baris pengamatan
- `date_time` Tanggal kejadian gempa bumi dalam unit *Epoch milliseconds*
- `latitude` Koordinat lintang
- `longitude` Koordinat bujur
- `magnitude` Magnitudo gempa bumi
- `depth` Kedalaman gempa dalam kilometer

Atribut tambahan pada data Level 1:

- `region` Wilayah terdekat dengan lokasi episenter gempa bumi
- `felt` Wilayah yang merasakan gempa dalam skala MMI

Contoh data:

```json
{
    "id": "547ad536762396339f003bb1cc02895557f7fa5b4bb08bb67a952318f167dec0",
    "date_time": 1684690261000,
    "latitude": -1.12,
    "longitude": 120.23,
    "magnitude": 4.8,
    "depth": 5,
    "region": "Pusat gempa berada di darat 14 km Timur Laut Kamarora",
    "felt": "III - IV Palu, II-III Poso"
}
```

Atribute pada data Level 2:

- `terrain` Diturunkan dari atribut `region`, lokasi gempa (`sea`/`land`/`unknown`)
- `distance` Diturunkan dari atribut `region`, jarak ke episenter gempa bumi dalam kilometer ke lokasi daratan
- `direction` Diturunkan dari atribut `region`, arah mata angin ke episenter gempa bumi
- `location` Diturunkan dari atribut `region`, lokasi daratan terhadap episenter gempa bumi
- `felt_parsed` (GeoJSON) Diturunkan dari `felt`, sebagai `array` berisi objek `scale` (MMI) dan `location`
- `felt_formatted` (GeoPackage) Diturunkan dari `felt`, sama seperti `felt_parsed` tetapi dalam bentuk `string`

Perbedaan atribut `felt` dengan `felt_parsed` dan `felt_formatted` adalah konsistensi antara skala dan lokasi gempa dirasakan.

Contoh data:

```json
{
    "id": "547ad536762396339f003bb1cc02895557f7fa5b4bb08bb67a952318f167dec0",
    "date_time": 1684690261000,
    "latitude": -1.12,
    "longitude": 120.23,
    "magnitude": 4.8,
    "depth": 5,
    "felt_formatted": "III-IV,Palu II-III,Poso",
    "felt_parsed": [
        {
            "scale": "III-IV",
            "location": "Palu"
        },
        {
            "scale": "II-III",
            "location": "Poso"
        }
    ],
    "terrain": "land",
    "distance": 14.0,
    "direction": "timur laut",
    "location": "Kamarora"
}
```

### Gempa Dirasakan

Atribut pada kedua level:

- `id` Kode unik untuk satu baris pengamatan
- `date_time` Tanggal kejadian gempa bumi dalam unit *Epoch milliseconds*
- `latitude` Koordinat lintang
- `longitude` Koordinat bujur
- `magnitude` Magnitudo gempa bumi
- `depth` Kedalaman gempa dalam kilometer

Atribut pada data Level 1:

- `region` Wilayah terdekat dengan lokasi episenter gempa bumi
- `potential` Potensi tsunami karena gempa bumi

Contoh data:

```json
{
    "id": "e9a778df986f9198e5da3a3bd88f1169a27f88cded9acc910d95524acb0d0e6c",
    "date_time": 1684730723000,
    "latitude": -6.53,
    "longitude": 129.16,
    "magnitude": 5.1,
    "depth": 10,
    "region": "235 km TimurLaut MALUKUBRTDAYA",
    "potential": "Tidak berpotensi tsunami"
}
```

Atribut pada data Level 2:

- `tsunami_potential` Potensi tsunami karena gempa bumi (*boolean*)
- `distance` Diturunkan dari atribut `region`, jarak ke episenter gempa bumi dalam kilometer ke lokasi daratan
- `direction` Diturunkan dari atribut `region`, arah mata angin ke episenter gempa bumi
- `location` Diturunkan dari atribut `region`, lokasi daratan terhadap episenter gempa bumi

Contoh data:

```json
{
    "id": "e9a778df986f9198e5da3a3bd88f1169a27f88cded9acc910d95524acb0d0e6c",
    "date_time": 1684730723000,
    "latitude": -6.53,
    "longitude": 129.16,
    "magnitude": 5.1,
    "depth": 10,
    "tsunami_potential": false,
    "distance": 235.0,
    "direction": "timur laut",
    "location": "MALUKUBRTDAYA"
}
```

### Peringatan Cuaca

Atribut pada kedua level:

- `id` Kode unik untuk satu baris pengamatan
- `sent_at` Waktu peringatan dikirim
- `effective_at` Waktu mulai peringatan dini
- `expires_at` Waktu berakhir peringatan dini
- `event` Jenis kejadian peringatan dini
- `urgency` Urgensi respon terhadap peringatan dini
- `severity` Tingkat keparahan kejadian cuaca
- `certainty` Tingkat kepastian peringatan dini
- `web` Infografis peringatan dini yang menampilkan peta dan tingkat keparahan
- `area_name` Nama wilayah terdampak peringatan dini
- `polygons` Poligon wilayah terdampak peringatan dini

Contoh data:

```json
{
    "id": "2.49.0.1.360.0.2025.12.01.15.19.005",
    "sent_at": 1764603600000,
    "effective_at": 1764604800000,
    "expires_at": 1764615600000,
    "event": "Hujan Lebat dan Petir",
    "urgency": "Immediate",
    "severity": "Moderate",
    "certainty": "Observed",
    "web": "https:\/\/nowcasting.bmkg.go.id\/infografis\/CBB\/2025\/12\/01\/infografis.jpg",
    "area_name": "Kep. Bangka Belitung",
    "polygons": [
        "-1.760,105.391 -1.776,105.421 -1.790,105.466 ...",
        "-1.906,105.249 -1.940,105.261 -1.966,105.266 ..."
    ]
}
```

Atribut pada data Level 2:

- `prep_duration` Selisih durasi antara waktu peringatan dini dikirim dan waktu efektif
- `alert_duration` Selisih durasi antara waktu efektif dan waktu berakhir
- `regions` Nama-nama wilayah yang terdampak peringatan dini
- `len_regions` Banyaknya wilayah yang terdampak
- `len_polygons` Banyaknya poligon wilayah yang terdampak

Pada tipe data GeoPackage, atribut `polygons` tidak lagi terdapat pada data atribut, melainkan menjadi data vektor.

Contoh data:

```json
{
    "id": "2.49.0.1.360.0.2025.12.01.15.19.005",
    "sent_at": 1764603600000,
    "event": "Hujan Lebat dan Petir",
    "urgency": "Immediate",
    "severity": "Moderate",
    "certainty": "Observed",
    "effective_at": 1764604800000,
    "expires_at": 1764615600000,
    "web": "https:\/\/nowcasting.bmkg.go.id\/infografis\/CBB\/2025\/12\/01\/infografis.jpg",
    "area_name": "Kep. Bangka Belitung",
    "prep_duration": 20.0,
    "alert_duration": 180.0,
    "regions": [
        "Mentok",
        "Simpang Teritip"
    ],
    "len_regions": 2,
    "len_polygons": 2
}
```

## 📌 Sitasi

Jangan lupa untuk memberikan sitasi sebagai bentuk atribusi dari kebermanfaatan data BMKG dan Kodesiana.

1. BMKG. [tahun sekarang]. BMKG Open Data. https://data.bmkg.go.id
2. Fiqri, Fahmi Noor. [tahun sekarang]. Arsip Data BMKG. https://kodesiana.com/projects/data-bmkg

<script>
    document.addEventListener("DOMContentLoaded", async (event) => {
        const res = await fetch("https://blobs.kodesiana.com/kodesiana-data-open/_bmkg-data/last_update.json");
        const body = await res.json()

        const lastUpdateElem = document.getElementById("last-update");
        lastUpdateElem.textContent = `Terakhir diperbarui: ` + new Date(body.last_update * 1000).toLocaleString();

        document.getElementById("gempa-terkini").textContent = body.gempa_terkini;
        document.getElementById("gempa-dirasakan").textContent = body.gempa_dirasakan;
        document.getElementById("peringatan-cuaca").textContent = body.peringatan_cuaca;
    });
</script>
