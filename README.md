# vizia-backend

### Tentang project backend API Vizia

Terdapat 5 folder yang ada di repository ini:
- article-service/
- database-migrator/
- default-service/
- history-service/
- predicts-service/
- user-auth-service/

Folder article-service, history-service, predicts-service, user-auth-service adalah 
folder yang akan berisi code project backend api untuk tiap fitur-fitur yang ada di mobile app.

- article-service: API untuk berita dan handle proses scrappingnya dari pihak luar
- history-service: API untuk history analysis yang ingin disimpan oleh user
- predicts-service: API untuk menjalankan inference ke model machine learning tensorflow
- user-auth-service: API untuk menangani autentikasi (login, register, logout) dan profile user

Setiap folder sudah disusun berdasarkan framework hapijs, tapi setiap file masih kosong, 
jadi tinggal developer yang isi codenya.

Untuk article-service, history-service, dan user-auth-service akan dideploy di App Engine
sedangkan predicts-service akan dideploy di Cloud Run.

Untuk folder database-migrator dan default-service bisa diabaikan saja, karena itu hanya untuk percobaan.

### Cara menjalankan projek
1. Masuk ke direktori project yang ingin dijalankan, lalu lakukan `npm install`.

2. Duplicate atau copy/paste file `.env.example` dan ganti nama file menjadi `.env` sehingga nantinya ada 2 file `.env.example` dan `.env`. Isikan credential variabel yang sudah tertera pada pada `.env`.

3. Begitu pula untuk file `app.example.yaml`. Duplicate atau copy/paste file `app.example.yaml` dan ganti nama file menjadi `app.yaml` sehingga nantinya ada 2 file `app.example.yaml` dan `app.yaml`. Isikan credential variabel yang sudah tertera pada pada `app.yaml`.

4. Khusus untuk direktori /user-auth-service, jangan lupa membuat service key dari google cloud platform dan mengunduhnya berupa file json, lalu beri nama `vizia-sa.json`.

5. Jika bingung silahkan tanyakan pada developer.