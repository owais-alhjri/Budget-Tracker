import { Button, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setBudgetDetails } from "../Features/BudgetSlice";

const ExistingBudget = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.users.user?._id || null);
  const [categoryList, setCategoryList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseCategory, responseExpense] = await Promise.all([
          axios.get(`${API_URL}/categoryList?user=${userId}`),
          axios.get(`${API_URL}/expenseList?user=${userId}`),
        ]);

        setCategoryList(responseCategory.data);
        setExpenseList(responseExpense.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) fetchData();
  }, [userId]);

const handelViewDetails = (category, expenses) => {
  if (!category || !expenses) {
    console.error("Category or expenses are missing:", { category, expenses });
    return;
  }
  dispatch(setBudgetDetails({ category, expenses })); 
  navigate("/BudgetDetails");
};

  return (
    <div className="existing-budgets-container">
      <Row>
        <h1 className="existing-budgets-title">Existing Budgets</h1>

        {categoryList.length > 0 ? (
          categoryList.map((category, index) => {
            const filteredExpenses = expenseList.filter(
              (expense) =>
                expense.category === category._id ||
                expense.category?._id === category._id
            );

            const totalSpent = filteredExpenses.reduce(
              (sum, expense) => sum + expense.ExpenseAmount,
              0
            );
            let Remaining = category.Amount - totalSpent;
            const isOverBudget = Remaining < 0;
            if (isOverBudget) {
              Remaining = Math.abs(Remaining);
            }

            return (
              <div
                key={index}
                className={`budget-card ${
                  category.Amount > 1000 ? "high-budget" : "low-budget"
                } ${isOverBudget ? "over-budget" : ""}`}
                style={{ borderColor: category.color }}
              >
                <div className="budget-header">
                  <span
                    className="budget-name"
                    style={{ color: category.color }}
                  >
                    {category.budgetName}
                  </span>
                  <span
                    className="budget-amount"
                    style={{ color: category.color }}
                  >
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
                      color: category.color,
                    }}
                  ></div>
                </div>

                <div className="budget-labels">
                  <span
                    className="spent-amount"
                    style={{ color: category.color }}
                  >
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
                <Button
                  onClick={() => handelViewDetails(category, filteredExpenses)} 
                  className="btn-view-details"
                  style={{ backgroundColor: category.color }}
                >
                  View Details
                </Button>
              </div>
            );
          })
        ) : (
          <p>No budgets are available. Please create a new budget.</p>
        )}
      </Row>
    </div>
  );
};

export default ExistingBudget;