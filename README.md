# MyLife: Personal logbook of experiences

## Get started

1. Run `docker compose up -d` to spin up an instance of PostgresDB and another of Adminer.
2. Install dependencies with `pnpm i`.
3. Start the development server with `pnpm dev`.
4. (Optional) Synchronise the database with the generated Prisma schema with `pnpm prisma:db:push`.

## Export data to CSV

1. Get a shell into postgres pod with `docker exec -it postgres /bin/sh`.
2. Log into PostgresDB with `psql -h localhost -p 5432 -d mylife -U POSTGRES_USER`.
3. Run `\copy (select * from "Event") to '/home/backups/export-YYYY-MM-DD.csv' with csv header`.
