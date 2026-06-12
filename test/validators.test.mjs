import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isValidRRN,
  isValidRRNChecksum,
  parseRRN,
  formatRRN,
  maskRRN,
  isValidBRN,
  formatBRN,
  isValidCorpRegNo,
  formatCorpRegNo,
  isValidPhone,
  isMobilePhone,
  formatPhone,
  isValidPostalCode,
  formatPostalCode,
} from "../dist/index.js";

// ── 사업자등록번호 ── (124-81-00998: 실제 공개된 유효 번호, 체크섬 통과)
test("BRN: 유효/무효/포맷", () => {
  assert.equal(isValidBRN("124-81-00998"), true);
  assert.equal(isValidBRN("1248100998"), true);
  assert.equal(isValidBRN("124-81-00999"), false); // 체크섬 불일치
  assert.equal(isValidBRN("12345"), false); // 길이
  assert.equal(formatBRN("1248100998"), "124-81-00998");
});

// ── 법인등록번호 ── (110111-1234569: 체크섬 통과하도록 구성)
test("법인등록번호: 유효/무효/포맷", () => {
  assert.equal(isValidCorpRegNo("110111-1234569"), true);
  assert.equal(isValidCorpRegNo("1101111234568"), false);
  assert.equal(formatCorpRegNo("1101111234569"), "110111-1234569");
});

// ── 주민등록번호 ── (900101-1234568: 체크섬 통과하도록 구성한 가상 번호)
test("RRN: 체크섬 검증", () => {
  assert.equal(isValidRRNChecksum("900101-1234568"), true);
  assert.equal(isValidRRN("900101-1234568"), true);
  assert.equal(isValidRRN("900101-1234567"), false); // 체크섬 불일치
  assert.equal(isValidRRN("900101-1234567", { checksum: false }), true); // 형식만
  assert.equal(isValidRRN("901350-1234567"), false); // 월(13) 형식 오류
});

test("RRN: 파싱(생년월일/성별/나이)", () => {
  const info = parseRRN("900101-1234568", { year: 2026, month: 6, day: 13 });
  assert.deepEqual(info, { birthDate: "1990-01-01", gender: "M", isForeigner: false, age: 36 });
});

test("RRN: 포맷/마스킹", () => {
  assert.equal(formatRRN("9001011234568"), "900101-1234568");
  assert.equal(maskRRN("9001011234568"), "900101-1******");
});

// ── 전화번호 ──
test("전화번호: 검증/포맷", () => {
  assert.equal(isValidPhone("010-1234-5678"), true);
  assert.equal(isMobilePhone("01012345678"), true);
  assert.equal(isMobilePhone("02-123-4567"), false);
  assert.equal(isValidPhone("02-123-4567"), true); // 서울
  assert.equal(isValidPhone("031-123-4567"), true); // 경기
  assert.equal(isValidPhone("000-000"), false);
  assert.equal(formatPhone("01012345678"), "010-1234-5678");
  assert.equal(formatPhone("0212345678"), "02-1234-5678");
  assert.equal(formatPhone("021234567"), "02-123-4567");
});

// ── 우편번호 ──
test("우편번호: 신(5)/구(6)", () => {
  assert.equal(isValidPostalCode("06236"), true);
  assert.equal(isValidPostalCode("123456"), false); // 신은 5자리
  assert.equal(isValidPostalCode("123456", { old: true }), true);
  assert.equal(formatPostalCode("135090"), "135-090");
  assert.equal(formatPostalCode("06236"), "06236");
});
