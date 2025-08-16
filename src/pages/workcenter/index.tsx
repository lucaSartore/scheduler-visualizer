import Highcharts from "highcharts/highcharts-gantt";
import "highcharts/modules/exporting";
import { useEffect } from "react";
import "./index.css";

export function WorkcenterPage() {
	useEffect(() => {
		Highcharts.ganttChart("main-chart", {
      // hcart 
    });
	}, []);

	return (
		<>
			<div id="main-chart"></div>
		</>
	);
}
