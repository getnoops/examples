# Diary API

An API that allows users to create and read diary entries.

# Running the API locally
```shell
docker compose up -d

docker compose exec postgres psql -U postgres -tc "SELECT 1 FROM pg_user WHERE usename = 'noops'" | grep -q 1 || docker compose exec postgres psql -U postgres -c "CREATE ROLE noops WITH LOGIN SUPERUSER PASSWORD 'mysecret';"

docker compose exec postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'diaryapi'" | grep -q 1 || docker compose exec postgres psql -U postgres -c "CREATE DATABASE diaryapi ENCODING UTF8 OWNER noops";

go run main.go
```