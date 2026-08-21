import { describe, expect, test } from "bun:test"
import { join, split } from "../../src/util/bom"

describe("bom", () => {
  test("split detects and strips a leading BOM", () => {
    expect(split("\uFEFFhello")).toEqual({ bom: true, text: "hello" })
  })

  test("split passes through text without a BOM", () => {
    expect(split("hello")).toEqual({ bom: false, text: "hello" })
    expect(split("")).toEqual({ bom: false, text: "" })
  })

  test("join adds a BOM only when requested", () => {
    expect(join("hello", true)).toBe("\uFEFFhello")
    expect(join("hello", false)).toBe("hello")
  })

  test("join strips an existing BOM before applying the target state", () => {
    expect(join("\uFEFFhello", false)).toBe("hello")
    expect(join("\uFEFFhello", true)).toBe("\uFEFFhello")
  })
})
