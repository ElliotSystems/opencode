import { describe, expect, test } from "bun:test"
import { isImageAttachment, isMedia, isPdfAttachment, sniffAttachmentMime } from "../../src/util/media"

describe("attachment mime helpers", () => {
  test("isPdfAttachment matches only application/pdf", () => {
    expect(isPdfAttachment("application/pdf")).toBe(true)
    expect(isPdfAttachment("text/plain")).toBe(false)
    expect(isPdfAttachment("image/png")).toBe(false)
  })

  test("isMedia accepts image types and pdf", () => {
    expect(isMedia("image/png")).toBe(true)
    expect(isMedia("application/pdf")).toBe(true)
    expect(isMedia("text/plain")).toBe(false)
    expect(isMedia("application/json")).toBe(false)
  })

  test("isImageAttachment excludes svg and fastbidsheet images", () => {
    expect(isImageAttachment("image/png")).toBe(true)
    expect(isImageAttachment("image/svg+xml")).toBe(false)
    expect(isImageAttachment("image/vnd.fastbidsheet")).toBe(false)
  })
})

describe("sniffAttachmentMime", () => {
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  const webp = [0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]

  test("detects common image signatures", () => {
    expect(sniffAttachmentMime(new Uint8Array(png), "fallback")).toBe("image/png")
    expect(sniffAttachmentMime(new Uint8Array([0xff, 0xd8, 0xff]), "fallback")).toBe("image/jpeg")
    expect(sniffAttachmentMime(new Uint8Array([0x47, 0x49, 0x46, 0x38]), "fallback")).toBe("image/gif")
    expect(sniffAttachmentMime(new Uint8Array([0x42, 0x4d]), "fallback")).toBe("image/bmp")
    expect(sniffAttachmentMime(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]), "fallback")).toBe("application/pdf")
  })

  test("detects webp via RIFF container with WEBP tag at offset 8", () => {
    expect(sniffAttachmentMime(new Uint8Array(webp), "fallback")).toBe("image/webp")
  })

  test("returns the fallback for unknown bytes", () => {
    expect(sniffAttachmentMime(new Uint8Array([0x00, 0x01, 0x02]), "text/plain")).toBe("text/plain")
    expect(sniffAttachmentMime(new Uint8Array(), "application/octet-stream")).toBe("application/octet-stream")
  })

  test("does not misread RIFF without a WEBP tag", () => {
    const wav = [0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45]
    expect(sniffAttachmentMime(new Uint8Array(wav), "audio/wav")).toBe("audio/wav")
  })
})
