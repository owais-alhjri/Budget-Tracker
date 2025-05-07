import { useLocation, useNavigate } from "react-router-dom";
import { Col, Container, Input, Row, Button } from "reactstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateExpense } from "../Features/ExpenseSlice";

const EditExpense = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.users.user?._id || null);

  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);
    const { expenseId, category } = location.state || {};
    console.log("Navigating to BudgetDetails with category:", category);
  console.log(expenseId);
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

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      if (!userId) {
        console.error("User ID is undefined");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3001/expenseList?user=${userId}`
        );
        const expense = response.data.find((exp) => exp._id === expenseId);
        if (expense) {
          setExpenseName(expense.ExpenseName);
          setExpenseAmount(expense.ExpenseAmount);
          setSelectedCategory(expense.category?._id || "");
        }
      } catch (error) {
        console.error("Error fetching expense details:", error);
      }
    };

    if (expenseId) fetchExpenseDetails();
  }, [expenseId, userId]);

  const handleUpdate = async (event) => {
    event.preventDefault();
  
    const expenseData = {
      id: expenseId,
      ExpenseName: expenseName,
      ExpenseAmount: expenseAmount,
      category: selectedCategory,
    };
  
    try {
      await dispatch(UpdateExpense(expenseData)).unwrap(); // Wait for the update to complete
      navigate("/BudgetDetails", { state: { category: { ...category, refetch: true } } });
        } catch (error) {
      console.error("Error updating expense:", error);
    }
  
    setExpenseName("");
    setExpenseAmount("");
    setSelectedCategory("");
  };

  return (
    <div>
      <Container className="createBudget-container">
        <form onSubmit={handleUpdate}>
          <h3>Add New Expense</h3>
          <Row>
            <Col>
              <p>Expense Name</p>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Expense Name"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </Col>
            <Col>
              <p>Amount</p>
              <Input
                id="Amount"
                name="Amount"
                type="number"
                placeholder="Amount"
                value={expenseAmount || ""}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <p>Category</p>
              <select
                id="Category"
                name="Category"
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" disabled>
                  Select a Category
                </option>
                {categoryList.map((category, index) => (
                  <option key={index} value={category._id}>
                    {category.budgetName}
                  </option>
                ))}
              </select>
            </Col>
          </Row>
          <Row>
            <Col className="btn-create">
              <Button>Edit</Button>
            </Col>
          </Row>
        </form>
      </Container>
    </div>
  );
};
export default EditExpense;
