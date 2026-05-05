import "./Navbar.css";
import { FaHome, FaHeart, FaSearch } from "react-icons/fa";
import {
	FaCirclePlus,
	FaRegCircleUser,
	FaUserPlus,
	FaArrowRightToBracket,
} from "react-icons/fa6";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LogoutNavLink } from "./LogoutNavLink";
import { useState, useEffect } from "react";
import { search } from "../../services/search";
import logo from "../../assets/logo-no-background.png";
import { PlacePopup } from "../PlacePopup/PlacePopup";

const loggedOutNavItems = [
	{
		label: "Home",
		icon: <FaHome size={20} className="nav-icon" aria-hidden="true" />,
		href: "/",
	},
	{
		label: "Sign Up",
		icon: <FaUserPlus size={20} className="nav-icon" aria-hidden="true" />,
		href: "/signup",
	},
	{
		label: "Login",
		icon: (
			<FaArrowRightToBracket
				size={20}
				className="nav-icon"
				aria-hidden="true"
			/>
		),
		href: "/login",
	},
];

const loggedInNavItems = [
	{
		label: "Home",
		icon: <FaHome size={20} className="nav-icon" aria-hidden="true" />,
		href: "/",
	},
	{
		label: "Favourites",
		icon: <FaHeart size={20} className="nav-icon" aria-hidden="true" />,
		href: "/favourites",
	},
	{
		label: "Add a place",
		icon: <FaCirclePlus size={20} className="nav-icon" aria-hidden="true" />,
		href: "/add-place",
	},
];

export function Navbar() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [showResult, setShowResult] = useState(false);
	const [searchResult, setSearchResult] = useState([]);
	const [selectedPlace, setSelectedPlace] = useState(null);
	const [showPopup, setShowPopup] = useState(false);

	const location = useLocation();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const loggedIn = token !== null && token !== "undefined";
		if (loggedIn) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	}, [location]);

	const navItems = loggedIn ? loggedInNavItems : loggedOutNavItems;

	async function handleSearch(searchQuery) {
		if (searchQuery.trim() === "") {
			setSearchResult([]);
			setShowResult(false);
			return;
		}
		search(searchQuery)
			.then((data) => {
				if (data.ok) {
					setSearchResult(data.places);
					setShowResult(true);
				} else {
					setSearchResult([]);
					setShowResult(false);
				}
			})
			.catch((error) => {
				console.error("Search error: ", error);
				setSearchResult([]);
			});
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			handleSearch(searchQuery);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	return (
		<nav className="navbar" aria-label="Main navigation">
			<div className="navbar-logo">
				<Link to={"/"} className="logo-link">
					<div className="logo-img">
						<img src={logo} alt="Crust pilot home" />
					</div>
				</Link>
			</div>

			<div className="nav-links">
				{navItems.map((item) => (
					<NavLink
						key={item.href}
						to={item.href}
						aria-current={({ isActive }) => (isActive ? "page" : undefined)}
						className={({ isActive }) =>
							isActive ? "nav-item nav-item-active" : "nav-item"
						}>
						{item.icon}
						<span>
							<p>{item.label}</p>
						</span>
					</NavLink>
				))}
				{loggedIn && <LogoutNavLink />}
			</div>
			<div className="search-profile-section">
				<div className="search-container">
					<div className="search-bar">
						<input
							type="text"
							className="search-bar"
							placeholder="Search places..."
							aria-label="Search places"
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								handleSearch(e.target.value);
							}}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									setShowResult(false);
									setSearchQuery("");
								}
							}}
						/>
						<FaSearch size={25} className="search-icon" aria-label="Search" />
					</div>
					{showResult && searchResult.length > 0 && (
						<div
							className="search-result"
							role="listbox"
							aria-label="Search results">
							{searchResult.map((place) => (
								<div
									key={place._id}
									className="search-result-item"
									role="option">
									<button
										key={place._id}
										aria-label={`View ${place.name}, ${place.cuisine}`}
										onClick={() => {
											setSelectedPlace(place._id);
											setShowPopup(true);
											setShowResult(false);
											setSearchQuery("");
										}}
										className="search-result-item-button">
										<span className="result-name">{place.name}</span>
										<span className="result-category">{place.cuisine}</span>
									</button>
								</div>
							))}
						</div>
					)}
					{showPopup && selectedPlace && (
						<PlacePopup
							aria-modal="true"
							role="dialog"
							aria-labelledby="popup-title"
							placeId={selectedPlace}
							onClose={() => setShowPopup(false)}
						/>
					)}
				</div>
				<div className="profile-section">
					{loggedIn && (
						<NavLink
							to={"/profile"}
							aria-label="profile"
							aria-current={({ isActive }) =>
								isActive ? "profile page" : undefined
							}
							className={({ isActive }) =>
								isActive ? "profile-icon profile-icon-active" : "profile-icon"
							}>
							<FaRegCircleUser size={32} className="profile-react-icon" />
						</NavLink>
					)}
				</div>
			</div>
		</nav>
	);
}
