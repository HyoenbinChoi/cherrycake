import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Beethoven Große Fuge Op.133 - cherrycake.me';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
          background: 'linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)',
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
            opacity: 0.1,
            display: 'flex',
          }}
        >
          {/* Diagonal Stripes */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(255, 107, 157, 0.5) 0px, rgba(255, 107, 157, 0.5) 2px, transparent 2px, transparent 42px)',
              display: 'flex',
            }}
          />
        </div>

        {/* Floating Geometric Shapes */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '3px solid rgba(255, 107, 157, 0.3)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '100px',
            height: '100px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.2) 0%, rgba(157, 78, 221, 0.2) 100%)',
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
            padding: '0 80px',
          }}
        >
          {/* Project Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 28px',
              borderRadius: '50px',
              background: 'linear-gradient(90deg, rgba(255, 107, 157, 0.2) 0%, rgba(255, 140, 107, 0.2) 100%)',
              border: '2px solid rgba(255, 107, 157, 0.4)',
              marginBottom: '40px',
            }}
          >
            <span
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: '#FF6B9D',
                letterSpacing: '0.02em',
              }}
            >
              Featured Project
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#FFFBF5',
              margin: '0 0 24px 0',
              lineHeight: 1.1,
              textAlign: 'center',
            }}
          >
            Beethoven Große Fuge
          </h1>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 600,
              color: '#999999',
              margin: '0 0 40px 0',
              textAlign: 'center',
            }}
          >
            Op.133
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: '32px',
              color: '#CCCCCC',
              margin: 0,
              textAlign: 'center',
              maxWidth: '1000px',
              lineHeight: 1.5,
            }}
          >
            베토벤 대 푸가의 구조적 긴장과 해소를
            <br />
            다각도로 분석한 종합 프로젝트
          </p>

          {/* Metrics */}
          <div
            style={{
              display: 'flex',
              gap: '48px',
              marginTop: '48px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #4ECDC4 0%, #9D4EDD 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                7
              </div>
              <div style={{ fontSize: '18px', color: '#888888', marginTop: '4px' }}>
                Visualizations
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #4ECDC4 0%, #9D4EDD 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                10K+
              </div>
              <div style={{ fontSize: '18px', color: '#888888', marginTop: '4px' }}>
                Data Points
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #4ECDC4 0%, #9D4EDD 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                788
              </div>
              <div style={{ fontSize: '18px', color: '#888888', marginTop: '4px' }}>
                Measures
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Site Logo */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#666666',
              letterSpacing: '-0.02em',
            }}
          >
            cherrycake
          </div>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C6B 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            .
          </span>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#666666',
              letterSpacing: '-0.02em',
            }}
          >
            me
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
