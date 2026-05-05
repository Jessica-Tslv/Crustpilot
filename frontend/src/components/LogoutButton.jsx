import { useNavigate } from "react-router-dom";

function LogoutButton() {
	const navigate = useNavigate();

	function logOut() {
		localStorage.removeItem("token");
		navigate("/");
	}

	return (
		<button onClick={logOut} role="button" aria-label="Log out">
			Log out
		</button>
	);
}

export default LogoutButton;
