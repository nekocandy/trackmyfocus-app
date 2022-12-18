export default async function stopSession(sessionId: string): Promise<void> {
	const token = localStorage.getItem("token");

	if (!token) {
		return alert("no token, session not created");
	}
	if (!sessionId) {
		return;
	}

	const res = await fetch("https://api.trackmyfocus.co/api/sessions/stop", {
		method: "POST",
		body: JSON.stringify({
			sessionId,
		}),
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	}).then((r) => r.json());

	return res;
}
