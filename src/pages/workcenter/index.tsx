import Highcharts from "highcharts/highcharts-gantt";
import "highcharts/modules/exporting";
import { useContext, useEffect } from "react";
import "./index.css";
import { ChartFactory } from "../../util/chart_factory/chart_factory";
import { ScheduleStateContext } from "../../components/outer_page/outer_page";

export function WorkcenterPage() {

  const [ schedule, _ ] = useContext(ScheduleStateContext);
  var cf = new ChartFactory(schedule, "Workcenter")
  var chart = cf.run();

	useEffect(() => {
		Highcharts.ganttChart("main-chart", chart);
	}, []);

	return (
		<>
			<div id="main-chart"></div>
		</>
	);
}
