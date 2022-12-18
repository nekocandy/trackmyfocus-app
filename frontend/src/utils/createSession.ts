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

	const res = await fetch("http://localhost:2047", {
		method: "POST",
		body: JSON.stringify({
			sessionName,
		}),
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then((r) => r.json());

	console.log(res);
	return res;
}

export default createSession;
