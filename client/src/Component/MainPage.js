import { useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import CreateBudget from "./CreateBudget.js";
import ExistingBudget from "./ExistingBudget.js";
import Expense from "./Expense.js";
import RecentExpense from "./RecentExpense.js";
const MainPage = () => {
  const name = useSelector((state) => state.users.user?.name || "Guest");
  return (
    <div>
      <Container>
        <Row>
          <h1>
            Welcome, <span className="name">{name}</span>
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

        <Row>
            <ExistingBudget />
        </Row>
        <Row>
          <RecentExpense />
        </Row>
      </Container>
    </div>
  );
};
export default MainPage;
