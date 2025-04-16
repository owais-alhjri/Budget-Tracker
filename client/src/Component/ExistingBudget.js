import { Button, Container } from "reactstrap";

const ExistingBudget = () => {
  return (
    <Container>

    <h1>Existing Budgets</h1>
    <div className="budget-box"> 
       

  <div className="header">
    <span>Groceries</span>
    <span>$1,200 Budgeted</span>
  </div>

  <div className="custom-progress-bar">
    <div className="custom-progress-fill" style={{ width: "50%" }}></div>
  </div>

  <div className="labels">
    <span>$9.50 Spent</span>
    <span>$1,190.00 Remaining</span>
  </div>

  <Button className="btn-view">View Details 💵</Button>
</div>
</Container>
  );
};
export default ExistingBudget;
