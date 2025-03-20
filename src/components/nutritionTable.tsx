import React from "react";

type NutritionItem = {
  name: string;
  amount: number;
  unit: string;
  cal: number;
  carb: number;
  ptn: number;
  fat: number;
};

interface NutritionTableProps {
  nutritionData: NutritionItem[];
}

const NutritionTable: React.FC<NutritionTableProps> = ({ nutritionData }) => {
  const total = nutritionData.reduce(
    (acc, item) => ({
      cal: acc.cal + item.cal,
      carb: acc.carb + item.carb,
      ptn: acc.ptn + item.ptn,
      fat: acc.fat + item.fat,
    }),
    { cal: 0, carb: 0, ptn: 0, fat: 0 }
  );

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Tabela Nutricional</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Ingrediente</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Quantidade</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Calorias</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Carboidratos (g)</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Proteínas (g)</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Gorduras (g)</th>
          </tr>
        </thead>
        <tbody>
          {nutritionData.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {item.amount} {item.unit}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">{item.cal.toFixed(2)}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{item.carb.toFixed(2)}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{item.ptn.toFixed(2)}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{item.fat.toFixed(2)}</td>
            </tr>
          ))}
          <tr className="font-bold bg-gray-200">
            <td className="border border-gray-300 px-4 py-2">Total</td>
            <td className="border border-gray-300 px-4 py-2 text-right">-</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{total.cal.toFixed(2)}</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{total.carb.toFixed(2)}</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{total.ptn.toFixed(2)}</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{total.fat.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NutritionTable;