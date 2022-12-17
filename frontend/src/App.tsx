import { ReactElement, Suspense } from "react";
import { useRoutes } from "react-router";

import routes from "~react-pages";

export default function App(): ReactElement {
	return (
		<div className="h-screen bg-stone-900 text-light-700 py-6 px-6">
			<div className="h-full max-w-lg mx-auto">
				<Suspense fallback={<p>Loading...</p>}>{useRoutes(routes)}</Suspense>
			</div>
		</div>
	);
}
