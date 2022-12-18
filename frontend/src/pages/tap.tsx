import { ReactElement, useEffect, useState } from "react";
import { ArrowRight, ClockStop, Cross, MoodLookLeft } from "tabler-icons-react";
import createSession from "../utils/createSession";
import registerDeFocus from "../utils/registerDeFocus";
import stopSession from "../utils/stopSession";

export default function TapMe(): ReactElement {
	const [name, setName] = useState("");
	const [nameCompleted, setNameCompleted] = useState(false);
	const [sessionId, setSessionId] = useState<string | null>(null);

	const initSession = async () => {
		const sessionDetails = await createSession(name);
		setSessionId(sessionDetails.id);
	};

	useEffect(() => {
		if (!nameCompleted) return;
		if (sessionId) return;

		initSession();
	}, [nameCompleted]);

	if (sessionId) {
		return (
			<div>
				<div className="h-full flex items-center justify-center">
					<div className="w-full grid grid-cols-2 gap-4">
						<button
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							onClick={() => stopSession(sessionId!)}
							className="flex items-center justify-center gap-1  text-orange-400 bg-orange-400/20 hover:(bg-orange-500/30) px-4 py-1 rounded"
						>
							<ClockStop
								size={20}
								strokeWidth={2}
								className="text-orange-400"
							/>
							Stop
						</button>
						<button
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							onClick={() => registerDeFocus(sessionId!)}
							className="font-bol flex items-center justify-center gap-1  text-teal-400 bg-teal-500/20 hover:(bg-teal-500/30) px-4 py-1 rounded"
						>
							<MoodLookLeft
								size={20}
								strokeWidth={2}
								className="text-teal-400"
							/>
							Distracted
						</button>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<div className="h-full flex items-center justify-center gap-2">
					<input
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						onChange={(e) => {
							setName(e.target.value);
						}}
						placeholder="Enter Session Name"
						className="bg-stone-800 border rounded border-light-200 px-2 py-1"
						type="text"
					/>
					<button
						disabled={name.length <= 0}
						className="flex items-center justify-center px-1 py-1 rouned bg-teal-600/20 disabled:(cursor-not-allowed)"
						onClick={() => setNameCompleted(true)}
					>
						<ArrowRight className="text-gray-300" />
					</button>
				</div>
			</div>
		);
	}
}
