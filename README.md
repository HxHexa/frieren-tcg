# frieren-tcg

Discord bot for the Frieren TCG

`npm start` to start
`npx prettier . --write` to write
`npm server` to open the `/stats` endpoint for external file write. Obviously very insecure - should not be run during actual games.

## Docker

`docker-compose up --build -d` to rebuild and restart every container
`docker-compose logs -f app` for the log
`docker-compose restart app` to quick restart app (but keep the database and prisma studio running)
`docker-compose down` to take down the container
`docker-compose exec app npx prisma migrate dev` to create new migrations in dev
`docker-compose exec app npx prisma migrate deploy` to apply migrations on prod
`docker-compose exec app npx prisma db seed` for initial seeding
`docker-compose exec app npx prisma studio` to view Prisma Studio (GUI for viewing database)
