import { useEffect, useState } from "react";
import { getDataOrderDynamic } from "../utils/getDataOrderDynamic";
import { GetTokenSession } from "../utils/getTokenSession";

interface AuthorizationResponse {
	response?: {
		token?: string;
		error?: string;
	};
	error?: string;
}

const { transactionId, orderNumber } = getDataOrderDynamic();

/* Inicio datos del comercio */
const MERCHANT_CODE = "4001834";
const PUBLIC_KEY = "VErethUtraQuxas57wuMuquprADrAHAb";
/* Fin datos del comercio */

/************* Inicio datos de la transacción **************/
const TRANSACTION_ID = transactionId;
const ORDER_NUMBER = orderNumber;
const ORDER_AMOUNT = "1.99";
const ORDER_CURRENCY = "PEN";
/************* Fin datos de la transacción **************/

export const PayComponent = () => {
	const [token, setToken] = useState<string | undefined>(undefined);
	const [error, setError] = useState<string | undefined>(undefined);

	useEffect(() => {
		GetTokenSession(TRANSACTION_ID, {
			requestSource: "ECOMMERCE",
			merchantCode: MERCHANT_CODE,
			orderNumber: ORDER_NUMBER,
			publicKey: PUBLIC_KEY,
			amount: ORDER_AMOUNT,
		}).then((authorization: AuthorizationResponse) => {
			const {
				response: { token = undefined, error } = {
					response: undefined,
					error: "NODE_API",
				},
			} = authorization;

			if (token) {
				setToken(token);
				const buttonPay =
					document.querySelector<HTMLButtonElement>("#btnPayNow");
				if (buttonPay) {
					buttonPay.disabled = false;
					buttonPay.innerHTML = `${ORDER_CURRENCY} ${ORDER_AMOUNT} →`;
				}
			} else if (error) {
				setError(error);
				console.error("error-->", error);
			}
		});
	}, []);

	const handleLoadForm = () => {
		if (!token) return;

		const iziConfig: iziConfig = {
			config: {
				transactionId: TRANSACTION_ID,
				action: Izipay.enums.payActions.PAY,
				merchantCode: MERCHANT_CODE,
				order: {
					orderNumber: ORDER_NUMBER,
					currency: ORDER_CURRENCY,
					amount: ORDER_AMOUNT,
					processType: Izipay.enums.processType.AUTHORIZATION,
					merchantBuyerId: "mc1768",
					dateTimeTransaction: "1670258741603000", //currentTimeUnix
					payMethod: Izipay.enums.showMethods.ALL,
				},
				billing: {
					firstName: "Juan",
					lastName: "Wick",
					email: "jwick@izipay.pe",
					phoneNumber: "989339999",
					street: "calle el demo",
					city: "lima",
					state: "lima",
					country: "PE",
					postalCode: "00001",
					document: "12345678",
					documentType: Izipay.enums.documentType.DNI,
				},
				render: {
					typeForm: Izipay.enums.typeForm.POP_UP,
					container: "#your-iframe-payment",
					showButtonProcessForm: false,
				},
				urlRedirect:
					"https://server.punto-web.com/comercio/creceivedemo.asp?p=h1",
				appearance: {
					logo: "https://static.wixstatic.com/media/d4968a_9478533f73ac481dbf92103205e110c5~mv2_d_5021_5021_s_4_2.png/v1/fill/w_400,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/chaqchao_logo_transparent_blue_FIXED.png",
					customTheme: {
						colors: {
							primary: {
								background: "#014858",
								color: "#FFFFFF",
							},
						},
					},
				},
			},
		};

		const callbackResponsePayment = (response: any) =>
			(document.querySelector("#payment-message")!.innerHTML =
				JSON.stringify(response, null, 2));

		try {
			const checkout = new Izipay({ config: iziConfig.config });

			checkout &&
				checkout.LoadForm({
					authorization: token,
					keyRSA: "RSA",
					callbackResponse: callbackResponsePayment,
				});
		} catch (error) {
			console.error(error.message, error.Errors, error.date);
		}
	};

	return (
		<div>
			<button id="btnPayNow" onClick={handleLoadForm} disabled>
				Loading...
			</button>
			{error && <p>Error: {error}</p>}
			<div id="payment-message"></div>
		</div>
	);
};
