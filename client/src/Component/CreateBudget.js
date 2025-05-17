import { Col, Container, Input, Row } from "reactstrap";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBudget } from "../Features/BudgetSlice";

const CreateBudget = () => {
  const userId = useSelector((state) => state.users.user?._id || null);
  const dispatch = useDispatch();
  const [budgetName, setBudgetName] = useState("");
  const [Amount, setAmount] = useState(0);
  const [color, setColor] = useState("#000");

  const handleSubmit = (e) => {
    //e.preventDefault();
    const budget = {
      budgetName: budgetName,
      Amount: Amount,
      user: userId,
      color: color,
    };
    console.log(budget);
    dispatch(createBudget(budget));

    setBudgetName("");
    setAmount("");
    setColor("#000");
  };

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
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
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
                value={Amount || ""}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Col>
            <Col>
              <p>Select color</p>
              <Input
                type="color"
                id="color"
                name="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              ></Input>
            </Col>
          </Row>

          <Row>
            <Col className="btn-create" >
              <button className="button_blue">Create</button>
            </Col>
          </Row>
        </form>
      </Container>
    </div>
  );
};
export default CreateBudget;
