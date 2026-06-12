/**
 * 한국 전화번호 / 휴대폰번호 검증·포맷.
 */
import { digitsOnly } from "./util.js";

const MOBILE = /^01[016789]\d{7,8}$/;
const SEOUL = /^02\d{7,8}$/;
const INTERNET = /^070\d{7,8}$/;
const AREA = /^0(3[1-3]|4[1-4]|5[1-5]|6[1-4])\d{6,8}$/;

/** 휴대폰 번호(010 등)인지. */
export function isMobilePhone(value: string): boolean {
  return MOBILE.test(digitsOnly(value));
}

/** 휴대폰·서울·지역·인터넷(070) 번호를 포함한 일반 유효성 검사. */
export function isValidPhone(value: string): boolean {
  const d = digitsOnly(value);
  return MOBILE.test(d) || SEOUL.test(d) || INTERNET.test(d) || AREA.test(d);
}

/** 하이픈 포맷: 010-1234-5678 / 02-1234-5678 / 031-123-4567 */
export function formatPhone(value: string): string {
  const d = digitsOnly(value);
  if (!d.startsWith("0")) return value;
  const areaLen = d.startsWith("02") ? 2 : 3;
  if (d.length <= areaLen + 4) return value;
  const rest = d.slice(areaLen);
  const last = rest.slice(-4);
  const mid = rest.slice(0, -4);
  return [d.slice(0, areaLen), mid, last].filter(Boolean).join("-");
}
