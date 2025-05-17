import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../Features/UserSlice";

const useInactivityLogout = (timeout = 15 * 60 * 1000) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user?._id || null);

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      if (!user) return; 
      clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch(logout());
        localStorage.removeItem("user");
        navigate("/login");
      }, timeout);
    };

    if (user) {
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);

      resetTimer(); 
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [dispatch, navigate, timeout, user]); 
};

export default useInactivityLogout;