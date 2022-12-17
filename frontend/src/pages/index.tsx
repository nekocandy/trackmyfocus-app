import { ReactElement, useState } from "react";

export default function HomePage(): ReactElement {
	const [loading, setLoading] = useState(false);
	const [signedIn, setSignedIn] = useState(false);

	const wait = (seconds: number) =>
		new Promise((resolve) => setTimeout(resolve, seconds * 1000));

	const loginWithBrowserClicked = async () => {
		setLoading(true);
		await wait(1);
		setLoading(false);
		setSignedIn(true);
	};

	if (loading) {
		return <div>Loading...</div>;
	} else if (signedIn) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="w-full grid grid-cols-2 gap-4">
					<button className="bg-teal-500/20 hover:(bg-teal-500/30) px-4 py-1 rounded">
						Prompt Me
					</button>

					<button className="bg-teal-500/20 hover:(bg-teal-500/30) px-4 py-1 rounded">
						Tap Me
					</button>
				</div>
			</div>
		);
	} else {
		return (
			<div className="h-full flex items-center justify-center">
				<button onClick={loginWithBrowserClicked} className="w-full bg-teal-500/20 hover:(bg-teal-500/30) px-4 py-2 rounded">
					Login With Browser
				</button>
			</div>
		);
	}
}
