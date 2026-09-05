"use client";

import React, { ReactNode, MouseEvent } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
	if (!open) return null;

	return createPortal(
		<div
			className='flex gap-1 p-4 z-50 justify-center min-h-screen max-h-screen overflow-auto w-full bg-neutral-800/40 fixed z-40 top-0 start-0'
			onClick={onClose}
		>
			<div
				onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
				className='w-full sm:w-fit min-h-0 sm:min-h-[90vh] flex items-start sm:items-center justify-center h-fit overflow-auto'
			>
				{children}
			</div>
		</div>,
		document.body
	);
};

export default Modal;
