type FetcherParams = {
	endpoint: string
	method?: string
	count?: number
	body?: unknown
}

const clientId = 'bc1uqRAkHqNtIqBLfzZ6yO-sjXoQyqXS-gL8LOrN_TM'

export const fetcher = async ({
	endpoint,
	method = 'GET',
	count = 20,
	body,
}: FetcherParams) => {
	const url = new URL(`https://api.unsplash.com/${endpoint}?count=${count}`) // Если используется базовый URL из env

	// Добавляем client_id в URL
	url.searchParams.append('client_id', clientId)

	const response = await fetch(url.toString(), {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
		body: body ? JSON.stringify(body) : undefined,
	})

	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`)
	}

	return response.json()
}
