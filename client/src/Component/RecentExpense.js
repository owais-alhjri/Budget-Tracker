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
import { setExpenseId } from "../Features/ExpenseSlice";
const RecentExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.users.user?._id || null);
  const [expenseList, setExpenseList] = useState([]); 
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseExpense = await axios.get(
          `${API_URL}/expenseList?user=${userId}`
        );
        setExpenseList(responseExpense.data); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const handleDelete = async (expenseId) => {
    try {
      await dispatch(deleteExpense(expenseId)).unwrap(); 
      setExpenseList((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== expenseId)
      ); 
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

const handleEdit = (expense) => {
  const category = expense.category; 
  const expenses = [expense]; 

  if (!category) {
    console.error("Category is missing for the selected expense.");
    return;
  }

  console.log("Expense being edited:", expense);
  console.log("Category being passed:", expense.category);

  dispatch(setExpenseId(expense._id)); 
  dispatch(setBudgetDetails({ category, expenses })); 
  navigate("/EditExpense"); 
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
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
                .slice(0, 5) 
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
