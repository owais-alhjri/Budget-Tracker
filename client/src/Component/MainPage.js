import { useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import CreateBudget from "./CreateBudget.js";
import ExistingBudget from "./ExistingBudget.js";
import Expense from "./Expense.js";
import RecentExpense from "./RecentExpense.js";
const MainPage = () => {
  const name = useSelector((state) => state.users.user.name);
  return (
    <div>
      <Container>
        <Row>
          <h1>
            Welcome Back, <span style={{ color: "blue" }}>{name}</span>
          </h1>
        </Row>

        <Row>
          <Col md={6}>
            <CreateBudget />
          </Col>

          <Col md={6}>
            <Expense />
          </Col>

        </Row>

        <Row >
          <Col >
          <ExistingBudget  />
          </Col>
          
        </Row>
        <Row>
          <RecentExpense />
        </Row>
      </Container>
    </div>
  );
};
export default MainPage;
