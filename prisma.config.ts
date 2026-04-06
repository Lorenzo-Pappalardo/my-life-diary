import { defineConfig, env } from '@prisma/config';
import { loadEnvFile } from 'node:process';

loadEnvFile();

export default defineConfig({
	schema: 'prisma/schema.prisma',
	datasources: {
		db: {
			// Provide the connection URL for Migrate and CLI tools via the config.
			url: env('DATABASE_URL')
		}
	}
});
