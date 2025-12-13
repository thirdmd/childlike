export interface ComparisonRow {
  attribute: string;
  childlike: string;
  competitor: string;
}

export interface ComparisonData {
  competitorName: string;
  rows: ComparisonRow[];
}

interface ComparisonTableProps {
  data: ComparisonData;
}

export const ComparisonTable = ({ data }: ComparisonTableProps) => {
  return (
    <div className="w-full">
      {/* Header Row */}
      <div className="grid grid-cols-3 border-b border-brand-white/10">
        <div className="p-4"></div>
        <div className="p-4 text-center">
          <h3 className="text-brand-white font-bold text-lg">Childlike</h3>
        </div>
        <div className="p-4 text-center">
          <h3 className="text-brand-white font-bold text-lg">{data.competitorName}</h3>
        </div>
      </div>

      {/* Data Rows */}
      {data.rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-3 border-b border-brand-white/10 last:border-b-0"
        >
          {/* Attribute */}
          <div className="p-4 flex items-center">
            <span className="text-brand-white font-semibold">{row.attribute}</span>
          </div>

          {/* Childlike Value */}
          <div className="p-4 flex items-center justify-center text-center">
            <span className="text-brand-white/90">{row.childlike}</span>
          </div>

          {/* Competitor Value */}
          <div className="p-4 flex items-center justify-center text-center">
            <span className="text-brand-white/90">{row.competitor}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
