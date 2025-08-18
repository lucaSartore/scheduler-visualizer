import { useContext, useEffect } from "react";
import "./index.css";
import { ScheduleStateContext } from "../../components/outer_page/outer_page";
import { ChartFactory } from "../../util/chart_factory/chart_factory";

export function OperatorPage() {

  const [ schedule, _ ] = useContext(ScheduleStateContext);

	useEffect(() => {
		new ChartFactory(schedule, "Operator", "main-chart")
	}, []);

	return (
		<>
      <div id="container">
        <div id="main-chart"></div>
      </div>
		</>
	);
}
