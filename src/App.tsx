import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaymentForm from "./components/PaymentForm";

function App() {
	const initialOptions = {
		clientId: "test",
		currency: "USD",
		intent: "capture",
	};
	return (
		<>
			<h1>Payment Integration</h1>
			<PaymentForm />
			<PayPalScriptProvider options={initialOptions}>
				<h1>PayPal</h1>
				<PayPalButtons style={{ layout: "horizontal" }} />
			</PayPalScriptProvider>
		</>
	);
}

export default App;
