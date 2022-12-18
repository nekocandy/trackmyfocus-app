// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function createSession(sessionName: string) {
	const token = localStorage.getItem("token");

	if (!token) {
		return alert("no token, session not created");
	}
	if (!sessionName) {
		alert("No session name found, aborting");
		return;
	}

	const res = await fetch("https://api.trackmyfocus.co/api/sessions/create", {
		method: "POST",
		body: JSON.stringify({
			sessionName,
		}),
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	}).then((r) => r.json());

	return res;
}

export default createSession;
