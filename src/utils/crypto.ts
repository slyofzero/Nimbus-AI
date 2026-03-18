import crypto from "crypto";
import { ENCRYPTION_KEY } from "./env";
import { stopScript } from "./handlers";

const ALGORITHM = "aes-256-ctr";
const IV_LENGTH = 16;

export function encrypt(item: string): string {
  if (!ENCRYPTION_KEY) {
    stopScript("ENCRYPTION_KEY is undefined");
    return "";
  }

  // Key must be 32 bytes for aes-256
  const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32));
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(item, "utf8"),
    cipher.final(),
  ]);

  // Prepend IV to encrypted output so decrypt can use it
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(item: string): string {
  if (!ENCRYPTION_KEY) {
    stopScript("ENCRYPTION_KEY is undefined");
    return "";
  }

  const [ivHex, encryptedHex] = item.split(":");
  const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32));
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8",
  );
}
