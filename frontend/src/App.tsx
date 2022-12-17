import { Suspense } from "react";
import { useRoutes } from "react-router";

import routes from "~react-pages";

export default function App() {
	return (
		<div>
			<Suspense fallback={<p>Loading...</p>}>{useRoutes(routes)}</Suspense>
		</div>
	);
}
