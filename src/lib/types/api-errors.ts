// API 에러 응답 표준 포맷
// 모든 API 라우트는 이 포맷을 사용해 { error, code } 구조로 응답한다

export enum ApiErrorCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}

export type ApiErrorResponse = {
  error: string; // 사용자에게 보일 한국어 메시지
  code: ApiErrorCode; // 클라이언트가 분기에 쓰는 기계 코드
  details?: string; // dev 환경에서만 포함 — 프로덕션 스택 트레이스 노출 금지
};
