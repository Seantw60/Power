import { describe, expect, it } from "vitest"
import { hashPassword, verifyPassword } from "@/lib/auth"

describe("auth password helpers", () => {
  it("hashes and verifies a valid password", async () => {
    const password = "password123"
    const hashedPassword = await hashPassword(password)

    expect(hashedPassword).not.toBe(password)
    await expect(verifyPassword(password, hashedPassword)).resolves.toBe(true)
  })

  it("rejects an invalid password", async () => {
    const hashedPassword = await hashPassword("password123")

    await expect(verifyPassword("wrong-password", hashedPassword)).resolves.toBe(false)
  })
})

