import { useRef, useState } from "react"
import { toast } from "sonner"

const validarURL = (url: string): boolean => {
	const urlRegex = /^(ftp|http|https):\/\/[^ "]+\.[a-zA-Z]{2,}(\/\S*)?$/
	return urlRegex.test(url)
}

const ShorterURLReact = ({ userId }: { userId?: number }) => {
	const [url, setUrl] = useState<string>()
	const [error, setError] = useState<string>()
	const shortenedUrlRef = useRef<HTMLInputElement>(null)

	const handleSubmit = async (e: any) => {
		e.preventDefault()

		if (!url) {
			setError("Debes escribir una URL")
			return
		}

		if (!validarURL(url)) {
			setError("Debes escribir una URL válida")
			return
		}

		try {
			const res = await fetch("/api/shorter-url", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					url: url,
					userId: userId ?? null,
				}),
			})

			const body = await res.json()

			const shortenedUrl = body.shortenedUrl

			if (!shortenedUrl) {
				setError("Error al acortar la URL, inténtalo de nuevo más tarde")
				return
			}

			shortenedUrlRef.current!.value = shortenedUrl

			setError(undefined)
		} catch {
			setError("Error al acortar la URL, inténtalo de nuevo más tarde")
		}
	}

	const handleCopy = () => {
		try {
			window.navigator.clipboard.writeText(shortenedUrlRef.current!.value)

			toast.success("URL copiada al portapapeles")
		} catch (e) {
			toast.error("Error al copiar la URL")
		}
	}

	return (
		<form onSubmit={handleSubmit} className="mt-[1rem] flex w-full flex-col gap-[1rem]">
			{error && <span className="text-[0.8rem] text-red-500">{error}</span>}
			<input
				type="url"
				placeholder="Escribe aqui tu URL"
				className="p-[0.5rem] text-[0.9rem] text-black lg:text-[1.05rem]"
				defaultValue={url}
				onChange={(e) => setUrl(e.target.value)}
			/>
			<button
				type="submit"
				className="cursor-pointer border-none bg-blue-600 p-[0.5rem] text-[1.05rem] text-white transition duration-[0.2s] any-hover:bg-blue-500"
			>
				Acortar URL
			</button>
			<input
				disabled
				type="url"
				className="p-[0.5rem] text-[0.9rem] text-black lg:text-[1.05rem]"
				ref={shortenedUrlRef}
			/>
			<button
				onClick={handleCopy}
				className="cursor-pointer border-none bg-[#007bff] p-[0.5rem] text-[1.05rem] text-white transition duration-[0.2s] any-hover:bg-[#72b6ff]"
				type="button"
			>
				Copiar URL
			</button>
		</form>
	)
}

export default ShorterURLReact
