import type { APIRoute } from "astro"
import { ShortenedUrl, db, eq } from "astro:db"

export const POST: APIRoute = async ({ request }) => {
	if (request.headers.get("content-type") !== "application/json") {
		return new Response(null, { status: 400, statusText: "Bad request" })
	}

	const body = await request.json()

	if (!body.url) {
		return new Response(null, { status: 400, statusText: "Bad request" })
	}

	const url = body.url as string

	try {
		let idExists = true
		let id: string = ""
		do {
			const auxId = Math.random().toString(36).substring(2, 7)

			const idExistsReq = await db.select().from(ShortenedUrl).where(eq(ShortenedUrl.code, auxId))

			if (idExistsReq.length === 0) {
				idExists = false
				id = auxId

				await db.insert(ShortenedUrl).values({
					userId: body.userId ?? null,
					code: id,
					url: url,
				})
			}
		} while (idExists)

		const newUrl = new URL(request.url)

		return new Response(
			JSON.stringify({
				shortenedUrl: `${newUrl.origin}/${id}`,
			}),
			{
				status: 201,
			}
		)
	} catch (e) {
		const error = e as Error
		return new Response(null, { status: 500, statusText: error.message })
	}
}
