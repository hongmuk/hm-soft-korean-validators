/**
 * @hm-soft/korean-validators
 * 한국 주민·사업자·법인·전화·우편번호 검증/포맷 유틸 모음.
 *
 *   import { isValidBRN, formatBRN, parseRRN, isValidPhone } from "@hm-soft/korean-validators";
 */
export {
  isValidRRN,
  isValidRRNFormat,
  isValidRRNChecksum,
  parseRRN,
  formatRRN,
  maskRRN,
} from "./rrn.js";
export type { RRNInfo } from "./rrn.js";

export { isValidBRN, formatBRN } from "./brn.js";
export { isValidCorpRegNo, formatCorpRegNo } from "./corp.js";
export { isValidPhone, isMobilePhone, formatPhone } from "./phone.js";
export { isValidPostalCode, formatPostalCode } from "./postal.js";
export { digitsOnly } from "./util.js";
