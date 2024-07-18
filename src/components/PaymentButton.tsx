import React from "react";

interface PaymentButtonProps {
	onClick: () => void;
	disabled: boolean;
	amount: string;
	currency: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
	onClick,
	disabled,
	amount,
	currency,
}) => (
	<button id="btnPayNow" onClick={onClick} disabled={disabled}>
		{`${currency} ${amount} →`}
	</button>
);

export default PaymentButton;
