import React, { useEffect, useState } from "react";
import useIzipay from "../hooks/useIzipay";
import { getToken } from "../services/tokenService";
import PaymentButton from "./PaymentButton";
import { getDataOrderDynamic } from "../utils/getDataOrderDynamic";

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

const PaymentForm: React.FC = () => {
	const [token, setToken] = useState<string | null>(null);
	const { loadIzipayForm } = useIzipay(token);

	useEffect(() => {
		const fetchToken = async () => {
			const data = await getToken(TRANSACTION_ID, {
				requestSource: "ECOMMERCE",
				merchantCode: MERCHANT_CODE,
				orderNumber: ORDER_NUMBER,
				publicKey: PUBLIC_KEY,
				amount: ORDER_AMOUNT,
			});
			if (data?.response?.token) {
				setToken(data.response.token);
			}
		};

		fetchToken();
	}, []);

	const iziConfig = {
		transactionId: TRANSACTION_ID,
		action: "pay",
		merchantCode: MERCHANT_CODE,
		order: {
			orderNumber: ORDER_NUMBER,
			currency: ORDER_CURRENCY,
			amount: ORDER_AMOUNT,
			processType: "AT",
			merchantBuyerId: "mc1768",
			dateTimeTransaction: "1670258741603000",
			payMethod: "all",
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
			documentType: "DNI",
		},
		render: {
			typeForm: "pop-up",
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
	};

	const handlePayment = () => {
		loadIzipayForm(iziConfig, (response: any) => {
			document.querySelector("#payment-message")!.innerHTML =
				JSON.stringify(response, null, 2);
		});
	};

	return (
		<div>
			<PaymentButton
				onClick={handlePayment}
				disabled={!token}
				amount={ORDER_AMOUNT}
				currency={ORDER_CURRENCY}
			/>
			<div id="your-iframe-payment"></div>
			<pre id="payment-message"></pre>
		</div>
	);
};

export default PaymentForm;
