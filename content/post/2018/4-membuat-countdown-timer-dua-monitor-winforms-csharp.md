---
title: Membuat Countdown Timer Dua Monitor C#⏳
categories: Programming
tags: [programming, tutorial, tips]
date: 2018-05-24
slug: membuat-countdown-timer-dua-monitor-winforms-csharp
---

<div class="flex justify-center">
{{< button content="Soure Code" icon="logos:github-icon" href="https://l.kodesiana.com/legacy-countdown-timer" >}}
</div>

*Countdown timer* lazim dijumpai di berbagai tempat misalnya di rumah sakit, bank, kantor servis, dan tempat lain yang
menggunakan sistem antrean. Program ini biasanya menunjukkan berapa lama waktu sebelum antrean berikutnya dipanggil.
Timer ini biasanya ditampilkan menggunakan dua monitor yaitu satu monitor untuk mengontrol timer dan satu monitor untuk
menampilkan timer.

Pada artikel ini, saya akan membahas sedikit cara membuat aplikasi *countdown timer* yang dapat disesuaikan dengan mudah
dan dapat menampilkan timer pada layar berbeda (*multi-screen*).

## Membuat Form Countdown

Pertama buat project baru, saya menggunakan nama **CountdownScreen**. Tambahkan dua form baru kemudian tambahkan kontrol
sesuai dengan gambar berikut.

![Desain Form Setting Timer](https://blob.kodesiana.com/kodesiana-public-assets/posts/2018/4/form-utama.png)

![Desain Form Timer](https://blob.kodesiana.com/kodesiana-public-assets/posts/2018/4/form-countdown.png)

Untuk form **CountdownForm.cs**, set *FormBorderStyle* ke *None* dan pada label timer set *AutoSize* ke *False*
dan *Dock* ke *Fill*. Tambahkan sebuah **Timer** dengan nama *tmrCount* dengan *Interval* 1000.Sesuaikan tampilan dan
font yang digunakan agar mudah dilihat.

### Source Code CountdownForm.cs

Salin rekat kode berikut pada file **CountdownForm.cs.**

```csharp
namespace CountdownScreen {
    public partial class CountdownForm : Form {
        private TimeSpan _currentCount;

        public CountdownForm(Rectangle bounds, TimeSpan value) {
            InitializeComponent();
            SetBounds(bounds.X, bounds.Y, bounds.Width, bounds.Height, BoundsSpecified.Location);
            WindowState = FormWindowState.Maximized;
            _currentCount = value; label1.Text = $"{_currentCount.Hours:D2}:{_currentCount.Minutes:D2}:{_currentCount.Seconds:D2}";
            tmrCount.Start();
        }

        private void tmrCount_Tick(object sender, EventArgs e) // timer, interval 1000
        {
            _currentCount = _currentCount - TimeSpan.FromSeconds(1);
            label1.Text = "{_currentCount.Hours:D2}:{_currentCount.Minutes:D2}:{_currentCount.Seconds:D2}";

            if (_currentCount.TotalSeconds == 0) return;
            label1.Text = "Selesai"; tmrCount.Stop();
        }
    }
}
```

Penjelasan Kode

- Baris 7 saat form akan dibuat ("constructed"), lokasi tampilan form *(bounds)* dan lama waktu *(value)* dimuat
  dalam *constructor*.
- Baris 11 dan 12 men-set lokasi form dan membuat form menjadi **Maximized.**
- Baris 14-16 menyimpan nilai *value,* menampilkan berapa lama waktu timer, dan memulai *tmrCount*.

Setiap kali interval pada *tmrCount* dilewati, *event handler* pada baris 19-27 akan dieksekusi.

- Baris 21 mengurangi waktu sebanyak 1 detik dari variabel.
- Baris 22 menampilkan sisa waktu.
- Baris 24-26 apabila jumlah detik pada variabel lebih kecil daripada satu, berarti countdown telah selesai dan kemudian
  menghentikan *tmrCount*.

### Source Code MainForm.cs

Salin rekat kode berikut pada file **MainForm.cs**.

```csharp
namespace CountdownScreen {
    public partial class MainForm : Form {
        private CountdownForm _countdownForm;

        public MainForm() {
            InitializeComponent();
            cboScreen.DataSource = Screen.AllScreens.Select(x => $"{x.DeviceName} (Primary: {x.Primary})").ToList();
        }

        private void cmdShow_Click(object sender, EventArgs e) // event handler
        {
            var screenBounds = Screen.AllScreens[cboScreen.SelectedIndex].Bounds;
            var time = new TimeSpan(dtCount.Value.Hour, dtCount.Value.Minute, dtCount.Value.Second);
            _countdownForm = new CountdownForm(screenBounds, time);
            _countdownForm.Show();
        }

        private void button1_Click(object sender, EventArgs e) // event handler
        {
            _countdownForm?.Close();
        }
    }
}
```

- Baris 5 variabel yang menampung referensi ke objek **CountdownForm**.
- Baris 11 me-load array *monitor/screen* yang ada pada PC ke **ComboBox.**
- Baris 16-17 me-load ukuran *(bounds)* layar berdasarkan *index* dari **ComboBox** dan membuat objek **TimeSpan** yang
  berisi durasi waktu timer.
- Baris 19-20 menampilkan form **CountdownForm.**
- Baris 25 menutup form **CountdownForm.**

Setelah selesai, jalankan program dengan cara tekan **F5**. Form **MainForm** akan muncul. Pastikan komputer/laptop Anda
terhubung dengan dua monitor dan *project mode* pada **Extend**.

![Project Mode Extend](https://blob.kodesiana.com/kodesiana-public-assets/posts/2018/4/monitor-extend.jpg)

Masukkan berapa lama timer dan pilihan monitor, kemudian klik **Mulai**. Countdown akan muncul pada layar yang dipilih.
Klik **Berhenti** untuk menutup form countdown.

![Tampilan Aplikasi Timer](https://blob.kodesiana.com/kodesiana-public-assets/posts/2018/4/pilihan-display.png)
