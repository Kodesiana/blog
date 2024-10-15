---
title: Arduino sebagai USB Serial Progammer🔌
categories: [Hacks, Software Engineering]
tags: ['arduino', 'programming', 'tips']
date: 2018-12-31
slug: arduino-sebagai-usb-serial-programmer
---

Salah satu metode komunikasi yang didukung oleh Arduino adalah USB serial/UART. Arduino merupakan *prototyping board*
yang marak digunakan untuk membuat sistem kecil menggunakan mikrokontroler ATmega 328P. Terdapat banyak sekali modul
yang dapat digunakan bersama dengan Arduino yang membuat *board* ini semakin populer.

Admin mohon maaf karena tidak bisa posting artikel tentang IoT dan ESP8266 karena admin kehilangan modulnya :( Mungkin
di kesempatan selanjutnya admin akan posting!

Komunikasi serial ini memiliki banyak kelebihan seperti hanya menggunakan dua kabel (TX dan RX), kecepatan komunikasi
yang tinggi, dan banyak modul yang menggunakan metode komunikasi ini. Sebelum dapat menggunakan modul tersebut,
terkadang beberapa modul tertentu perlu melakukan konfigurasi terlebih dahulu sebelum dapat digunakan bersama dengan
Arduino.

Hal ini dapat dilakukan dengan menggunakan bantuan
**[USB to Serial/TTL Converter](https://www.sparkfun.com/products/11736)** yang biasanya menggunakan chip FTDI.
Konverter semacam ini sangat umum dipasaran dengan harga yang bervariasi. Tetapi jika Anda tidak mempunyai konverter
ini, Anda dapat menggunakan *board* Arduino sebagai koverter USB ke serial. *Board* Arduino memiliki adapter USB yaitu
chip ATmega16U2. Dengan memanfaatkan fitur ini, kita dapat menggunakan Arduino sebagai konverter USB ke serial/TTL.

## Arduino USB Serial Pass Through

Metode yang akan digunakan kali ini adalah prinsip serial *pass through*. Idenya adalah meneruskan data dari
*HardwareSerial* ke perangkat lain menggunakan *SoftwareSerial*.

### Skema Breadboard

Pada contoh kali ini penulis akan menggunakan modul HC-05 dan Arduino UNO R3. Penulis ingin mengubah pengaturan HC-05
agar lebih mudah digunakan dengan Arduino. Hubungkan HC-05 pin RX ke 6 dan TX ke pin 7 pada Arduino.

> Catatan! Sebaiknya Anda menggunakan **logic level shifter** untuk mengubah TTL dari level 5v ke 3,3v. Hal ini
> diperlukan karena HC-05 menggunakan level TTL 3,3v. Jika Anda tidak mempunyai *level shifter*, Anda dapat menggunakan
> rangkaian resistor 1k dan 2k pada bagian RX ke HC-05. Selain itu, dapat dilihat bahwa PIN 6 adalah RX dari HC-05 dan
> PIN 7 adalah TX dari HC-05 (selalu ingat RX-->TX dan TX-->RX).

### Source Code

Setelah rangkaian terpasang, selanjutnya adalah memprogram Arduino untuk meneruskan data dari USB ke modul melalui PIN 6
dan 7. Salin kode di bawah ini ke Visual Studio Code.

Pada semua tutorial Arduino di Kodesiana.com, semuanya akan menggunakan Visual Studio Code dan bukan Arduino IDE. Tetapi
Anda tetap bisa menggunakan Arduino IDE dengan kode yang sama dari artikel ini! Baca artikel ini:
[Ngoding Arduino Lebih Cepat dengan Visual Studio Code](https://kodesiana.com/post/ngoding-arduino-lebih-cepat-dengan-visual-studio-code/).

```cpp
#include <SoftwareSerial.h>

SoftwareSerial _passthru(7, 6);

void setup()
{
    Serial.begin(9600);
    _passthru.begin(9600);
}

void loop()
{
    if (_passthru.available()) {
            Serial.write(_passthru.read());
    }
    if (Serial.available()) {
        _passthru.write(Serial.read());
    }
}
```

Upload kode di atas ke *board* Arduino. Anda mungkin perlu mengubah *baud rate* dari 9600 ke 38400 jika ini adalah
pertama kalinya Anda menggunakan HC-05 (AT mode).

### Serial Monitor

Setelah kode berhasil di upload, buka Command Pallete kemudian jalankan perintah berikut.

- **Arduino: Open Serial Monitor**, untuk membuka serial monitor.
- **Arduino: Change Baud Rate**, untuk mengubah *baud rate*. Pilih dari menu yang ditampilkan. Setelah itu, pada status
  bar klik **No line endings** kemudian ubah menjadi **Both NL & CR**.
- Arduino: Send Text to Serial Port, untuk mengirim perintah melalui serial. Ketikan perintah "AT" kemudian tekan Enter.
  Seharusnya akan muncul respon OK.

Sampai pada tahap ini Anda telah berhasil menggunakan Arduino sebagai konverter USB ke serial/TTL.
