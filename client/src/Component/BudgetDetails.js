import { useEffect, useRef, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Chart } from "chart.js/auto";
import { Button, Table } from "reactstrap";
import { useDispatch } from "react-redux";
import { deleteExpense } from "../Features/ExpenseSlice";
import { deleteBudget } from "../Features/BudgetSlice";

const BudgetDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      "#FF6384",
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

  const handleDelete = (expenseId) => {
    dispatch(deleteExpense(expenseId));
    navigate("/");
  };

  const handleDeleteBudget = (budgetId) => {
    dispatch(deleteBudget(budgetId));
    navigate("/");
  };

  return (
    <div className="Details-budgets-container">
      <h1>Budget Details</h1>
      {category ? (
        <div>
          <div
            className={`budget-card ${
              category.Amount > 1000 ? "high-budget" : "low-budget"
            } ${isOverBudget ? "over-budget" : ""}`}
            style={{ borderColor: category.color }}
          >
            <div className="budget-header">
              <span className="budget-name" style={{ color: category.color }}>
                {category.budgetName}
              </span>
              <span className="budget-amount" style={{ color: category.color }}>
                ${category.Amount} Budgeted
              </span>
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
              <span className="spent-amount" style={{ color: category.color }}>
                ${totalSpent} Spent
              </span>
              {isOverBudget ? (
                <span
                  className="remaining-amount over-budget-text"
                  style={{ color: category.color }}
                >
                  Over Budget by ${Remaining}
                </span>
              ) : (
                <span
                  className="remaining-amount"
                  style={{ color: category.color }}
                >
                  ${Remaining} Remaining
                </span>
              )}
            </div>
          </div>
          <h3>Expenses</h3>
          {localExpenses.length > 0 ? (
            <>
          <Table hover responsive striped className="text-center">
          <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>

          {localExpenses.map((expense) => {
            let formattedDate = "Invalid Date";
            if (expense.createdAt) {
              const date = new Date(expense.createdAt);
              if (!isNaN(date)) {
                formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
              }
            }
            return (
              <tr key={expense._id}>
                <td>{expense.ExpenseName}</td>
                <td>${expense.ExpenseAmount}</td>
                <td>{formattedDate}</td>
                <td>
                  <Button
                    color="danger"
                    size="sm"
                    className="me-2"
                    onClick={() => handleDelete(expense._id)}
                  >
                    delete
                  </Button>
                </td>
              </tr>
            );
          })}
                            </tbody>
              </Table>
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
      <Button color="danger" onClick={() => handleDeleteBudget(category._id)}>
        Delete Budget
      </Button>
    </div>
  );
};

export default BudgetDetails;
