# Essay Room — IELTS Writing Review

Website tĩnh bằng HTML, CSS và JavaScript để lưu các bài IELTS Writing đã được nhận xét. Nội dung ví dụ có sẵn minh họa cách hiển thị band tham khảo, tiêu chí chấm, nhận xét cho từng đoạn, chỗ cần sửa, câu viết lại và bài mẫu.

## Chạy website

Mở `index.html` trong trình duyệt. Không cần cài đặt hay máy chủ.

## Thêm bài đã chấm

Nội dung bài nằm trong `data.js`, trong mảng `window.REVIEWS`. Khi có bài mới, thêm một object theo cùng cấu trúc:

- `id`: mã duy nhất, viết thường và dùng dấu gạch ngang.
- `title`, `prompt`, `type`, `typeLabel`, `topic`, `date`: thông tin bài và đề bài. `type` là `task1` hoặc `task2`.
- `band`, `wordCount`, `duration`, `verdict`: band tham khảo, số từ, thời gian và nhận xét tổng quan.
- `scores`: bốn tiêu chí IELTS Writing; mỗi tiêu chí có `name`, `short`, `score`, `color`, `note`.
- `paragraphs`: một mục cho mỗi đoạn. Mỗi mục có `label`, `original`, `summary`, `annotations` và `rewrite`.
- `annotations`: từng lỗi/gợi ý có `quote` (đoạn chữ nguyên văn cần đánh dấu), `kind`, `title`, `body`, `fix`.
- `modelEssay`: mảng các đoạn của bài mẫu; `takeaways`: các điểm nên học từ bài mẫu.

Ví dụ hiện tại chỉ là nội dung minh họa giao diện. Khi bổ sung bài thật, giữ nguyên bài gốc để phần đánh dấu trỏ đúng đoạn chữ; nếu trích dẫn xuất hiện nhiều lần trong cùng đoạn, hãy chọn cụm ngắn và riêng biệt hơn.

## Xuất bản bằng GitHub Pages

Repo có workflow tại `.github/workflows/pages.yml`. Trong GitHub, vào **Settings → Pages**, chọn **GitHub Actions** làm nguồn xuất bản. Mỗi lần cập nhật nhánh `main`, workflow sẽ triển khai trang tĩnh. Nếu repo private và gói GitHub hiện tại không hỗ trợ Pages cho repo private, cần đổi repo thành public hoặc dùng một gói có hỗ trợ.

## Lưu ý

Website hiện không tự chấm bài, không có đăng nhập và không lưu dữ liệu trên máy chủ. Người quản lý thêm nội dung đã chấm trực tiếp vào `data.js`. Band và nhận xét được hiển thị như tài liệu tham khảo học tập, không phải kết quả chính thức của IELTS.
