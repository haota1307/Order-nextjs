# Flow quản lý authentication

## Ở dự án Quản lý quán ăn

Thay vì khai báo 1 route handler là `/auth` thì mình sẽ khai báo route handler cho login luôn

1. Client component gọi api login route handler là `/auth/login`
2. Route handler này sẽ gọi tiếp api login đến Server Backend để nhận về token, sau đó lưu token vào cookie client, cuối cùng trả kết quả về cho client component

Cái này gọi là dùng Next.js Server làm proxy trung gian

Tương tự với logout cũng vậy

Ở Server Component nhận biết được login hay chưa thì dựa vào cookie mà browser gửi lên
Ở Client Component nhận biết được login hay chưa thì dựa vào local storage
