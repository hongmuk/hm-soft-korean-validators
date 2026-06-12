# @hm-soft/korean-validators

한국에서 자주 쓰는 식별번호를 **검증·파싱·포맷·마스킹**하는 의존성 없는 유틸 모음.
주민등록번호·사업자등록번호·법인등록번호는 **체크섬까지** 검사합니다.

## 설치

```bash
npm install @hm-soft/korean-validators
```

## 사용

```ts
import {
  isValidBRN, formatBRN,
  isValidRRN, parseRRN, maskRRN,
  isValidCorpRegNo,
  isValidPhone, formatPhone,
  isValidPostalCode,
} from "@hm-soft/korean-validators";

isValidBRN("124-81-00998");        // true (체크섬 검증)
formatBRN("1248100998");           // "124-81-00998"

isValidRRN("900101-1234568");      // true
parseRRN("900101-1234568");        // { birthDate:"1990-01-01", gender:"M", isForeigner:false, age:36 }
maskRRN("9001011234568");          // "900101-1******"

isValidCorpRegNo("110111-1234569");// true

isValidPhone("02-123-4567");       // true
formatPhone("01012345678");        // "010-1234-5678"

isValidPostalCode("06236");        // true (신 5자리)
```

## API

| 분류 | 함수 |
|------|------|
| 주민등록번호 | `isValidRRN(v, {checksum?})`, `isValidRRNFormat`, `isValidRRNChecksum`, `parseRRN`, `formatRRN`, `maskRRN` |
| 사업자등록번호 | `isValidBRN`, `formatBRN` |
| 법인등록번호 | `isValidCorpRegNo`, `formatCorpRegNo` |
| 전화번호 | `isValidPhone`, `isMobilePhone`, `formatPhone` |
| 우편번호 | `isValidPostalCode(v, {old?})`, `formatPostalCode` |

## 참고

- **주민등록번호 체크섬**: 2020년 10월 이후 발급분은 뒷자리가 임의 부여되어 체크섬을 만족하지 않을 수 있습니다.
  이 경우 `isValidRRN(v, { checksum: false })`로 형식만 검사하세요.
- 모든 함수는 하이픈·공백이 섞여 있어도 동작합니다(숫자만 추출).

## License

Apache-2.0
