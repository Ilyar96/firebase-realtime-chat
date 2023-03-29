import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "./context/AuthContext";
import { HOME_ROUTE, REGISTER_ROUTE, LOGIN_ROUTE } from "./utils/const";

const App = () => {
	const { currentUser } = useContext(AuthContext);

	const ProtectedRoute = ({ children }) => {
		if (!currentUser) {
			return <Navigate to={LOGIN_ROUTE} replace />;
		}

		return children;
	};

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						path={HOME_ROUTE}
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route path={REGISTER_ROUTE} element={<Register />} />
					<Route path={LOGIN_ROUTE} element={<Login />} />
				</Routes>
			</BrowserRouter>
			<ToastContainer />
		</>
	);
};

export default App;
