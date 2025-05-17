import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Input, Row } from "reactstrap";
import { createExpense } from "../Features/ExpenseSlice.js";

const Expense = () => {
  const userId = useSelector((state) => state.users.user?._id || null);
    const dispatch = useDispatch();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const handleSubmit = (e) => {
    //e.preventDefault();
    const expense = {
      expenseName: expenseName,
      expenseAmount: expenseAmount,
      Category: selectedCategory,
      user:userId,
    };
    console.log(expense);
    dispatch(createExpense(expense));
  };
  useEffect(() => {
    const fetchCategory = async () => {
        try {
            const response = await axios.get(`${API_URL}/categoryList?user=${userId}`);
            setCategoryList(response.data);
        } catch (error) {
            console.error("Error fetching category list:", error);
        }
    };

    if (userId) 
        fetchCategory();
    }, [userId]); 

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); 
  };

  return (
    <div>
      <Container className="createBudget-container">
        <form onSubmit={handleSubmit}>
          <h3>Add New Expense</h3>
          <Row>
            <Col>
              <p>Expense Name</p>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Expense Name"
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
                onChange={handleCategoryChange}
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
              <button className="button_blue">Add</button>
            </Col>
          </Row>
        </form>
      </Container>
    </div>
  );
};

export default Expense;
