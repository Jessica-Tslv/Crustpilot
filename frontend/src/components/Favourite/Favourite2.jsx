import "../../components/Post.css";
import "./Favourites.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { PlacePopup } from "../PlacePopup/PlacePopup";
import { FaRegHeart } from "react-icons/fa6";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function CardComponent(props) {
	const { _id, name, message, location, image, ratings } =
		props.restaurant_data;
	const { originalData, updateFavourites } = props;
	const navigate = useNavigate();

	const removeFavourites = () => {
		const updatedData = originalData.filter((data) => data.name !== name);
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
			return;
		}

		updateFavourites(updatedData);
		console.log("id to send", _id);
		fetch(`${BACKEND_URL}/favourites/${_id.toString()}`, {
			method: "PATCH",
			headers: { Authorization: `Bearer ${token}` },
		}).then(
			(_success) => console.clear(),
			(err) => console.error(err),
		);
	};

	const [showPopup, setShowPopup] = useState(false);
	const [selectedPlace, setSelectedPlace] = useState(null);

	return (
		<>
			<div
				className="favourites-card"
				aria-label={`${name} restaurant card`}>
				<img src={image} alt={`Photo of ${name}`} />

				<h2>{name}</h2>

				<p>{message}</p>

				<StarRating ratings={ratings} />
				{/* <p>{location}</p> */}

				<div
					className="favourites-button-container"
					role="group"
					aria-label="Restaurant actions">
					<button
						className="favourites-view-button"
						onClick={() => {
							setSelectedPlace(_id);
							setShowPopup(true);
						}}
						aria-label={`View details for ${name}`}>
						View Restaurant
					</button>
					<button
						className="favourites-remove-button"
						onClick={removeFavourites}
						aria-label={`Remove ${name} from favourites`}>
						{" "}
						Remove from favourites{" "}
					</button>
				</div>
			</div>
			{showPopup && selectedPlace && (
				<PlacePopup
					placeId={selectedPlace}
					onClose={() => setShowPopup(false)}
					aria-modal="true"
					role="dialog"
					aria-label={`Details for ${name}`}
				/>
			)}
		</>
	);
}

export function FavouritesComponent() {
	const navigate = useNavigate();
	const [favourites, updateFavourites] = useState([]);
	const [error, setErrorMessage] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			console.warn("Could not find token, redirecting to login");
			navigate("/login");
			return;
		}

		getFavouritesData(token).then(
			(response) => {
				if (!response.ok) {
					setErrorMessage(response.message);
					return;
				}

				const favs = response.data.favouriteRestaurants;
				const mostRecents = favs.toReversed();
				setErrorMessage("");
				// To show most recently added to favourites at the top
				updateFavourites(mostRecents);
				return;
			},
			(err) => {
				console.error("Application failure ->");
				console.error(err);
				setErrorMessage("This service is down, please try again later");
			},
		);
	}, []);

	if (favourites.length == 0) {
		return (
			<>
				{error ? (
					<div className="empty-state" role="status" aria-live="polite">
						<p>{error}</p>
					</div>
				) : (
					<div className="empty-state" role="status" aria-live="polite">
						<FaRegHeart
							size={36}
							color="#e8431a"
							className="icon"
							aria-hidden="true"
						/>
						<h3>No Favourites yet</h3>
						<p>Places you love will appear here</p>
						<Link to="/" className="explore-btn">
							Explore places
						</Link>
					</div>
				)}
			</>
		);
	}

	return (
		<>
			<h2 className="favourite-header">Restaurants you loved!</h2>
			{error ? <p>{error}</p> : ""}
			<div className="favourites-container">
				{favourites.length > 0 &&
					favourites.map((data, index) => (
						<CardComponent
							key={index}
							role="listitem"
							restaurant_data={data}
							originalData={favourites}
							updateFavourites={updateFavourites}
						/>
					))}
			</div>
		</>
	);
}

function StarRating({ ratings }) {
	function getAverage(ratings) {
		if (!ratings.length) return 0;
		return (
			ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
		).toFixed(1);
	}

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
	return (
		<div
			className="favourite-ratings"
			role="img"
			aria-label={`Rated ${getAverage(ratings)} out of 5 stars from ${ratings.length} reviews`}>
			<div className="favourite-rating">
				{[1, 2, 3, 4, 5].map((star) => (
					<span
						key={star}
						className={`favourite-star ${star <= parseFloat(getAverage(ratings)) ? "filled" : ""}`}>
						★
					</span>
				))}
				<span className="favourite-avg">
					{getAverage(ratings)} ({ratings.length})
				</span>
			</div>
		</div>
	);
}

async function getFavouritesData(token) {
	try {
		const endpoint = `${BACKEND_URL}/favourites`;
		const response = await fetch(endpoint, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const body = await response.json();
		if (!response.ok) {
			console.warn("Server did not respond with an ok request");
			console.log(body);
			return { ok: false, message: "An error occured, please try again later" };
		}

		// data structure: {ok: bool, message: string, data: { favouriteRestaurants: [{}] } }
		return body;
	} catch (err) {
		console.error("Could not getFavouritesData");
		console.error(err);
		return {
			ok: false,
			message: "This service is down, please try again later",
		};
	}
}
