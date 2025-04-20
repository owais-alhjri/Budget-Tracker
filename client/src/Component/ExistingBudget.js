import { Button, Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import "../ExistingBudget.css";

const ExistingBudget = () => {
  const userId = useSelector((state) => state.users.user._id);
  const [categoryList, setCategoryList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseCategory, responseExpense] = await Promise.all([
          axios.get(`http://localhost:3001/categoryList?user=${userId}`),
          axios.get(`http://localhost:3001/expenseList?user=${userId}`)
        ]);

        setCategoryList(responseCategory.data);
        setExpenseList(responseExpense.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) fetchData();
  }, [userId]);
  return (
    <Container className="existing-budgets-container">
      <Row>
        <h1 className="existing-budgets-title">Existing Budgets</h1>
  
        {categoryList.map((category, index) => {
  // Filter expenses for the current category
  const filteredExpenses = expenseList.filter(
    (expense) => expense.category === category._id
  );

  // Calculate the total spent amount for the current category
  const totalSpent = filteredExpenses.reduce(
    (sum, expense) => sum + expense.ExpenseAmount,
    0
  );

  return (
    <div
      key={index}
      className={`budget-card ${
        category.Amount > 1000 ? "high-budget" : "low-budget"
      }`}
    >
      <div className="budget-header">
        <span className="budget-name">{category.budgetName}</span>
        <span className="budget-amount">${category.Amount} Budgeted</span>
      </div>

      <div className="custom-progress-bar">
        <div
          className="custom-progress-fill"
          style={{
            width: `${(totalSpent / category.Amount) * 100}%`, // Dynamic width based on spent amount
          }}
        ></div>
      </div>

      <div className="budget-labels">
        {/* Display the total spent amount */}
        <span className="spent-amount">${totalSpent} Spent</span>
        <span className="remaining-amount">
          ${(category.Amount - totalSpent)} Remaining
        </span>
      </div>

      {/* Render the filtered expenses 
      <div className="expense-list">
        <h5>Expenses:</h5>
        {filteredExpenses.length > 0 ? (
          <ul>
            {filteredExpenses.map((expense) => (
              <li key={expense._id}>
                {expense.expenseName}: ${expense.ExpenseAmount}
              </li>
            ))}
          </ul>
        ) : (
          <p>No expenses for this category.</p>
        )}
      </div>
      */}

      <Button className="btn-view-details">View Details 💵</Button>
    </div>
  );
})}
      </Row>
    </Container>
  );
};

export default ExistingBudget;