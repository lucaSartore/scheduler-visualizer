import {  useNavigate } from "react-router";
import Icon from '@mdi/react';
import { mdiUpload, mdiAccountGroup, mdiCogs } from '@mdi/js';
import "./top_bar.css"

export function TopBar() {
	const navigate = useNavigate();

	return (
		<>
			<div className="navigation-bar">

				<div className="button-div" onClick={() => navigate("/upload")} >
					<Icon path={mdiUpload} className="button-icon" />
          <h1 className="button-text">Upload Schedule</h1>
				</div>

				<div className="button-div" onClick={() => navigate("/workcenter")} >
					<Icon path={mdiCogs} className="button-icon" />
          <h1 className="button-text">Workcenter view</h1>
				</div>

				<div className="button-div" onClick={() => navigate("/operator")} >
					<Icon path={mdiAccountGroup} className="button-icon" />
          <h1 className="button-text">Operator view</h1>
				</div>
			</div>
		</>
	);
}
