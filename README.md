# Destination B1 Vocabulary Trainer

Web tĩnh để học theo Unit, mở PDF gốc trong trình duyệt, và làm bài kiểm tra viết lại từ tiếng Anh từ nghĩa tiếng Việt.

## Cách dùng

Mở `index.html` trong trình duyệt, hoặc chạy server trong đúng thư mục `D:\python\english-vocab-web`:

```powershell
python -m http.server 8080
```

Sau đó vào `http://localhost:8080`.

## Chỉnh danh sách từ

- App không chép toàn bộ nội dung sách thành HTML.
- Có thể mở file PDF gốc trong tab `PDF sách`.
- Có thể import dữ liệu luyện tập bằng JSON trong tab `Import`.
- Có thể thêm từ trực tiếp trên tab `Thêm từ`; dữ liệu tự thêm được lưu trong `localStorage` của trình duyệt.

## Dùng NVIDIA NIM để AI đọc ảnh

Nếu chọn `NVIDIA NIM` mà bị lỗi `Failed to fetch`, nguyên nhân thường là CORS:
NVIDIA không cho GitHub Pages gọi API trực tiếp từ trình duyệt.

Cách xử lý là tạo một Cloudflare Worker proxy rồi dán link đó vào ô
`Proxy URL cho NVIDIA`.

Code proxy đã có sẵn trong:

```text
worker/nvidia-proxy.js
```

Hướng dẫn deploy chi tiết nằm ở:

```text
worker/README.md
```

Sau khi deploy, URL sẽ có dạng:

```text
https://english-vocab-nvidia-proxy.<ten-cua-ban>.workers.dev
```

Dán URL này vào ô `Proxy URL cho NVIDIA`, nhập NVIDIA API key, chọn ảnh và bấm
`AI đọc ảnh và import`.
