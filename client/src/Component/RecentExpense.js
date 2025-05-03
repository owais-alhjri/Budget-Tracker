import { Button, Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { deleteExpense } from "../Features/ExpenseSlice";

const RecentExpense = () => {
  const userId = useSelector((state) => state.users.user._id);
  const [expenseList, setExpenseList] = useState([]); // Local state for expenses
  const dispatch = useDispatch();

  // Fetch data when the component mounts or userId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseExpense = await axios.get(
          `http://localhost:3001/expenseList?user=${userId}`
        );
        setExpenseList(responseExpense.data); // Update local state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  // Handle delete operation
  const handleDelete = async (expenseId) => {
    try {
      await dispatch(deleteExpense(expenseId)).unwrap(); // Wait for the delete action to complete
      setExpenseList((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== expenseId)
      ); // Update local state to remove the deleted expense
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  return (
    <div>
      <h1>Recent Expense</h1>

      <div className="expense-list">
        {expenseList.length > 0 ? (
          <Table hover responsive striped className="text-center">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Budget Name</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {expenseList
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
                .slice(0, 5) // Get the last 5 added expenses
                .map((expense) => {
                  // Safely format the createdAt date
                  let formattedDate = "Invalid Date";
                  if (expense.createdAt) {
                    const date = new Date(expense.createdAt);
                    if (!isNaN(date)) {
                      formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
                    }
                  }

                  return (
                    <tr key={expense._id}>
                      <td>{expense.ExpenseName}</td>
                      <td>${expense.ExpenseAmount}</td>
                      <td>{formattedDate}</td>
                      <td>{expense.category?.budgetName || "No Category"}</td>
                      <td>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(expense._id)}
                        >
                          Delete
                        </Button>{" "}
                        <Button size="sm">Edit</Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        ) : (
          <p>No expenses for this category.</p>
        )}
      </div>
    </div>
  );
};

export default RecentExpense;
