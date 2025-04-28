import { Button, Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExistingBudget = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.users.user._id);
  const [categoryList, setCategoryList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseCategory, responseExpense] = await Promise.all([
          axios.get(`http://localhost:3001/categoryList?user=${userId}`),
          axios.get(`http://localhost:3001/expenseList?user=${userId}`),
        ]);

        setCategoryList(responseCategory.data);
        setExpenseList(responseExpense.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) fetchData();
  }, [userId]);
  const sendInfo = (category, expenses) => {
    navigate("/BudgetDetails", { state: { category, expenses } });
  };

  return (
    <div className="existing-budgets-container">
      <Row>
        <h1 className="existing-budgets-title">Existing Budgets</h1>

        {categoryList.map((category, index) => {
          // Filter expenses for the current category
          const filteredExpenses = expenseList.filter(
            (expense) =>
              expense.category === category._id ||
              expense.category?._id === category._id
          );

          // Calculate the total spent amount for the current category
          const totalSpent = filteredExpenses.reduce(
            (sum, expense) => sum + expense.ExpenseAmount,
            0
          );
          let Remaining = category.Amount - totalSpent;
          const isOverBudget = Remaining < 0; // Check if the budget is exceeded
          if (isOverBudget) {
            Remaining = Math.abs(Remaining); // Convert to positive for display
          }

          return (
            <div
              key={index}
              className={`budget-card ${
                category.Amount > 1000 ? "high-budget" : "low-budget"
              } ${isOverBudget ? "over-budget" : ""}`} // Add a class for over-budget
            >
              <div className="budget-header">
                <span className="budget-name">{category.budgetName}</span>
                <span className="budget-amount">
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
                    )}%`, // Cap at 100% for over-budget
                    backgroundColor: isOverBudget ? "#ff000" : "#9cb380", // Red for over-budget, green otherwise
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
                  <span className="remaining-amount">
                    ${Remaining} Remaining
                  </span>
                )}
              </div>
              <Button
                onClick={() => sendInfo(category, filteredExpenses)}
                className="btn-view-details"
              >
                View Details 💵
              </Button>
            </div>
          );
        })}
      </Row>
    </div>
  );
};
export default ExistingBudget;
