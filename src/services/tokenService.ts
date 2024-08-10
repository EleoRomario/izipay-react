export const getToken = async (
	transactionId: string,
	{
		requestSource = "ECOMMERCE",
		merchantCode = "",
		orderNumber = "",
		publicKey = "",
		amount = "",
	}
) => {
	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				transactionid: transactionId,
			},
			body: JSON.stringify({
				requestSource,
				merchantCode,
				orderNumber,
				publicKey,
				amount,
			}),
		});
		return await response.json();
	} catch (e) {
		console.log("REVISA QUE EL ARCHIVO SERVER SE ESTE EJECUTANDO!");
		return {
			response: {
				token: undefined,
				error: "01_NODE_API",
			},
		};
	}
};
