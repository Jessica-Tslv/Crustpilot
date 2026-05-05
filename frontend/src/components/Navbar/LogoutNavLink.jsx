import { useNavigate, NavLink } from "react-router-dom";
import { FaArrowRightFromBracket } from "react-icons/fa6";
export function LogoutNavLink() {
	const navigate = useNavigate();

	function logOut() {
		localStorage.removeItem("token");
		navigate("/");
	}

	return (
		<NavLink onClick={logOut} aria-label="Log out" className="nav-item">
			<FaArrowRightFromBracket
				className="nav-icon"
				size={20}
				aria-hidden="true"
			/>
			<span>
				<p>Log out</p>
			</span>
		</NavLink>
	);
}
