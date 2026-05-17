"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const modes = {
  Conservative: {
    needs: 60,
    emergency: 10,
    investment: 30,
    equity: 40,
    debt: 50,
    commodities: 8,
    crypto: 2
  },
  Balanced: {
    needs: 55,
    emergency: 10,
    investment: 35,
    equity: 60,
    debt: 30,
    commodities: 8,
    crypto: 2
  },
  Aggressive: {
    needs: 50,
    emergency: 10,
    investment: 40,
    equity: 70,
    debt: 20,
    commodities: 8,
    crypto: 2
  }
};

export default function Home() {
  const [income, setIncome] = useState(100000);
  const [mode, setMode] = useState("Balanced");
  const [currentLoan, setCurrentLoan] = useState(1500000);
  const [currentEMI, setCurrentEMI] = useState(25000);

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);

  const plan = useMemo(() => {
    const config = modes[mode as keyof typeof modes];

    const needs = income * (config.needs / 100);
    const emergency = income * (config.emergency / 100);
    const investment = income * (config.investment / 100);

    const equity = investment * (config.equity / 100);
    const debt = investment * (config.debt / 100);
    const commodities = investment * (config.commodities / 100);
    const crypto = investment * (config.crypto / 100);

    const emiRatio = (currentEMI / income) * 100;
    const safeEmiLimit = income * 0.4;
    const remainingEmiCapacity = safeEmiLimit - currentEMI;

    let emiHealth = "Healthy EMI Load";
    let emiColor = "text-green-600";

    if (emiRatio > 45) {
      emiHealth = "High EMI Burden";
      emiColor = "text-red-600";
    } else if (emiRatio > 30) {
      emiHealth = "Moderate EMI Pressure";
      emiColor = "text-amber-600";
    }

    return {
      needs,
      emergency,
      investment,
      equity,
      debt,
      commodities,
      crypto,
      emiRatio,
      safeEmiLimit,
      remainingEmiCapacity,
      emiHealth,
      emiColor
    };
  }, [income, mode, currentEMI]);

  const chartData = [
    { name: "Needs", value: plan.needs },
    { name: "Emergency", value: plan.emergency },
    { name: "Investment", value: plan.investment }
  ];

  const colors = ["#10b981", "#3b82f6", "#f59e0b"];

  return (
    <main className="min-h-screen bg-[#f7f3eb] text-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-6xl font-black">Finora</h1>
          <p className="mt-4 text-xl">
            Smart Monthly Planning For Modern Indian Families
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[32px] p-8 shadow-xl">
            <h2 className="text-3xl font-bold mb-8">
              Monthly Income & Loan Details
            </h2>

            <div className="space-y-5">
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                placeholder="Monthly Income"
                className="w-full p-5 rounded-2xl border text-2xl font-bold"
              />

              <input
                type="number"
                value={currentLoan}
                onChange={(e) => setCurrentLoan(Number(e.target.value))}
                placeholder="Current Loan Amount"
                className="w-full p-5 rounded-2xl border text-2xl font-bold"
              />

              <input
                type="number"
                value={currentEMI}
                onChange={(e) => setCurrentEMI(Number(e.target.value))}
                placeholder="Current Monthly EMI"
                className="w-full p-5 rounded-2xl border text-2xl font-bold"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {Object.keys(modes).map((item) => (
                <button
                  key={item}
                  onClick={() => setMode(item)}
                  className={`rounded-2xl p-4 font-bold ${
                    mode === item
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-xl">
            <h2 className="text-3xl font-bold mb-6">
              Your Monthly Money Plan
            </h2>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    outerRadius={110}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={colors[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <Card title="Essentials / Needs" value={formatINR(plan.needs)} />
          <Card title="Emergency / Safety" value={formatINR(plan.emergency)} />
          <Card title="Investments" value={formatINR(plan.investment)} />
        </div>

        <div className="mt-20">
          <h2 className="text-5xl font-black text-center mb-12">
            Current Loans & EMI Health
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card title="Current EMI" value={formatINR(currentEMI)} />
            <Card title="Safe EMI Limit" value={formatINR(plan.safeEmiLimit)} />
            <Card
              title="Remaining EMI Capacity"
              value={formatINR(plan.remainingEmiCapacity)}
            />
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-xl mt-10">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-3xl font-bold">EMI Health</h3>
              <span className={`font-bold text-xl ${plan.emiColor}`}>
                {plan.emiHealth}
              </span>
            </div>

            <div className="w-full bg-slate-200 h-5 rounded-full overflow-hidden">
              <div
                className={`h-5 ${
                  plan.emiRatio > 45
                    ? "bg-red-500"
                    : plan.emiRatio > 30
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(plan.emiRatio, 100)}%` }}
              />
            </div>

            <p className="mt-5 text-lg">
              EMI Ratio: {plan.emiRatio.toFixed(1)}%
            </p>

            <p className="mt-3 text-slate-600">
              Current Total Loan Outstanding: {formatINR(currentLoan)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({
  title,
  value
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-xl">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-5xl font-black mt-6">{value}</p>
    </div>
  );
}
