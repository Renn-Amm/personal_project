const SERVER = "http://localhost:3000"

export async function request<Reply extends object = object>(
  path: string,
  isReply: (value: unknown) => value is Reply,
  init?: RequestInit,
): Promise<Reply> {
  let response: Response

  try {
    response = await fetch(`${SERVER}${path}`, init)
  } catch {
    throw new Error(
      `No signal from the archive at ${SERVER}. Is the server running?`,
    )
  }

  let body: unknown

  try {
    body = await response.json()
  } catch {
    body = undefined
  }

  if (!response.ok) {
    throw new Error(errorOf(body) ?? `The archive answered ${response.status}`)
  }

  if (!isReply(body)) {
    throw new Error(`The archive sent a broken reply for ${path}`)
  }

  return body
}

function errorOf(body: unknown): string | undefined {
  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string"
  ) {
    return body.error
  }

  return undefined
}
