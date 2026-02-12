---
title: Ritsu-Pi
description: Ansible Playbook untuk provision media server Raspberry Pi
date: 2026-02-12
comments: false
---

> **Ritsu-Pi** dalam fase **Production**

{{<button-group>}}
{{<button content="GitHub Repository" icon="brand-github" href="https://github.com/fahminlb33/ritsu-pi">}}
{{<button content="Artikel" icon="books" href="/post/membangun-home-server-menggunakan-raspberry-pi-dan-ansible-bagian-1">}}
{{</button-group>}}

**Ritsu-Pi** merupakan koleksi Ansible roles dan playbook untuk membuat homelab media server. Tidak hanya aplikasi hiburan, Ritsu-Pi juga penulis gunakan untuk mem-*provision* aplikasi untuk keperluan penelitian dan *monitoring* sistem.

## Aplikasi Bawaan

- [x] Docker
- [x] AdBlock
  - [x] DNSCrypt
  - [x] Pi-Hole
- [x] Downloaders
  - [x] Gluetun VPN
  - [x] JDownloader 2
  - [x] qBittorrent
- [x] Arr Stack
  - [x] Bazarr
  - [x] Lidarr
  - [x] Sonarr
  - [x] Radarr
  - [x] Prowlarr
  - [x] Jackett
  - [x] FlareSolvarr
- [x] Jellyfin
- [x] Immich
- [x] Monitoring
  - [x] Grafana
  - [x] Prometheus
  - [x] Node Exporter
  - [x] cAdvisor Exporter
  - [x] Blackbox Exporter
  - [x] SpeedTest Exporter
  - [x] Mikrotik Exporter
  - [x] apcupsd Exporter
  - [x] smartctl Exporter
- [x] Homepage Dashboard
- [x] MLflow
- [x] Samba (SMB) Server
- [x] Traefik Reverse Proxy
