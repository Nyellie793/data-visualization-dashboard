import type { CsvRow } from "../../types/csv";

type Props = {
  data: CsvRow[];
};
  
  const DataPreview = ({ data }: Props) => {
    const headers = Object.keys(data[0]);
  
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
  
        <h2 className="text-2xl font-semibold mb-4">
          Data Preview
        </h2>
  
        <div className="overflow-x-auto">
  
          <table className="w-full border">
  
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="border bg-slate-100 p-3"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
  
            <tbody>
              {data.slice(0 , 20).map((row, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="border p-3"
                    >
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
  
          </table>
  
        </div>
  
      </div>
    );
  };
  
  export default DataPreview;