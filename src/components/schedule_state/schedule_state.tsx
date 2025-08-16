import { useState } from "react";
import { validateSchedule, type Schedule } from "../../types/schedule";


const [schedule, _setSchedule] = useState<Schedule | null>(null)

function setSchedule(schedule_input: unknown): void {
  const schedule_output = validateSchedule(schedule_input)
  _setSchedule(schedule_output)
}

export {schedule, setSchedule}
