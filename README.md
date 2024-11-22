# vizia-backend

Petunjuk project backend API Vizia

terdapat 5 folder untuk pengerjaan backend:
- article-service/
- database-migrator/
- default-service/
- history-service/
- predicts-service/
- user-auth-service/

folder article-service, history-service, predicts-service, user-auth-service adalah 
folder yang akan berisi code project backend api untuk tiap fitur-fitur yang ada di mobile app.

- article-service: API untuk berita dan handle proses scrappingnya dari pihak luar
- history-service: API untuk history analysis yang ingin disimpan oleh user
- predicts-service: API untuk menjalankan inference ke model machine learning tensorflow
- user-auth-service: API untuk menangani autentikasi (login, register, logout) dan profile user

setiap folder sudah disusun berdasarkan framework hapijs, tapi setiap file masih kosong, 
jadi tinggal developer yang isi codenya

untuk article-service, history-service, dan user-auth-service akan dideploy di App Engine
sedangkan predicts-service akan dideploy di Cloud Run.

untuk folder database-migrator dan default-service bisa diabaikan saja, karena itu hanya untuk percobaan.