import { useEffect, useRef, useMemo,useState } from "react";
import { useLocation } from "react-router-dom";
import { Chart } from "chart.js/auto";
import { Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { deleteExpense } from "../Features/ExpenseSlice";

const BudgetDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { category, expenses = [] } = location.state || {};
  const [localExpenses, setLocalExpenses] = useState(expenses); // Local state
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const totalSpent = localExpenses.reduce(
    (sum, expense) => sum + expense.ExpenseAmount,
    0
  );

  let Remaining = category.Amount - totalSpent;
  const isOverBudget = Remaining < 0;
  if (isOverBudget) {
    Remaining = Math.abs(Remaining);
  }
  const predefinedColors = useMemo(
    () => [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#FF6B6B",
      "#6BCB77",
      "#FFD93D",
      "#6A0572",
      "#1FAB89",
      "#DAA520",
    ],
    []
  );

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
        labels: localExpenses.map((e) => e.ExpenseName),
        datasets: [
          {
            label: "Expense Amount",
            data: localExpenses.map((e) => e.ExpenseAmount),
            backgroundColor: localExpenses.map(
              (_, i) => predefinedColors[i % predefinedColors.length] + "80"
            ), // 80 = ~50% opacity
            borderColor: localExpenses.map(
              (_, i) => predefinedColors[i % predefinedColors.length]
            ),
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
  }, [localExpenses, predefinedColors]); // Update dependency to localExpenses

  const handleDelete = async (expenseId) => {
    try {
      await dispatch(deleteExpense(expenseId)).unwrap(); // Wait for the delete action to complete
      setLocalExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== expenseId)
      ); // Update local state
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

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
          {localExpenses.length > 0 ? (
            <>
              <ul>
                {localExpenses.map((expense) => (
                  <li key={expense._id}>
                    {expense.ExpenseName}: ${expense.ExpenseAmount}
                    <Button
                      color="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDelete(expense._id)}
                    >
                      delete
                    </Button>
                  </li>
                ))}
              </ul>
              <div
                style={{ width: "100%", height: "400px", marginTop: "20px" }}
              >
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