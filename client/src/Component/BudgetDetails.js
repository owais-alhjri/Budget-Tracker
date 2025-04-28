import { useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Chart } from "chart.js/auto";

const BudgetDetails = () => {
  const location = useLocation();
  const { category, expenses = [] } = location.state || {};
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const totalSpent = expenses.reduce(
    (sum, expense) => sum + expense.ExpenseAmount,
    0
  );

  let Remaining = category.Amount - totalSpent;
  const isOverBudget = Remaining < 0;
  if (isOverBudget) {
    Remaining = Math.abs(Remaining);
  }
  const predefinedColors = useMemo(() => [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
    "#FF6B6B", "#6BCB77", "#FFD93D", "#6A0572", "#1FAB89", "#DAA520"
  ], []);
  
  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    // Cleanup previous chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: expenses.map((e) => e.ExpenseName),
        datasets: [
          {
            label: "Expense Amount",
            data: expenses.map((e) => e.ExpenseAmount),
            backgroundColor: expenses.map((_, i) => predefinedColors[i % predefinedColors.length] + "80"), // 80 = ~50% opacity
            borderColor: expenses.map((_, i) => predefinedColors[i % predefinedColors.length]),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [expenses, predefinedColors]);

  return (
    <div className="Details-budgets-container">
      <h1>Budget Details</h1>
      {category ? (
        <div>
          <div className="budget-header">
            <span className="budget-name">{category.budgetName}</span>
            <span className="budget-amount">${category.Amount} Budgeted</span>
          </div>
          <div className="custom-progress-bar">
            <div
              className="custom-progress-fill"
              style={{
                width: `${Math.min(
                  (totalSpent / category.Amount) * 100,
                  100
                )}%`,
                backgroundColor: isOverBudget ? "#ff0000" : "#9cb380",
              }}
            ></div>
          </div>
          <div className="budget-labels">
            <span className="spent-amount">${totalSpent} Spent</span>
            {isOverBudget ? (
              <span className="remaining-amount over-budget-text">
                Over Budget by ${Remaining}
              </span>
            ) : (
              <span className="remaining-amount">${Remaining} Remaining</span>
            )}
          </div>
          <h3>Expenses:</h3>
          {expenses.length > 0 ? (
            <>
              <ul>
                {expenses.map((expense) => (
                  <li key={expense._id}>
                    {expense.ExpenseName}: ${expense.ExpenseAmount}
                  </li>
                ))}
              </ul>
              <div style={{ width: "100%", height: "400px", marginTop: "20px" }}>
                <canvas ref={chartRef}></canvas>
              </div>
            </>
          ) : (
            <p>No expenses available for this budget.</p>
          )}
        </div>
      ) : (
        <p>No budget details available.</p>
      )}
    </div>
  );
};

export default BudgetDetails;
