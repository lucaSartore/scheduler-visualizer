import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { OperatorPage } from "./pages/operator";
import { WorkcenterPage } from "./pages/workcenter";
import { UploadPage } from "./pages/upload";
import { OuterPage } from "./components/outer_page/outer_page";
import "./main.css"



// just a trick to make single page app work in github-pages
// credit: https://github.com/rafgraph/spa-github-pages
(function (l) {
	if (l.search[1] === "/") {
		var decoded = l.search
			.slice(1)
			.split("&")
			.map(function (s) {
				return s.replace(/~and~/g, "&");
			})
			.join("?");
		window.history.replaceState(
			null,
			//@ts-ignore
			null,
			l.pathname.slice(0, -1) + decoded + l.hash,
		);
	}
})(window.location);


ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
    <BrowserRouter>
      <OuterPage>
        <Routes>
          <Route path="/" element={<Navigate to={"/upload"} replace />} />
          <Route path="/upload" element={<UploadPage/>} />
          <Route path="/workcenter" element={<WorkcenterPage/>} />
          <Route path="/operator" element={<OperatorPage/>} />
          <Route path="*" element={<h1>404 page </h1>} />
        </Routes>
      </OuterPage>
    </BrowserRouter>
	</React.StrictMode>,
);
