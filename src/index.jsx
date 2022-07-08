import React from "react";

// DOMマウントを行う際のルート設定に必要なModule
import { createRoot } from "react-dom/client";

import { App } from "./App";

// id=rootを持つ要素にApp.jsのTemplateをマウント
createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
