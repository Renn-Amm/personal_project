import {
  type EndingCard,
  type EndingPage,
  isEndingCardList,
  isEndingPage,
  isStory,
  type Story,
} from "../story/index.ts"
import { request } from "./request.ts"

export async function getStory(): Promise<Story> {
  return request<Story>("/story", isStory)
}

export async function getEndings(): Promise<EndingCard[]> {
  return request<EndingCard[]>("/endings", isEndingCardList)
}

export async function getEnding(id: string): Promise<EndingPage> {
  return request<EndingPage>(`/endings/${encodeURIComponent(id)}`, isEndingPage)
}
