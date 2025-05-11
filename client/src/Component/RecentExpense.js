import { Button, Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { deleteExpense } from "../Features/ExpenseSlice";
import { useNavigate } from "react-router-dom";
import deleteImg from "../images/delete.png";
import editImg from "../images/edit.png";
import { setBudgetDetails } from "../Features/BudgetSlice";
import moment from "moment";
const RecentExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.users.user?._id || null);
  const [expenseList, setExpenseList] = useState([]); // Local state for expenses

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
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };
  const handleEdit = (expense) => {
    const category = expense.category; // Get the category from the expense
    const expenses = [expense]; // Pass the single expense as the list of expenses

    if (!category) {
      console.error("Category is missing for the selected expense.");
      return;
    }

    dispatch(setBudgetDetails({ category, expenses })); // Set the category and expenses in Redux
    navigate("/EditExpense"); // Navigate to EditExpense
  };

  return (
    <div>
      <h1>Recent Expense</h1>

      <div className="expense-list">
        {expenseList.length > 0 ? (
          <table className="recent-table">
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
              

                  return (
                    <tr key={expense._id}>
                      <td>{expense.ExpenseName}</td>
                      <td>${expense.ExpenseAmount}</td>
                      <td>{moment(expense.createdAt).fromNow()}</td>
                      <td>{expense.category?.budgetName || "No Category"}</td>
                      <td>
                        <Button
                          className="DeEdButton"
                          size="sm"
                          color="white"
                          onClick={() => handleDelete(expense._id)}
                        >
                          <img width={30} src={deleteImg} alt="Delete"></img>
                        </Button>{" "}
                        <Button
                          color="white"
                          size="sm"
                          className="DeEdButton"
                          onClick={() => handleEdit(expense)}
                        >
                          <img width={30} src={editImg} alt="Edit"></img>
                        </Button>{" "}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <p>No expenses are available.</p>
        )}
      </div>
    </div>
  );
};

export default RecentExpense;
