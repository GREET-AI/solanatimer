export default function Test123Page() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
      <h1 style={{ color: '#14F195', fontSize: '3rem', fontFamily: 'monospace' }}>
        Dummy Test123 Page – {new Date().toLocaleString()}
      </h1>
    </div>
  );
} 