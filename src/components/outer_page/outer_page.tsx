import React from "react";
import { useState } from "react";
import { validateSchedule, type Schedule } from "../../types/schedule";
import { TopBar } from "../top_bar/top_bar";

const defaultSchedule: Schedule = {
  orders: [],
  workCenters: [],
  operators: []
}

type ContextType = [Schedule, (_: unknown) => void]
export const ScheduleStateContext = React.createContext<ContextType>([defaultSchedule, (_) => {}]);

function OuterPage(props: any){
  
  const [schedule, _setSchedule] = useState<Schedule>(defaultSchedule)

  function setSchedule(schedule_input: unknown): void {
    const schedule_output = validateSchedule(schedule_input)
    _setSchedule(schedule_output)
  }

 return (
    <ScheduleStateContext.Provider value={[schedule, setSchedule]}>
     <TopBar/>
     {props.children}
    </ScheduleStateContext.Provider>
  );
}

export {OuterPage}
