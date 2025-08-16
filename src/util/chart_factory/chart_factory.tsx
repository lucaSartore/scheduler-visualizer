import Highcharts from "highcharts/highcharts-gantt";
import { Schedule, WorkPhase } from "../../types/schedule";
import distinctColors from 'distinct-colors'


type ChartKind = "Operator" | "Workcenter"

class ChartFactory{

  schedule: Schedule;
  output: Highcharts.Options;
  kind: ChartKind;
  orderColorAssociation: Map<string, string>;

  constructor(schedule: Schedule, kind: ChartKind){
    this.schedule = schedule;
    this.output = {};
    this.kind = kind;
    this.orderColorAssociation = new Map();
  }

  _getYAxisCategories(): Array<string>{
    if (this.kind == "Operator"){
      return this.schedule.operators.map(x => x.opId);
    }else{
      return this.schedule.workCenters.map(x => x.wcId);
    }
  }

  _getYAxisIndex(category: string): number {
    var axis = this.output.yAxis!;
    if (Array.isArray(axis)){
      throw Error("Expected only one axis")
    }
    return axis.categories!.indexOf(category)
  }

  addDefaultSeries(){
    var colors = distinctColors({
      count: this.schedule.orders.length
    })

    this.schedule.orders.forEach((order, i) => {
      this.output.series!.push({
        name: order.woId,
        type: "gantt",
        color: colors[i].hex(),
        data: []
      })
    })
  
    return this;
  }

  addDefaultStructure(){
    const categories = this._getYAxisCategories();
    this.output = {
      title: {
          text: `Schedule output ("${this.kind}" view)`
      },
      yAxis: {
        categories: categories
      },
      series: []
    };
    return this;
  }

  _getAssignedCategories(phase: WorkPhase): Array<string> {
    if (this.kind == "Operator"){
      return phase.opIds;
    }else{
      return [phase.wcId];
    }
  }


  addOrders(){
    this.schedule.orders.forEach((order) => {

      order.phases.forEach((phase) => {
        this._getAssignedCategories(phase).forEach(category => {
          const series = this.output.series!.find(x => x.name == order.woId)!;

          // this assertion is necessary to make ts compiler happy
          if(series.type != "gantt"){
            throw Error("Got wrong series type")
          }

          series.data!.push({
            start: phase.phScheduledStart.toString(),
            end: phase.phScheduledEnd.toString(),
            name: `${order.woId}-${phase.phId}`,
            color: series.color,
            y: this._getYAxisIndex(category)
          })
        });
      });
    });

    return this;
  }

  run(){
    this
      .addDefaultStructure()
      .addDefaultSeries()
      .addOrders()
    return this.output;
  }
}

export {ChartFactory}
