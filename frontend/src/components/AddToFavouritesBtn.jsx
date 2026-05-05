import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function tokenChecker() {
	const token = localStorage.getItem("token");
	if (!token) {
		return { token: "", found: false };
	}
	return { token: token, found: true };
}

export function AddToFavourites(props) {
	const navigate = useNavigate();
	const { token, found } = tokenChecker();

	const [isFavourited, setIsFavourited] = useState(props.isFavourited);

	useEffect(() => {
		if (!found) {
			console.log(
				"send the user to the login page, could not find token in localStorage",
			);
			console.log(token, found);
			navigate("/");
		}
	}, [found]);

	useEffect(() => {
		setIsFavourited(props.isFavourited);
	}, [props.isFavourited]);

	if (!found) {
		return;
	}

	const { restaurantId } = props;
	const sendData = () => {
		sendPostId(token, restaurantId).then(
			() => {
				setIsFavourited(true); // if we want remove from favs functionality later:  setIsFavourited((prev) => !prev);
				props.onFavouriteAdded?.(restaurantId);
			},
			(err) => {
				console.log("Application error, could not make request");
				console.error(err);
			},
		);
	};

	return (
		<>
			<button
				onClick={sendData}
				className="favourites-add-button"
				aria-label={
					isFavourited ? "Remove from favourites" : "Add to favourites"
				}
				aria-pressed={isFavourited}
				style={{
					background: "transparent",
					border: "none",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					gap: "6px",
				}}>
				{isFavourited ? (
					<>
						<FaHeart color="#E41B1B" size={20} aria-hidden="true" />
						<span style={{ color: "#E41B1B" }}>Favourited</span>
					</>
				) : (
					<>
						<FaRegHeart color="#DCB900" size={20} aria-hidden="true" />
						<span style={{ color: "#DCB900" }}>Add to favourites</span>
					</>
				)}
			</button>
		</>
	);
}

async function sendPostId(token, postId) {
	const url = `${BACKEND_URL}/favourites/${postId}`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	const body = await response.json();
	if (!response.ok) {
		console.warn("Server did not respond with an okay resposne");
	}

	return body;
}
