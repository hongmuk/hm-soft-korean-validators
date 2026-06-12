/**
 * 주민등록번호 (RRN, Resident Registration Number) 검증/파싱/마스킹.
 *
 * ⚠️ 2020년 10월 이후 발급분은 뒷자리가 임의 부여되어 체크섬을 만족하지 않을 수 있습니다.
 *    따라서 isValidRRN의 checksum 옵션을 false로 두면 형식만 검사합니다.
 */
import { digitsOnly } from "./util.js";

const WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];

/** 형식(13자리 + 생년월일 + 성별코드)만 검사. */
export function isValidRRNFormat(value: string): boolean {
  const d = digitsOnly(value);
  if (d.length !== 13) return false;
  const month = Number(d.slice(2, 4));
  const day = Number(d.slice(4, 6));
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const genderCode = Number(d[6]);
  // 1~8: 내국인/외국인 1900~2000년대, 9·0: 1800년대
  if (genderCode < 0 || genderCode > 9) return false;
  return true;
}

/** 체크섬(검증번호) 검사. 2020.10 이전 발급분에만 유효. */
export function isValidRRNChecksum(value: string): boolean {
  const d = digitsOnly(value);
  if (d.length !== 13) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(d[i]) * WEIGHTS[i];
  const check = (11 - (sum % 11)) % 10;
  return check === Number(d[12]);
}

/** 형식 + (기본) 체크섬 검사. checksum:false면 형식만. */
export function isValidRRN(value: string, opts: { checksum?: boolean } = {}): boolean {
  const checksum = opts.checksum ?? true;
  if (!isValidRRNFormat(value)) return false;
  return checksum ? isValidRRNChecksum(value) : true;
}

export interface RRNInfo {
  /** YYYY-MM-DD */
  birthDate: string;
  gender: "M" | "F";
  isForeigner: boolean;
  /** 만 나이. 기준일 미지정 시 시스템 현재 날짜 기준. */
  age: number;
}

/** 주민번호에서 생년월일·성별·내외국인·만나이를 추출. 형식 오류면 null. */
export function parseRRN(
  value: string,
  today?: { year: number; month: number; day: number },
): RRNInfo | null {
  if (!isValidRRNFormat(value)) return null;
  const d = digitsOnly(value);
  const genderCode = Number(d[6]);

  let century: number;
  let isForeigner = false;
  switch (genderCode) {
    case 9:
    case 0:
      century = 1800;
      break;
    case 1:
    case 2:
      century = 1900;
      break;
    case 3:
    case 4:
      century = 2000;
      break;
    case 5:
    case 6:
      century = 1900;
      isForeigner = true;
      break;
    case 7:
    case 8:
      century = 2000;
      isForeigner = true;
      break;
    default:
      return null;
  }

  const year = century + Number(d.slice(0, 2));
  const month = Number(d.slice(2, 4));
  const day = Number(d.slice(4, 6));
  const gender: "M" | "F" = genderCode % 2 === 1 ? "M" : "F";
  const birthDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const ref = today ?? nowParts();
  let age = ref.year - year;
  if (ref.month < month || (ref.month === month && ref.day < day)) age -= 1;

  return { birthDate, gender, isForeigner, age };
}

function nowParts(): { year: number; month: number; day: number } {
  const n = new Date();
  return { year: n.getFullYear(), month: n.getMonth() + 1, day: n.getDate() };
}

/** 하이픈 포맷: 901010-1234567 */
export function formatRRN(value: string): string {
  const d = digitsOnly(value);
  if (d.length !== 13) return value;
  return `${d.slice(0, 6)}-${d.slice(6)}`;
}

/** 마스킹: 901010-1****** (생년월일 + 성별자리만 노출) */
export function maskRRN(value: string, opts: { maskChar?: string } = {}): string {
  const mc = opts.maskChar ?? "*";
  const d = digitsOnly(value);
  if (d.length !== 13) return value;
  return `${d.slice(0, 6)}-${d[6]}${mc.repeat(6)}`;
}
