---
title: Menampilkan Data dari PBX menggunakan C#📞
category: Programming
tags: [programming, tutorial, tips]
date: 2018-04-11
slug: menampilkan-data-dari-pbx-menggunakan-csharp
---

> Source code: [https://github.com/Kodesiana/Post-Samples/tree/master/PBXListener](https://github.com/Kodesiana/Post-Samples/tree/master/PBXListener)

PBX merupakan salah satu alat yang lazim digunakan untuk mengatur panggilan dalam suatu jaringan telefon. PBX dapat digunakan untuk merekam aktivitas telefon. Selain itu, PBX dapat melakukan logging data melalui antarmuka serial (RS-232/TTL). Antarmuka serial ini dapat digunakan untuk membuat program yang dapat berkomunikasi dengan PBX, yang dalam contoh ini penulis menggunakan bahasa pemprograman C# dan VB.NET.

Sebagian besar _programmer_ awam tidak mengetahui bagaimana cara menerima data dari _serial_ kemudian menampilkannya pada program. Menurut pengamatan penulis, kebanyakan _programmer_ kesulitan melakukan koneksi _serial_ ke PBX dan kesulitan untuk melakukan _parsing_ pada data yang telah diterima agar data yang diterima dapat diolah.

## Mengenal PBX dan Serial Communication

**PBX** (singkatan dari **Private Branch Exchange**) merupakan penyedia layanan telepon yang melayani pertukaran telepon dengan pusat di dalam suatu perusahaan, dan menjadi penghubung antara telepon dari publik ke telepon perusahaan atau jaringan telepon dari perusahaan ke anak perusahaan lainnya di area yang lebih luas atau untuk publik.\[1\]

**_Serial_** merupakan salah satu metode komunikasi data di mana hanya satu bit data yang dikirimkan melalui seuntai kabel pada suatu waktu tertentu.\[2,3\] Komunikasi serial dapat dilakukan menggunakan berbagai jenis kabel, misalnya USB dan RS-232.

Diagram alur PBX dengan komputer melalui _serial_:

```
Telefon ----> PBX <-----> RS-232 Serial <-----> Komputer
```

## Interfacing PBX Panasonic KX-T616

Pada artikel ini penulis menggunakan PBX Panasonic KX-T616 sebagai contoh. PBX Panasonic ini menggunakan parameter _serial_ sebagai berikut. Perlu diperhatikan bahwa konfigurasi port dapat berbeda pada setiap model.

| Pengaturan | Nilai    |
| ---------- | -------- |
| Baud rate  | 9600     |
| Data bits  | 8        |
| Parity     | One      |
| Handshake  | XON/XOFF |
| DTR        | On       |
| RTS        | On       |

Berdasarkan data pada Tabel 1 di atas, penulis dapat melakukan koneksi menggunakan aplikasi **HyperTerminal** atau **PuttY**. Jika data dapat diterima menggunakan dua aplikasi di atas, berarti pengaturan sudah benar dan data tersebut juga dapat diakses melalui **SerialPort**\[4,5\].

```csharp
...
serialPort = new SerialPort {
    BaudRate = 9600,
    DataBits = 8,
    Parity = Parity.None,
    Handshake = Handshake.XOnXOff,
    DtrEnable = true,
    RtsEnable = true
};
serialPort.Open();
...
```

### Parsing data

_Parser_ adalah suatu kode yang digunakan untuk menemukan bagian tertentu dalam suatu data. _Parser_ dapat berupa pola _Regex_ maupun cara lain yang dapat digunakan untuk menemukan informasi yang dicari dari sekumpulan data. Sedangkan _Regex_ (singkatan dari _regular expression_) adalah urutan karakter yang mendefinisikan pola pencarian kata.\[6\]

Berikut adalah contoh data yang diterima dari _serial_.

```
12/10/18  23:22PM  002  01  08123456789  12:22.003
```

Dari data di atas, dapat diketahui bahwa terdapat beberapa informasi yang dapat diambil dari data tersebut seperti yang diilustrasikan sebagai berikut.

```
12/10/18   23:22PM     002      01   081234567890   12:22.003
 Tanggal    Waktu   Extension  Line   No. Tujuan      Durasi
```

Setelah informasi yang akan diambil sudah diketahui, penulis kemudian membuat _parser_ untuk mengambil bagian-bagian informasi tersebut. Pada contoh ini penulis menggunakan _parser Regex_ untuk mengambil informasi dari data yang diterima dari _serial_. Berikut adalah beberapa contoh pola _Regex_ yang digunakan penulis.

| Data Asli          | Pola                                   | Hasil        |
| ------------------ | -------------------------------------- | ------------ |
| ... 20/5/13 ...    | \[0-9\]{1,2}/\[0-9\]{1,2}/\[0-9\]{1,2} | 12/10/18     |
| ... 04:00AM ...    | \[0-9\]{2}:\[0-9\]{2}(PM\|AM)          | 23:22PM      |
| .. 081887655665 .. | \[0-9\]{6,12}                          | 081234567890 |

Pola _Regex_ yang digunakan akan berbeda-beda dengan alat yang digunakan. Untuk membuat pola _Regex_ sebagai *parser* model lain, terdapat beberapa laman yang menyediakan layanan uji _Regex_ seperti **RegexLab**. Pada contoh ini penulis menggunakan aplikasi **RegexEditor**.

Dari pola di atas, pencocokan menggunakan _regex_ dapat dilakukan menggunakan kode berikut.

```csharp
...
return Regex.Match(buffer, "\[0-9\]{2}:\[0-9\]{2}(PM|AM)").Value.Trim();
...
```

## Demo Aplikasi

Penulis membuat aplikasi untuk demonstrasi teori yang telah di bahas sebelumnya. Aplikasi demo ini dibuat dalam dua versi yaitu versi C# dan VB.NET yang sama-sama menggunakan satu _library_ utama yaitu **PBXListener**. _Library_ ini penulis buat untuk memudahkan komunikasi antara PBX dengan program C#/VB.NET yang akan dibuat.

Demo aplikasi ini hanya dapat digunakan untuk PBX Panasonic KX-T616, tetapi tidak menutup kemungkinan bahwa program demo ini dapat digunakan pada model lainnya dengan syarat pengaturan yang ada diubah terlebih dahulu pada panel sebelah kiri dan model PBX yang digunakan memiliki _output_ data yang sama persis dengan contoh data yang telah di bahas pada bagian _Parsing data_.

Aplikasi ini juga dilengkapi dengan _port scanner_ untuk mengetahui _port_ _serial_ mana saja yang tersedia pada komputer. Cukup masukkan pengaturan pada panel di sebelah kiri kemudian klik _Connect_. Semua data panggilan akan otomatis terekam pada _DataGridView_. Klik _Disconnect_ untuk memutus koneksi _serial_ dan menghentikan _logging_.

Kedua versi program ini menggunakan _library_ yang sama yaitu **PBXListener** yang ditulis menggunakan bahasa pemprograman C#. Silakan cek _source code_ pada bagian awal artikel.

## Library PBXListener

Pada artikel sebelumnya telah dibahas konsep cara menggunakan komunikasi serial menggunakan _SerialPort_ dan demonstrasi aplikasi **PBXListener**. Artikel kali ini akan membahas bagaimana menggunakan _library_ **PBXListener** untuk sistem PBX Anda sendiri.

Pada artikel ini penulis akan mengulas bagaimana cara menggunakan **PBXListener** dengan PBX dan aplikasi Anda sendiri. Sebelum membaca artikel ini, sebaiknya Anda membaca bagian pertama dari artikel ini pada tautan berikut. **PBXListener** merupakan _library_ yang penulis buat untuk memudahkan integrasi PBX dengan aplikasi C# dan VB.NET. _Library_ ini dibuat menggunakan C# dan .NET Framework 4.0.

### Prinsip Parser pada PBXListener

**PBXListener** memiliki sebuah _interface_ **IParser** sebagai abstraksi _parser_ yang akan digunakan untuk mengolah data dari PBX. _Interface_ **IParser** memiliki _member_ object Parse(string input). _Method_ ini akan dipanggil ketika _parsing_ data diperlukan dan parameter input akan berisi data dari PBX yang perlu di-_parse_.

Selain _interface_ **IParser**, **PBXListener** juga memiliki _abstract class_ **ParserMapper**. PBXListener menggunakan sebuah _object model_ yang dibuat oleh user untuk menampung data yang telah diterima dari PBX. _Class_ **ParserMapper** ini digunakan untuk memetakan (_mapping_) antara _parser_ dan _property_ pada _object model_ yang dituju. _Object model_ dapat berupa _class_ dengan _property_ yang sesuai dengan _parser_ yang akan digunakan.

**Perhatian!** Tipe data yang dikembalikan dari _method_ **Parse** pada _interface_ **IParser** harus sesuai dengan _object model_ yang dituju.

### Deklarasi Object Model

_Object model_ berikut dibuat untuk menampung data tanggal panggilan dari PBX. Salin rekat kode di bawah ini ke dalam berkas baru dengan nama **MessageModel.cs**.

```csharp
namespace PBXListenerDemo {
    public class MessageModel {
        public string Date { get; set; }
    }
}
```

### Implementasi IParser

Berikut adalah contoh _parser_ tanggal panggilan untuk PBX Panasonic KX-T616. _Method Parse_ pada kelas ini akan mencocokkan _input string_ sesuai dengan pola yang ditulis. Salin rekat kode di bawah ini ke dalam berkas baru dengan nama **DateParser.cs**.

```csharp
namespace PBXListenerDemo {
    public class DateParser : IParser {
        public object Parse(string input) {
            return Regex.Match(input, "\[0-9\]{1,2}/\[0-9\]{1,2}/\[0-9\]{1,2}").Value.Trim();
        }
    }
}
```

### Implementasi ParserMapper

Setelah Anda membuat implementasi _IParser_, Anda harus membuat _mapper_ untuk memetakan _parser_ dengan properti pada _object model_. _Mapper_ di bawah ini akan memetakan _parser_ _DateParser_ dengan properti _Date_ pada _object model_ _MessageModel_. Salin rekat kode di bawah ini ke dalam berkas baru dengan nama **MessageMapper.cs**.

```csharp
namespace PBXListenerDemo {
    public class MessageMapper : ParserMapper<MessageModel> {
        public override void ConfigureMapping() {
            Map<DateParser>(x => x.Date);
        }
    }
}
```

### Implementasi EOF Marker

_EOF Marker_ adalah fungsi yang digunakan untuk menguji apakah data pada _buffer_ sudah cukup agar PBXListener dapat mulai melakukan _parsing_ data. _EOF Marker_ yang biasa penulis gunakan yaitu pengecekan terhadap durasi panggilan, karena durasi panggilan merupakan data terakhir yang dikirimkan oleh PBX. Dengan kata lain, setelah _buffer_ memiliki data durasi panggilan, makan **PBXListener** dapat memulai proses _parsing_.

## Penggunaan Parser Baru pada PBXListener

1. Buka Visual Studio dan buat _Console Application_ _Project_ baru dengan nama **PBXListenerDemo**.
2. Buka _NuGet Package Manager_ dan tambahkan library **PBXListener**.
3. Buat tiga _class_ sesuai dengan implementasi yang telah dibahas di atas.
4. Salin rekat kode di bawah ini.

```csharp
using System;
using System.IO.Ports;
using PBXListener;
using PBXListener.Parsers;

namespace PBXListener.CSharpDemo {
    static class Program {
        // static DateParser untuk EOF Marker
        private static Lazy<DateParser> _dateParserLazy = new Lazy<DateParser>();

        // The main entry point for the application.
        [STAThread]
        static void Main() {
            var listener = new PbxSerialPort {
                // konfigurasi serial
                BaudRate = 9600,
                DataBits = 8,
                DtrEnable = true,
                RtsEnable = true,
                Parity = Parity.None,
                Handshake = Handshake.XOnXOff
                Mapper = new PbxMessageMapper(), // gunakan mapper
                EofMarker = s => _dateParserLazy.Value.Parse(s) != null // EOF marker
            };
            listener.MessageReceived += Listener_MessageReceived; // event handler

            // mulai menerima data
            Console.WriteLine("Siap untuk menerima data...");
            Console.WriteLine("Tekan Enter untuk mulai.");
            Console.Read();
            listener.Open();

            // tutup ports
            Console.WriteLine();
            Console.WriteLine("Port terbuka! Menerima data...");
            Console.WriteLine("Tekan Enter untuk berhenti dan keluar.");
            Console.WriteLine();
            Console.Read();
            listener.Close();
        }

        private static void Listener_MessageReceived(object sender, MessageReceivedEventArgs e) {
            var model = (PbxMessage) e.Message;
            Console.WriteLine("Panggilan direkam: " + model.Date);
        }
    }
}
```

Setelah semua kode ditambahkan, tekan tombol **F5** untuk memulai _debugging_. Pasangkan kabel serial PBX ke komputer dan pastikan PBX dikenali oleh komputer. Tekan **Enter** untuk memulai perekaman data.

## Referensi

1. Wikipedia. 2018. Pbx ([https://id.wikipedia.org/wiki/Pbx](https://id.wikipedia.org/wiki/Pbx)). Diakses 15 Maret 2018.
2. Wikipedia. 2018. Serial Communication ([https://en.wikipedia.org/wiki/Serial_communication](https://en.wikipedia.org/wiki/Serial_communication)). Diakses 15 Maret 2018.
3. Sparkfun. 2018. Serial Communication ([https://learn.sparkfun.com/tutorials/serial-communication](https://learn.sparkfun.com/tutorials/serial-communication)). Diakses 15 Maret 2018.
4. Microsoft. 2018. SerialPort Class ([https://msdn.microsoft.com/en-us/library/system.io.ports.serialport(v=vs.110).aspx](<https://msdn.microsoft.com/en-us/library/system.io.ports.serialport(v=vs.110).aspx>)). Diakses 15 Maret 2018.
5. Patton, Glenn. 2013. Serial Comms in C# for Beginners ([https://www.codeproject.com/Articles/678025/Serial-Comms-in-Csharp-for-Beginners](https://www.codeproject.com/Articles/678025/Serial-Comms-in-Csharp-for-Beginners)). Diakses 15 Maret 2018.
6. Wikipedia. 2018. Regular expression ([https://en.wikipedia.org/wiki/Regular_expression](https://en.wikipedia.org/wiki/Regular_expression)). Diakses 15 Maret 2018.
