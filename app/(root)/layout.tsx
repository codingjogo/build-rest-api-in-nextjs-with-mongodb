import React from "react";
import Navbar from "./components/navbar";

const RootLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<>
			<Navbar />
			<main>{children}</main>
		</>
	);
};

export default RootLayout;
