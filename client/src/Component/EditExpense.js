import { useNavigate } from "react-router-dom";
import { Col, Container, Input, Row, Button } from "reactstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateExpense } from "../Features/ExpenseSlice";
import axios from "axios";

const EditExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const userId = useSelector((state) => state.users.user?._id || null);

  const expenses = useSelector((state) => state.budgets.expenses); // Get expenses from Redux
  const selectedExpenseId = useSelector((state) => state.expenses.selectedExpenseId); // Get selected expense ID from Redux
  console.log("Selected Expense ID:", selectedExpenseId);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
    const [categoryList, setCategoryList] = useState([]);

  //console.log("Redux state in EditExpense:", { selectedExpenseId, expenses });

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
  // Find the expense to edit from Redux
  const expenseToEdit = expenses.find((exp) => exp._id === selectedExpenseId);
  if (expenseToEdit) {
    setExpenseName(expenseToEdit.ExpenseName);
    setExpenseAmount(expenseToEdit.ExpenseAmount);
    setSelectedCategory(expenseToEdit.category?._id || "");
  }
}, [selectedExpenseId, expenses]); // Add `expenses` as a dependency to refetch data

const handleUpdate = async (event) => {
  event.preventDefault();

  const expenseData = {
    id: selectedExpenseId,
    ExpenseName: expenseName,
    ExpenseAmount: expenseAmount,
    category: selectedCategory,
  };

  try {
    await dispatch(UpdateExpense(expenseData)).unwrap(); // Update in the database
    navigate("/BudgetDetails", { state: { refetch: true } }); // Pass a refetch flag to BudgetDetails
  } catch (error) {
    console.error("Error updating expense:", error);
  }
};
useEffect(() => {
  if (!selectedExpenseId) {
    console.error("Selected Expense ID is missing. Redirecting to BudgetDetails...");
    navigate("/BudgetDetails");
  }
}, [selectedExpenseId, navigate]);
  return (
    <div>
      <Container className="createBudget-container">
        <form onSubmit={handleUpdate}>
          <h3>Edit Expense</h3>
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