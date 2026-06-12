/**
 * 사업자등록번호 (BRN, Business Registration Number) — 10자리 + 체크섬.
 */
import { digitsOnly } from "./util.js";

const WEIGHTS = [1, 3, 7, 1, 3, 7, 1, 3, 5];

/** 사업자등록번호 유효성(체크섬 포함) 검사. */
export function isValidBRN(value: string): boolean {
  const d = digitsOnly(value);
  if (d.length !== 10) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(d[i]) * WEIGHTS[i];
  sum += Math.floor((Number(d[8]) * 5) / 10);
  const check = (10 - (sum % 10)) % 10;
  return check === Number(d[9]);
}

/** 하이픈 포맷: 123-45-67890 */
export function formatBRN(value: string): string {
  const d = digitsOnly(value);
  if (d.length !== 10) return value;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}
