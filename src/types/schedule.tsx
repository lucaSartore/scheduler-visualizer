import { z } from "zod"

const WorkPhaseSchema = z.object({
  phId: z.string(),
  pdName: z.string(),
  phMinStart: z.coerce.date().optional(),
  phMinEnd: z.coerce.date().optional(),
  phScheduledStart: z.coerce.date(),
  phScheduledEnd: z.coerce.date(),
  phWorkDuration: z.number(),
  phPreviousPhasesIds: z.array(z.string()),
  phWeight: z.number(),
})

const WorkOrderSchema = z.object({
  woId: z.string(),
  woName: z.string(),
  woMinStart: z.coerce.date().optional(),
  woMaxEnd: z.coerce.date().optional(),
  phases: z.array(WorkPhaseSchema),
})

const ScheduleSchema = z.object({
  orders: z.array(WorkOrderSchema),
})

type WorkPhase = z.infer<typeof WorkPhaseSchema>
type WorkOrder = z.infer<typeof WorkOrderSchema>
type Schedule = z.infer<typeof ScheduleSchema>

function validateSchedule(input: unknown): Schedule {
  return ScheduleSchema.parse(input) // throws if invalid
}

export type {WorkOrder, WorkPhase, Schedule}
export {validateSchedule}
