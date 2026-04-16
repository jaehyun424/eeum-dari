import { NextRequest, NextResponse } from 'next/server';
import { generateMatches } from '@/lib/matching/algorithm';
import {
  getCareRequestById,
  mockCareRequests,
} from '@/lib/mock/care-requests';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const careRequestId: string | undefined = body?.careRequestId;

    const careRequest =
      (careRequestId && getCareRequestById(careRequestId)) ||
      mockCareRequests[0];

    if (!careRequest) {
      return NextResponse.json(
        { error: '간병 신청 정보를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // UX 테스트용 지연
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = generateMatches(careRequest);

    return NextResponse.json(result);
  } catch (_err) {
    return NextResponse.json(
      { error: '매칭 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 },
    );
  }
}
