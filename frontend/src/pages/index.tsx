import { ReactElement, useEffect, useState } from "react";
import { Bulb, HandTwoFingers } from "tabler-icons-react";
import queryString from "query-string";
import { useNavigate } from "react-router";

interface Window {
	bridge: any;
}

declare let window: Window;

export default function HomePage(): ReactElement {
	const [registered, setRegistered] = useState(false);
	const [loading, setLoading] = useState(false);
	const [signedIn, setSignedIn] = useState(false);
	const [token, setToken] = useState<string | null>(null);
	const navigate = useNavigate();

	const listener = () => {
		console.log("hello from");

		if (registered) {
			console.log("tried registering again");
			return;
		}

		setRegistered(true);

		window.bridge.setToken((event: any, token: string) => {
			console.log({ event, token });
			const params = queryString.parse(token.split("?")[1]);

			localStorage.setItem("token", params["token"] as string);
			setToken(params["token"] as string);
			setLoading(false);
			setSignedIn(true);
		});
	};

	useEffect(() => {
		const localToken = localStorage.getItem("token");
		if (localToken) {
			setSignedIn(true);
		}
		listener();
	}, []);

	const loginWithBrowserClicked = async () => {
		setLoading(true);
		// eslint-disable-next-line @typescript-eslint/no-var-requires
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
					<button
						onClick={() => navigate("/tap")}
						className="font-bol flex items-center justify-center gap-1  text-teal-400 bg-teal-500/20 hover:(bg-teal-500/30) px-4 py-1 rounded"
					>
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
				<a
					onClick={loginWithBrowserClicked}
					href="https://trackmyfocus.co/auth/token"
					target="_blank"
					className="text-center w-full bg-teal-500/20 hover:(bg-teal-500/30) px-4 py-2 rounded"
				>
					Login With Browser
				</a>
			</div>
		);
	}
}
