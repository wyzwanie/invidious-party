export const handle = async ({ request, render }) => {
	const response = await render(request)
	return response
}