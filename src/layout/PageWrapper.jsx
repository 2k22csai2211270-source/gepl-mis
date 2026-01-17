export default function PageWrapper({ title, children }) {
  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>{title}</h1>
      {children}
    </div>
  );
}
