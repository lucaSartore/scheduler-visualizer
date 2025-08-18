import Highcharts from "highcharts/highcharts-gantt";
import { Schedule, WorkPhase } from "../../types/schedule";
import distinctColors from "distinct-colors";

type ChartKind = "Operator" | "Workcenter";

class ChartFactory {
	schedule: Schedule;
	output: Highcharts.Options;
	kind: ChartKind;
	orderColorAssociation: Map<string, string>;
	readonly chart: Highcharts.GanttChart | null = null;
	constructor(schedule: Schedule, kind: ChartKind, divName: string) {
		this.schedule = schedule;
		this.output = {};
		this.kind = kind;
		this.orderColorAssociation = new Map();
		this.chart = this.build(divName);
	}

	_getYAxisCategories(): Array<string> {
		if (this.kind == "Operator") {
			return this.schedule.operators.map((x) => x.opId);
		} else {
			return this.schedule.workCenters.map((x) => x.wcId);
		}
	}

	_getYAxisIndex(category: string): number {
		var axis = this.output.yAxis!;
		if (Array.isArray(axis)) {
			throw Error("Expected only one axis");
		}
		return axis.categories!.indexOf(category);
	}

	addDefaultSeries() {
		var colors = distinctColors({
			count: this.schedule.orders.length,
		});

		this.schedule.orders.forEach((order, i) => {
			this.output.series!.push({
				name: order.woId,
				id: order.woId,
				type: "gantt",
				color: colors[i].hex(),
				data: [],
			});
		});

		return this;
	}

	addDefaultStructure() {
		const categories = this._getYAxisCategories();
		this.output = {
			title: {
				text: `Schedule output ("${this.kind}" view)`,
			},
			navigator: {
				enabled: true,
				// @ts-ignore
				liveRedraw: true,
				series: {
					data: [],
				},
			},
			scrollbar: {
				enabled: true,
			},
			rangeSelector: {
				enabled: true,
			},
			xAxis: {
				minRange: 24 * 3600 * 1000, // min zoom is one day
			},
			yAxis: {
				categories: categories,
			},
			plotOptions: {
				gantt: {
					connectors: {
						lineColor: "#00000000",
						startMarker: {
							enabled: false,
						},
            lineWidth: 2,
            radius: 5,
					},
				},
				series: {
          // @ts-ignore
          borderRadius: '25%',
					events: {}
				},
			},
			series: [],
		};
		return this;
	}

	_getAssignedCategories(phase: WorkPhase): Array<string> {
		if (this.kind == "Operator") {
			return phase.opIds;
		} else {
			return [phase.wcId];
		}
	}

	_dateToString(date: Date): string {
		return date.toISOString().replace(".000Z", "").replace("T", " ");
	}

	addOrders() {
		this.schedule.orders.forEach((order) => {
			order.phases.forEach((phase) => {
				this._getAssignedCategories(phase).forEach((category) => {
					const series = this.output.series!.find((x) => x.name == order.woId)!;

					// this assertion is necessary to make ts compiler happy
					if (series.type != "gantt") {
						throw new Error("Got wrong series type");
					}

					series.data!.push({
						start: this._dateToString(phase.phScheduledStart),
						end: this._dateToString(phase.phScheduledEnd),
						name: `${order.woId}-${phase.phId}`,
						id: `${order.woId}-${phase.phId}`,
						dependency: phase.phPreviousPhasesIds.map((x) => {
							return {
								to: `${order.woId}-${x}`,
							};
						}),
						color: series.color,
						y: this._getYAxisIndex(category),
					});
				});
			});
		});

		return this;
	}

	addNavigatorSeries() {
		//@ts-ignore
		var newSerie = this.output.series!.reduce((list, series) => {
			if (series.type != "gantt") {
				throw new Error("Got wrong series type");
			}
			//@ts-ignore
			return list.concat(series.data);
		}, []);

		//@ts-ignore
		this.output.navigator!.series.data = newSerie;
		return this;
	}

	build(containerName: string) {
		this.addDefaultStructure()
			.addDefaultSeries()
			.addOrders()
			.addNavigatorSeries()
			.addClickCallback()
      .addPauses();
		return Highcharts.ganttChart(containerName, this.output);
	}

	setDependencyVisibility(visible: boolean) {
		if (this.chart == null) {
			throw new Error(
				"Chart must have being build before this function is called",
			);
		}

		this.chart.update({
			plotOptions: {
				gantt: {
					connectors: {
						lineColor: visible ? "#000000" : "#00000000",
					},
				},
			},
		});
	}

  _getPeoplePauses(){
    //Highcharts.GanttPointOptionsObject
    var data: Array<any> = []

    this.schedule.operators.forEach(op => {
      var index = this._getYAxisIndex(op.opId)
      op.pauses.forEach(pause => {
        data.push({
          start: pause[0],
          end: pause[1],
          y: index,
          color: "gray"
        })
      })
    })

    return data
  }
  _getWcPauses(){
    //Highcharts.GanttPointOptionsObject
    var data: Array<any> = []

    this.schedule.workCenters.forEach(wc => {
      var index = this._getYAxisIndex(wc.wcId)
      wc.pauses.forEach(pause => {
        data.push({
          start: this._dateToString(pause[0]),
          end: this._dateToString(pause[1]),
          y: index,
          color: "gray"
        })
      })
    })

    return data
  }
  _getPauses(){
    if (this.kind == "Operator"){
      return this._getPeoplePauses();
    } else {
      return this._getWcPauses();
    }
  }

  addPauses() {

    if (!Array.isArray(this.output.series)){
      throw Error()
    }

    this.output.series.unshift({
        type: "gantt",
        enableMouseTracking: false,
        borderRadius: 0,
        pointPadding: 0,
        groupPadding: 0,
        opacity: 0.6,
        data: this._getPauses()
    })

    console.log(this.output)
    return this
  }

	addClickCallback() {

    var updateSeries = (series: string, color: string) => {
        this.chart!.update({ 
          series: [{
            id: series,
            type: "gantt",
            connectors: {
              lineColor: color
            }
          }]
        })
      }

    // change color to black when mouse over
    this.output.plotOptions!.series!.events!.mouseOver = (event) => {
      // @ts-ignore
      var name = event.target!.name
      updateSeries(name, "#000000")
    }
    // change color to transparent when mouse out
    this.output.plotOptions!.series!.events!.mouseOut = (event) => {
      // @ts-ignore
      var name = event.target!.name
      updateSeries(name, "#00000000")
    }
    return this
  }
}

export { ChartFactory };
