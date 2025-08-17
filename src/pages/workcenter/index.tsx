import "highcharts/modules/exporting";
import { useContext, useEffect } from "react";
import "./index.css";
import { ChartFactory } from "../../util/chart_factory/chart_factory";
import { ScheduleStateContext } from "../../components/outer_page/outer_page";


export function WorkcenterPage() {
	const [schedule, _] = useContext(ScheduleStateContext);

	useEffect(() => {
    new ChartFactory(schedule, "Workcenter", "main-chart");
	}, []);

	return (
		<>
			<div id="main-chart"></div>
		</>
	);
}
