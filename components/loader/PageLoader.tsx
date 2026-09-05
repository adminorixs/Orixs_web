"use client";

import { LoaderCircle } from "lucide-react";
import React from "react";
type PageLoaderProps = {
    component?: React.ReactNode; 
}
const PageLoader:React.FC<PageLoaderProps> = ({ component }) => {
	return (
		<>
			{component ? (
				component
			) : (
				<div className='flex items-center justify-center min-h-40 w-full '>
					<LoaderCircle className='h-10 text-purple-500  animate-spin' />
				</div>
			)}
		</>
	);
};

export default PageLoader;