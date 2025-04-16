import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Input, Row, Button } from "reactstrap";

const Expense = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("http://localhost:3001/categoryList");
        setCategoryList(response.data);
      } catch (error) {
        console.error("Error fetching category list:", error);
      }
    };
    fetchCategory();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Update selected category
  };

  return (
    <div>
      <Container className="createBudget-container">
        <h3>Add New Expense</h3>
        <Row>
          <Col>
            <p>Expense Name</p>
            <Input id="name" name="name" type="text" placeholder="Expense Name" />
          </Col>
          <Col>
            <p>Amount</p>
            <Input id="Amount" name="Amount" type="number" placeholder="Amount" />
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Category</p>
            <select
              id="Category"
              name="Category"
              className="form-control"
              value={selectedCategory} // Bind to state
              onChange={handleCategoryChange} // Handle selection
            >
              <option value="" disabled>
                Select a Category
              </option>
              {categoryList.map((category, index) => (
                <option key={index} value={category.budgetName}>
                  {category.budgetName}
                </option>
              ))}
            </select>
          </Col>
        </Row>
        <Row>
          <Col className="btn-create">
            <Button>Add</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Expense;
