import { Button, Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import "../ExistingBudget.css"; // Import the CSS file for styling

const ExistingBudget = () => {
  const userId = useSelector((state) => state.users.user._id);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/categoryList?user=${userId}`
        );
        setCategoryList(response.data);
      } catch (error) {
        console.error("Error fetching category list:", error);
      }
    };

    if (userId) fetchCategory();
  }, [userId]);

  return (
    <Container className="existing-budgets-container">
      <Row>
        <h1 className="existing-budgets-title">Existing Budgets</h1>

        {categoryList.map((category, index) => (
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
                  width: `${(100 / category.Amount) * 100}%`, // Dynamic width
                }}
              ></div>
            </div>

            <div className="budget-labels">
              <span className="spent-amount">$9.50 Spent</span>
              <span className="remaining-amount">$1,190.00 Remaining</span>
            </div>

            <Button className="btn-view-details">View Details 💵</Button>
          </div>
        ))}
      </Row>
    </Container>
  );
};

export default ExistingBudget;
