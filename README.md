# MyLifeLogbook

## Get started

1. Run `docker compose up -d` to spin up an instance of PostgresDB and another of Adminer.
2. Install dependencies with `pnpm i`.
3. Start the development server with `pnpm dev`.
4. (Optional) Synchronise the database with the generated Prisma schema with `pnpm prisma:db:push`.

## Manipulate data

1. Get a shell into postgres pod with `docker exec -it postgres /bin/sh`.
2. Log into PostgresDB with `psql -d mylife -U POSTGRES_USER`.
3. Launch the desired operation.
   1. Export: `\copy (select * from "Event") to '/home/backups/export-YYYY-MM-DD.csv' with csv header`.
   2. Import: `\copy "Event"(id, title, description, context, "startDate", "endDate", impact, "createdAt", "updatedAt") FROM '/home/imports/import.csv' delimiter ',' csv header`.
