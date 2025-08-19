import { z } from "zod"


const dateOnly = z
  .string()
  .transform((val) => {
    if (!val.endsWith("Z")){
      val = val + "Z"
    }
    return new Date(val)
  });

const WorkPhaseSchema = z.object({
  phId: z.string(),
  phMinStart: dateOnly.nullable().default(null),
  phMaxEnd: dateOnly.nullable().default(null),
  phScheduledStart: dateOnly,
  phScheduledEnd: dateOnly,
  phWorkDuration: z.number(),
  phPreviousPhasesIds: z.array(z.string()),
  phWeight: z.number(),
  wcId: z.string(),
  opIds: z.array(z.string()),
})

const WorkOrderSchema = z.object({
  woId: z.string(),
  woMinStart: dateOnly.nullable().default(null),
  woMaxEnd: dateOnly.nullable().default(null),
  phases: z.array(WorkPhaseSchema),
})

const WorkcenterSchema = z.object({
  wcId: z.string(),
  pauses: z.array(z.tuple([dateOnly, dateOnly]))
})

const OperatorSchema = z.object({
  opId: z.string(),
  pauses: z.array(z.tuple([dateOnly, dateOnly]))
})


const ScheduleSchema = z.object({
  orders: z.array(WorkOrderSchema),
  workCenters: z.array(WorkcenterSchema).default([]),
  operators: z.array(OperatorSchema).default([]),
})

type WorkPhase = z.infer<typeof WorkPhaseSchema>
type WorkOrder = z.infer<typeof WorkOrderSchema>
type Workcenter = z.infer<typeof WorkcenterSchema>
type Operator = z.infer<typeof OperatorSchema>
type Schedule = z.infer<typeof ScheduleSchema>

function validateSchedule(input: unknown): Schedule {
  return ScheduleSchema.parse(input) // throws if invalid
}

export type {WorkOrder, WorkPhase, Workcenter, Operator, Schedule}
export {validateSchedule}
