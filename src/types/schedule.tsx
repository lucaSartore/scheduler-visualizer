import { z } from "zod"

const WorkPhaseSchema = z.object({
  phId: z.string(),
  phMinStart: z.coerce.date().optional(),
  phMinEnd: z.coerce.date().optional(),
  phScheduledStart: z.coerce.date(),
  phScheduledEnd: z.coerce.date(),
  phWorkDuration: z.number(),
  phPreviousPhasesIds: z.array(z.string()),
  phWeight: z.number(),
  wcId: z.string(),
  opIds: z.array(z.string()),
})

const WorkOrderSchema = z.object({
  woId: z.string(),
  woMinStart: z.coerce.date().optional(),
  woMaxEnd: z.coerce.date().optional(),
  phases: z.array(WorkPhaseSchema),
})

const WorkcenterSchema = z.object({
  wcId: z.string(),
})

const OperatorSchema = z.object({
  opId: z.string(),
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
