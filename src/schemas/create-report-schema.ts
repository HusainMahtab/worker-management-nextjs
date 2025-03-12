import {z} from "zod"

export const ReportSchema=z.object({
    reportFrom:z.string(),
    reportTo:z.string()
})