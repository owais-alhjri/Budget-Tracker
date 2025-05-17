import { useEffect, useRef, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Chart } from "chart.js/auto";
import { Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { deleteExpense, setExpenseId } from "../Features/ExpenseSlice";
import { deleteBudget, setBudgetDetails } from "../Features/BudgetSlice";
import deleteImg from "../images/delete.png";
import editImg from "../images/edit.png";
import moment from "moment";

const BudgetDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useSelector((state) => state.users.user?._id || null);
  const category = useSelector((state)=>state.budgets.category);
  const expenses = useSelector((state)=>state.budgets.expenses);

  const [localExpenses, setLocalExpenses] = useState(expenses); // Local state
  const [currentCategory, setCategory] = useState(category); // Reactive category state

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  //console.log("Redux state in BudgetDetails:", { category, expenses });
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';



  const predefinedColors = useMemo(
    () => [
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#FF6B6B",
      "#6BCB77",
      "#FFD93D",
      "#6A0572",
      "#1FAB89",
      "#DAA520",
      "#FF6384",
    ],
    []
  );
const [categoryList, setCategoryList] = useState([]);

// Add this useEffect to fetch category list
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/categoryList?user=${userId}`
      );
      setCategoryList(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  if (userId) {
    fetchCategories();
  }
}, [userId]);
useEffect(() => {
  // If we receive a categoryId in the state, set it as the current category
  if (location.state?.categoryId && categoryList) {
    const categoryFromId = categoryList.find(cat => cat._id === location.state.categoryId);
    if (categoryFromId) {
      setCategory(categoryFromId);
      dispatch(setBudgetDetails({ category: categoryFromId, expenses: [] }));
    }
  }

  // Only proceed if we have a valid category
  if (!currentCategory || !currentCategory._id) {
    console.error("Category is missing or invalid.");
    return;
  }

  const fetchUpdatedExpenses = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/expenseList?user=${userId}`
      );
      
      // Filter expenses for the current category
      const updatedExpenses = response.data.filter(
        (expense) => expense.category?._id === currentCategory._id
      );
      
      setLocalExpenses(updatedExpenses); // Update the local state
      
      // Also fetch the full category details to ensure we have all data
      const categoryResponse = await axios.get(
        `${API_URL}/categoryList?user=${userId}`
      );
      
      const fullCategory = categoryResponse.data.find(
        cat => cat._id === currentCategory._id
      );
      
      if (fullCategory) {
        setCategory(fullCategory);
        dispatch(
          setBudgetDetails({
            category: fullCategory,
            expenses: updatedExpenses,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching updated data:", error);
    }
  };

  if (location.state?.refetch) {
    fetchUpdatedExpenses();
    navigate(location.pathname, { replace: true }); // Reset the state
  }
}, [location.state, currentCategory, userId, navigate, dispatch]);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    // Cleanup previous chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: localExpenses.map((e) => e.ExpenseName),
        datasets: [
          {
            label: "Expense Amount",
            data: localExpenses.map((e) => e.ExpenseAmount),
            
            backgroundColor: localExpenses.map(
              (_, i) => predefinedColors[i % predefinedColors.length] + "80"
            ), // 80 = ~50% opacity
            borderColor: localExpenses.map(
              (_, i) => predefinedColors[i % predefinedColors.length]
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#000000", 
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#000000",
            },
          },
          y: {
            ticks: {
              color: "#000000",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [localExpenses, predefinedColors]); // Update dependency to localExpenses


  useEffect(() => {
    if (!category) {
      console.error("Category is missing. Redirecting to ExistingBudget...");
      navigate("/ExistingBudget");
    }
  }, [category, navigate]);

  if (!category) {
    return <p>Loading...</p>;
  }
  if (!currentCategory || !userId) {
    return <p>Error: Missing category or user information. Please try again.</p>;
  }

  const totalSpent = localExpenses.reduce(
    (sum, expense) => sum + expense.ExpenseAmount,
    0
  );

  let Remaining = currentCategory.Amount - totalSpent;
  const isOverBudget = Remaining < 0;
  if (isOverBudget) {
    Remaining = Math.abs(Remaining);
  }


  const handleDelete = async (expenseId) => {
    try {
      await dispatch(deleteExpense(expenseId)).unwrap(); // Delete from the database
      setLocalExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== expenseId)
      ); // Update local state
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const handleEdit = (expenseId) => {
    dispatch(setExpenseId(expenseId)); // Save the expenseId in Redux
    navigate("/EditExpense"); // Navigate to EditExpense
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await dispatch(deleteBudget(budgetId)).unwrap(); // Dispatch the deleteBudget action
      alert("Budget and associated expenses deleted successfully");
      navigate("/"); // Navigate back to the main page
    } catch (error) {
      console.error("Error deleting budget and associated expenses:", error);
      alert("Failed to delete budget and associated expenses. Please try again.");
    }
  };
  return (
    <div className="Details-budgets-container">
      
      <h1>Budget Details</h1>

      <div>
        <div
          className={`budget-card ${
            currentCategory.Amount > 1000 ? "high-budget" : "low-budget"
          } ${isOverBudget ? "over-budget" : ""}`}
          style={{ borderColor: currentCategory.color }}
        >
          <div className="budget-header">
            <span className="budget-name" style={{ color: currentCategory.color }}>
              {currentCategory.budgetName}
            </span>
            <span className="budget-amount" style={{ color: currentCategory.color }}>
              ${currentCategory.Amount} Budgeted
            </span>
          </div>
          <div className="custom-progress-bar">
            <div
              className="custom-progress-fill"
              style={{
                width: `${Math.min(
                  (totalSpent / currentCategory.Amount) * 100,
                  100
                )}%`,
                backgroundColor: isOverBudget ? "#ff0000" : "#9cb380",
              }}
            ></div>
          </div>
          <div className="budget-labels">
            <span className="spent-amount" style={{ color: currentCategory.color }}>
              ${totalSpent} Spent
            </span>
            {isOverBudget ? (
              <span
                className="remaining-amount over-budget-text"
                style={{ color: currentCategory.color }}
              >
                Over Budget by ${Remaining}
              </span>
            ) : (
              <span
                className="remaining-amount"
                style={{ color: currentCategory.color }}
              >
                ${Remaining} Remaining
              </span>
            )}
          </div>
        </div>

        <h3>Expenses</h3>
        {localExpenses.length > 0 ? (
          <div>
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {localExpenses.map((expense) => {

                  return (
                    <tr key={expense._id}>
                      <td>{expense.ExpenseName}</td>
                      <td>${expense.ExpenseAmount}</td>
                      <td>{moment(expense.createdAt).fromNow()}</td>
                      <td>
                        <Button
                          className="DeEdButton"
                          size="sm"
                          color="white"
                          onClick={() => handleDelete(expense._id)}
                        >
                          <img width={30} src={deleteImg} alt="Delete"></img>
                        </Button>
                        <Button
                          size="sm"
                          color="white"
                          className="DeEdButton"
                          onClick={() => handleEdit(expense._id)}
                        >
                          <img width={30} src={editImg} alt="Edit" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div
              style={{ width: "100%", height: "400px", marginTop: "20px" }}
            >
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        ) : (
          <p>No expenses available for this budget.</p>
        )}
      </div>
      <div className="btn-create">
        <button
          className="button_red"
          onClick={() => handleDeleteBudget(currentCategory._id)}
        >
          Delete Budget
        </button>
      </div>
    </div>
  );
};

export default BudgetDetails;