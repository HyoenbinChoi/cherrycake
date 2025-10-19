import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // 필수 필드 검증
    if (!email || !message) {
      return NextResponse.json(
        { error: "이메일과 메시지는 필수입니다." },
        { status: 400 }
      );
    }

    // 이메일 형식 간단 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 형식이 아닙니다." },
        { status: 400 }
      );
    }

    // 콘솔에 로깅 (PM2 logs에 기록됨)
    console.log("📧 Contact Form Submission:", {
      name: name || "익명",
      email,
      message: message.substring(0, 100) + (message.length > 100 ? "..." : ""),
      timestamp: new Date().toISOString(),
    });

    // SMTP 설정이 있으면 이메일 발송
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.SMTP_TO || process.env.SMTP_USER,
          subject: `[cherrycake.me] ${name || '익명'}님의 문의`,
          text: `이름: ${name || '미입력'}\n이메일: ${email}\n\n메시지:\n${message}`,
          html: `
            <h2>새로운 문의가 도착했습니다</h2>
            <p><strong>이름:</strong> ${name || '미입력'}</p>
            <p><strong>이메일:</strong> ${email}</p>
            <p><strong>메시지:</strong></p>
            <p style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">발송 시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
          `,
          replyTo: email,
        });

        console.log('✅ 이메일 발송 성공 → ' + process.env.SMTP_TO);
      } catch (emailError) {
        console.error('❌ 이메일 발송 실패:', emailError);
        // 이메일 실패해도 사용자에게는 성공 응답 (내부 로깅만)
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "메시지가 성공적으로 전송되었습니다." 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
