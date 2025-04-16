import { Button, Col, Container, Input, Row } from "reactstrap";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addBudget, createBudget } from "../Features/BudgetSlice";

const CreateBudget = () => {
  const dispatch = useDispatch();
  const [budgetName, setBudgetName] = useState("");
  const [Amount, setAmount] = useState(0);

  const handleSubmit=(e)=>{
    e.preventDefault();
    const budget = {
      budgetName:budgetName,
      Amount:Amount,
    };
    console.log(budget);
    dispatch(createBudget(budget));

  }

  return (
    <div>
      <Container className="createBudget-container">
        <form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <h3>Create Budget</h3>
            <p>Budget Name</p>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Budget Name"
              onChange={(e)=> setBudgetName(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Amount</p>
            <Input
              id="Amount"
              name="Amount"
              type="number"
              placeholder="Amount"
              onChange={(e)=>setAmount(e.target.value)}
            />
          </Col>
        </Row>
        
        <Row>
          <Col className="btn-create">
            <Button>Create</Button>
          </Col>
        </Row>
        </form>
      </Container>
    </div>
  );
};
export default CreateBudget;
