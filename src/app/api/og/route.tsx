import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFFBF5 0%, #FFF5F5 100%)',
          position: 'relative',
        }}
      >
        {/* Background Patterns */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.15,
            display: 'flex',
          }}
        >
          {/* Dot Grid Pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, #FF6B9D 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* Floating Geometric Shapes */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '3px solid rgba(255, 107, 157, 0.2)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '12%',
            width: '80px',
            height: '80px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(255, 140, 107, 0.1) 100%)',
            display: 'flex',
          }}
        />

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 24px',
              borderRadius: '50px',
              background: 'linear-gradient(90deg, rgba(255, 107, 157, 0.1) 0%, rgba(255, 140, 107, 0.1) 100%)',
              border: '2px solid rgba(255, 107, 157, 0.2)',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#FF6B9D',
                letterSpacing: '0.02em',
              }}
            >
              Data × Emotion × AI
            </span>
          </div>

          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              marginBottom: '40px',
            }}
          >
            <h1
              style={{
                fontSize: '120px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#1A1A1A',
                margin: 0,
                lineHeight: 1,
              }}
            >
              cherrycake
            </h1>
            <span
              style={{
                fontSize: '120px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C6B 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                margin: 0,
                lineHeight: 1,
              }}
            >
              .
            </span>
            <span
              style={{
                fontSize: '120px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#1A1A1A',
                margin: 0,
                lineHeight: 1,
              }}
            >
              me
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: '36px',
              color: '#666666',
              margin: 0,
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.5,
            }}
          >
            패턴의 시대, 감각을 해석하다
          </p>
          <p
            style={{
              fontSize: '28px',
              color: '#999999',
              margin: '16px 0 0 0',
              textAlign: 'center',
            }}
          >
            문화의 결을 분석하고, 추상화하고, 다시 조형화합니다
          </p>
        </div>

        {/* Bottom Decorative Element */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#FF6B9D',
              display: 'flex',
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#4ECDC4',
              display: 'flex',
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#9D4EDD',
              display: 'flex',
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
