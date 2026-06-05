# NVIDIA Proxy Worker

NVIDIA NIM may block direct browser calls from GitHub Pages because of CORS.
Deploy `nvidia-proxy.js` as a Cloudflare Worker, then paste the Worker URL into
the app's `Proxy URL cho NVIDIA` field.

The app still asks for your NVIDIA API key in the browser and sends it to this
worker only when you click AI import.

## Deploy nhanh bằng Cloudflare Dashboard

1. Vào https://dash.cloudflare.com/
2. Chọn `Workers & Pages`.
3. Chọn `Create` -> `Worker`.
4. Đặt tên, ví dụ `english-vocab-nvidia-proxy`.
5. Bấm `Deploy`.
6. Vào `Edit code`.
7. Xóa code mặc định và dán toàn bộ nội dung file `nvidia-proxy.js`.
8. Bấm `Save and deploy`.
9. Copy URL Worker, ví dụ:

```text
https://english-vocab-nvidia-proxy.<ten-cua-ban>.workers.dev
```

10. Dán URL đó vào ô `Proxy URL cho NVIDIA` trong web học từ.

## Deploy bằng Wrangler

Nếu máy đã có Node.js/npm:

```powershell
cd D:\python\english-vocab-web\worker
npm create cloudflare@latest
wrangler deploy
```

Sau khi deploy xong, Wrangler sẽ in ra URL Worker. Dán URL đó vào web.
