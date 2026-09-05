import { describe, it, expect } from "vitest";
import { generateSHA256Hash } from "@/lib/utils";
import { createHash } from "node:crypto";

describe("Cryptographic SHA-256 Hashing (Web Crypto API)", () => {
  it("matches NIST standard test vector for an empty string", async () => {
    const emptyStringHash = await generateSHA256Hash("");
    // NIST Standard SHA-256 hash for empty input:
    // e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    expect(emptyStringHash).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });

  it("produces valid 64-character lowercase hex digest for text strings matching reference crypto", async () => {
    const sampleText = "Slipstats Form 4A Exhibit Audit Hash — Maintenance Court";
    const result = await generateSHA256Hash(sampleText);

    const referenceHash = createHash("sha256").update(sampleText).digest("hex");
    expect(result).toBe(referenceHash);
    expect(result).toMatch(/^[0-9a-f]{64}$/);
  });

  it("hashes binary buffer / Blob data accurately", async () => {
    const bytes = new Uint8Array([0xde, 0xad, 0xbe, 0xef, 0x01, 0x02, 0x03, 0x04]);
    const blob = new Blob([bytes], { type: "application/octet-stream" });

    const result = await generateSHA256Hash(blob);
    const referenceHash = createHash("sha256").update(Buffer.from(bytes)).digest("hex");

    expect(result).toBe(referenceHash);
    expect(result).toHaveLength(64);
  });

  it("hashes File objects accurately", async () => {
    const fileContent = "CHECKERS HYPER SANDTON TAX INVOICE VAT 471010 R184.60";
    const file = new File([fileContent], "till_slip.txt", { type: "text/plain" });

    const result = await generateSHA256Hash(file);
    const referenceHash = createHash("sha256").update(fileContent).digest("hex");

    expect(result).toBe(referenceHash);
  });

  it("exhibits deterministic idempotence and avalanche effect", async () => {
    const inputA = "Maintenance Act 99 of 1998 Section 6(1)";
    const inputB = "Maintenance Act 99 of 1998 Section 6(2)"; // 1 character difference

    const hashA1 = await generateSHA256Hash(inputA);
    const hashA2 = await generateSHA256Hash(inputA);
    const hashB = await generateSHA256Hash(inputB);

    // Idempotent
    expect(hashA1).toBe(hashA2);
    // Avalanche effect: single char difference yields completely different hash
    expect(hashA1).not.toBe(hashB);
  });
});
