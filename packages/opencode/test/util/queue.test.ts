import { describe, expect, test } from "bun:test"
import { AsyncQueue, work } from "../../src/util/queue"

describe("AsyncQueue", () => {
  test("delivers buffered items in FIFO order", async () => {
    const queue = new AsyncQueue<number>()
    queue.push(1)
    queue.push(2)
    queue.push(3)
    expect(await queue.next()).toBe(1)
    expect(await queue.next()).toBe(2)
    expect(await queue.next()).toBe(3)
  })

  test("resolves a pending next() when an item arrives later", async () => {
    const queue = new AsyncQueue<string>()
    const pending = queue.next()
    queue.push("a")
    expect(await pending).toBe("a")
  })

  test("interleaves buffered and awaited consumption without losing items", async () => {
    const queue = new AsyncQueue<number>()
    queue.push(1)
    const pending = queue.next()
    queue.push(2)
    expect(await pending).toBe(1)
    expect(await queue.next()).toBe(2)
  })
})

describe("work", () => {
  test("processes every item exactly once across concurrent workers", async () => {
    const processed: number[] = []
    await work(4, [1, 2, 3, 4, 5, 6, 7], async (item) => {
      processed.push(item)
    })
    expect(processed.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  test("completes immediately for an empty item list", async () => {
    let calls = 0
    await work(3, [], async () => {
      calls++
    })
    expect(calls).toBe(0)
  })
})
