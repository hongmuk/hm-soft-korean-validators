/**
 * 법인등록번호 (Corporate Registration Number) — 13자리 + 체크섬.
 * 가중치 1,2 교대 합산 후 검증번호 비교.
 */
import { digitsOnly } from "./util.js";

/** 법인등록번호 유효성(체크섬 포함) 검사. */
export function isValidCorpRegNo(value: string): boolean {
  const d = digitsOnly(value);
  if (d.length !== 13) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(d[i]) * (i % 2 === 0 ? 1 : 2);
  const check = (10 - (sum % 10)) % 10;
  return check === Number(d[12]);
}

/** 하이픈 포맷: 110111-1234567 */
export function formatCorpRegNo(value: string): string {
  const d = digitsOnly(value);
  if (d.length !== 13) return value;
  return `${d.slice(0, 6)}-${d.slice(6)}`;
}
