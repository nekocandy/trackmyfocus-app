import { ReactElement, useState } from "react";
import { Bulb, HandTwoFingers } from "tabler-icons-react";

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
					<button className="flex items-center justify-center gap-1  text-orange-400 bg-orange-400/20 hover:(bg-orange-500/30) px-4 py-1 rounded">
						<Bulb size={20} strokeWidth={2} className="text-orange-400" />
						Prompt Me
					</button>
					<button className="font-bol flex items-center justify-center gap-1  text-teal-400 bg-teal-500/20 hover:(bg-teal-500/30) px-4 py-1 rounded">
						<HandTwoFingers
							size={20}
							strokeWidth={2}
							className="text-teal-400"
						/>
						Tap Button
					</button>
				</div>
			</div>
		);
	} else {
		return (
			<div className="h-full flex items-center justify-center">
				<button
					onClick={loginWithBrowserClicked}
					className="w-full bg-teal-500/20 hover:(bg-teal-500/30) px-4 py-2 rounded"
				>
					Login With Browser
				</button>
			</div>
		);
	}
}
