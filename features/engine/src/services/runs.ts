import {
  type Checkpoint,
  isSavedRun,
  isSavedRunList,
  type SavedRun,
} from "../checkpoint/index.ts"
import { request } from "./request.ts"

export async function saveRun(checkpoint: Checkpoint): Promise<SavedRun> {
  return request<SavedRun>("/runs", isSavedRun, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(checkpoint),
  })
}

export async function getRuns(pilot: string): Promise<SavedRun[]> {
  return request<SavedRun[]>("/runs", isSavedRunList, {
    headers: { "x-pilot": pilot },
  })
}
