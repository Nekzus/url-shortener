import { db, ShortenedUrl, User } from "astro:db"

export default async function seed() {
	await db.insert(User).values({
		email: "fSs6d@example.com",
		name: "John Doe",
	})

	await db.insert(ShortenedUrl).values({
		userId: 1,
		url: "https://example.com",
		code: "abc123",
	})
}
