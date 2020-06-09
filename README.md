# Cloudflared builds on drone.io

[![Build Status](https://cloud.drone.io/api/badges/danacr/drone-cloudflared/status.svg)](https://cloud.drone.io/danacr/drone-cloudflared)

Current version: 2020.6.1

When trying to download cloudlfared for Arm64, I noticed that there were no binaries available:

https://github.com/cloudflare/cloudflared/issues/60

Since drone.io supports arm64 builds, I decided to build a separate pipeline just for these builds. Please find the latest version in the releases section.

This is a fully automated repository using [firebase pipelines](https://github.com/danacr/firebase-pipelines) that creates arm64 bin releases of cloudflared when a new version is released (synchronization happens every 12 hours).
