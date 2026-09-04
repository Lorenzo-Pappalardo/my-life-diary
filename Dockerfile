FROM node:26-alpine AS deps
WORKDIR /app
COPY ./package.json ./
COPY ./pnpm* ./
RUN npm install -g pnpm
RUN pnpm install

FROM deps AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./package.json ./
COPY ./pnpm* ./
COPY ./prisma ./prisma
COPY ./src ./src
COPY ./static ./static
COPY ./.env.Docker ./.env
COPY ./prisma.config.ts ./prisma.config.ts
COPY ./svelte.config.js ./svelte.config.js
COPY ./tsconfig.json ./tsconfig.json
COPY ./vite.config.ts ./vite.config.ts
RUN pnpm build

FROM node:26-alpine AS app
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./package.json ./
COPY ./pnpm* ./
COPY --from=build ./app/.svelte-kit/output ./.svelte-kit/output
COPY --from=build ./app/package.json ./
COPY ./.env.Docker ./.env
COPY ./prisma.config.ts ./prisma.config.ts
COPY ./svelte.config.js ./svelte.config.js
COPY ./vite.config.ts ./vite.config.ts
RUN npm install -g pnpm
CMD ["pnpm", "preview", "--host", "0.0.0.0"]