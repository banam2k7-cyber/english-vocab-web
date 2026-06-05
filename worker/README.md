# NVIDIA Proxy Worker

NVIDIA NIM may block direct browser calls from GitHub Pages because of CORS.
Deploy `nvidia-proxy.js` as a Cloudflare Worker, then paste the Worker URL into
the app's `Proxy URL cho NVIDIA` field.

The app still asks for your NVIDIA API key in the browser and sends it to this
worker only when you click AI import.
