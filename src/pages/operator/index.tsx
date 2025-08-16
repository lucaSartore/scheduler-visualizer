import Highcharts from "highcharts/highcharts-gantt";
import "highcharts/modules/exporting";
import { useContext, useEffect } from "react";
import "./index.css";
import { ScheduleStateContext } from "../../components/outer_page/outer_page";
import { ChartFactory } from "../../util/chart_factory/chart_factory";

export function OperatorPage() {

  const [ schedule, _ ] = useContext(ScheduleStateContext);
  var cf = new ChartFactory(schedule, "Operator")
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
