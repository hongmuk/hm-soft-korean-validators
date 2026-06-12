/**
 * 우편번호 검증·포맷. 기본은 2015년 도입된 5자리 신우편번호.
 */
import { digitsOnly } from "./util.js";

/** 우편번호 유효성. 기본 5자리(신), opts.old=true면 6자리(구)도 허용. */
export function isValidPostalCode(value: string, opts: { old?: boolean } = {}): boolean {
  const d = digitsOnly(value);
  if (d.length === 5) return true;
  if (opts.old && d.length === 6) return true;
  return false;
}

/** 구 우편번호(6자리)는 135-090 형태로, 신(5자리)은 그대로 반환. */
export function formatPostalCode(value: string): string {
  const d = digitsOnly(value);
  if (d.length === 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return d;
}
