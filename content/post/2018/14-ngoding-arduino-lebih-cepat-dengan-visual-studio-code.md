---
title: Ngoding Arduino Lebih Cepat dengan Visual Studio Code🔰
categories: Tips
tags: ['arduino', 'programming']
date: 2018-12-30
slug: ngoding-arduino-lebih-cepat-dengan-visual-studio-code
---

Arduino IDE merupakan *integrated development environment* yang paling umum digunakan untuk memprogram board seperti
Arduino dan turunannya. Arduino IDE ini merupakan program resmi dari Arduino LLC. dan mendapat *full support*. Selain
itu, di dunia pemrograman belakangan ini muncul pesaing baru yaitu **Visual Studio Code** (lebih akrab disebut VSCode).
VSCode merupakan editor dari Microsoft berbasis Electron dengan dukungan kode dan ekstensi yang sangat banyak.

VSCode banyak disukai karena memiliki tampilan yang dapat dikustomisasi dan memiliki banyak ekstensi yang menawarkan
banyak fitur yang menarik. VSCode sangat populer sebagai editor untuk web seperti HTML, CSS, JavaScript, dan TypeScript.
Tetapi siapa sangka, Microsoft telah merilis ekstensi agar VSCode dapat memprogram Arduino juga melalui ekstensi
**Arduino**.

## Apa itu Arduino IDE dan Visual Studio Code

Arduino IDE merupakan IDE resmi dari Arduino LLC untuk memprogram board-nya, Arduino. Visual Studio Code merupakan *code
editor* besutan Microsoft yang berbasis Electron dengan dukungan berbagai kode dan juga ekstensi. Seperti yang sudah
dijelaskan sebelumnya, Microsoft telah merilis ekstensi untuk menyediakan IDE untuk board Arduino dari VSCode.

## Instalasi Arduino + VSCode

Ekstensi Arduino untuk VSCode ini merupakan *binding* untuk Arduino IDE. Jadi Arduino IDE tetap harus terpasang agar
dapat digunakan bersama dengan Visual Studio Code.

### Instalasi Arduino IDE

1. Buka laman https://www.arduino.cc/en/main/software.
2. Klik **Windows Installer** kemudian tunggu proses unduh.
3. Buka file installer, kemudian pasang seperti biasa.

### Instalasi Visual Studio Code

1. Buka laman https://code.visualstudio.com/.
2. Klik **Download for Windows** kemudian tunggu proses unduh.
3. Buka file installer, kemudian pasang seperti biasa.

Untuk mendapatkan kemudahan penggunaan VSCode, sangat disarankan agar Anda belajar beberapa teknis dasar penggunaan
VSCode seperti JSON, *hot key*, dan *Emmet abbreviations*. Pada artikel kali ini *hot key* yang akan digunakan adalah
Command Pallete yang dapat diakses dengan cara menekan tombol **CTRL+SHIFT+P**.

## Konfigurasi VSCode + Arduino

Langkah pertama adalah memasang ekstensi Arduino untuk VSCode.

1. Buka Visual Studio Code kemudian klik menu **Extension**.
2. Cari ekstensi dengan kata kunci **Arduino** kemudian klik **Install**.
3. Tunggu proses instalasi, kemudian klik **Reload**. VSCode akan di restart dan ekstensi Arduino sudah siap digunakan.

Saat ini VSCode sudah dapat digunakan untuk membuat program untuk board Arduino. Tahap awal adalah uji coba, yaitu
memuat program yang paling sederhana yaitu Blink ke board Arduino.

### Memuat Program Blink

VSCode bekerja menggunakan sistem *workspace* yang berupa folder. Buat folder kosong dengan nama **ArduinoBlink**.
Kemudian klik *File > Open Folder* untuk memilih folder baru tersebut. Setelah *workspace* siap, buka *Command Pallete*
kemudian ketikan perintah **Arduino: Initialize**.

Setelah itu, VSCode akan meminta untuk proyek. Masukkan nama **ArduinoBlink** kemudian tekan Enter. Selanjutnya Anda
akan diminta untuk memilih jenis board yang akan digunakan, pada percobaan kali ini penulis akan menggunakan Arduino
Uno. Ketikkan *Arduino/Genuino* kemudian pilih **Arduino/Genuino Uno**. Pada tahap ini Anda sudah dapat mulai membuat
kode. Salin kode di bawah ini ke editor.

```cpp
void setup()
{
    pinMode(LED_BUILTIN, OUTPUT);
}

void loop()
{
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
    digitalWrite(LED_BUILTIN, LOW);
    delay(1000);
}
```

Sebelum melakukan *upload* kode, Anda harus memilih port untuk upload. Hubungkan board Arduino dengan komputer
menggunakan kabel USB, kemudian pada *status bar* di bagian kanan bawah, klik **<Select Serial Port>**. *Command
Pallete* akan terbuka dan menyediakan pilihan port yang tersedia, pada contoh ini board Arduino terdeteksi pada COM3.

Buka kembali *Command Pallete*, kemudian jalankan perintah **Arduino: Upload**. Tunggu proses upload kode. Jika proses
berjalan lancar, maka LED pada board Arduino akan menyala dan mati tiap satu detik.

## Simpulan

Apa yang telah penulis paparkan di atas merupakan permulaan kecil untuk menggunakan VSCode untuk membuat program untuk
board Arduino. Masih banyak fitur lain seperti *built-in board, library manager, debugger* dan lainnya. Pada artikel
selanjutnya penulis akan membuat sebuah program berbasis Internet of Things dengan board Arduino Uno dan ESP8266 dengan
server ThingSpeak.

Sampai jumpa di artikel selanjutnya!
