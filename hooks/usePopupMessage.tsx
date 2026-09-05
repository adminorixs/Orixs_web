import { useState, useCallback, useEffect } from "react";

type PopupType = "success" | "error" | null;

export const usePopupMessage = () => {
	const [message, setMessage] = useState<string>("");
	const [type, setType] = useState<PopupType>(null);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	// Success message handler
	const showSuccess = useCallback((msg: string) => {
		setMessage(msg);
		setType("success");
		setIsOpen(true);
	}, []);

	// Error message handler
	const showError = useCallback((msg: string) => {
		setMessage(msg);
		setType("error");
		setIsOpen(true);
	}, []);

	// Close popup and reset message
	const closePopup = useCallback(() => {
		setIsOpen(false);
		setMessage("");
		setType(null);
	}, []);

	useEffect(() => {
		if (isOpen && type === "error") {
			const timer = setTimeout(() => {
				setIsOpen(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [isOpen, type]);

	return {
		message,
		type,
		isOpen,
		showSuccess,
		showError,
		closePopup,
	};
};
