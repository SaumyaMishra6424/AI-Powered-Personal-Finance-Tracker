export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}
