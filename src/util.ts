/** 입력에서 숫자만 추출 (하이픈·공백 등 제거). */
export function digitsOnly(value: string): string {
  return (value ?? "").replace(/\D/g, "");
}
