import { getPostById } from "../../services/posts";
import { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";

import "./PlacePopup.css";

export function PlacePopup(props) {
	const [place, setPlace] = useState(null);

	useEffect(() => {
		document.body.style.overflowY = "hidden";

		return () => {
			document.body.style.overflowY = "unset";
		};
	}, []);

	useEffect(() => {
		if (!props.placeId) return;

		getPostById(props.placeId)
			.then((data) => {
				if (data.ok) {
					setPlace(data.place);
				} else {
					console.log(data.message);
				}
			})
			.catch((error) => {
				console.error("Error: ", error);
			});
	}, [props.placeId]);

	if (!place) return;

	function getAverage(ratings) {
		if (!ratings.length) return 0;
		return (
			ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
		).toFixed(1);
	}
	return (
		<div className="popup-background" onClick={props.onClose}>
			<div
				className="place-popup"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="popup-title">
				<img src={place.image} alt={`Image of ${place.name}`} />
				<div className="place-popup-details">
					<button
						className="close-button"
						onClick={props.onClose}
						aria-label="Close popup">
						X
					</button>

					<div className="popup-header">
						<h2 id="popup-title">{place.name}</h2>
						<div className="cuisine-tag">{place.cuisine}</div>
					</div>
					<hr />
					<p className="popup-message">{place.message}</p>

					<div className="popup-rating">
						<div
							className="rating"
							role="img"
							aria-label={`Rated ${getAverage(place.ratings)} out of 5 stars from ${place.ratings.length} reviews`}>
							{[1, 2, 3, 4, 5].map((star) => (
								<span
									key={star}
									className={`search-result-star ${star <= parseFloat(getAverage(place.ratings)) ? "filled" : ""}`}>
									★
								</span>
							))}
							<span className="avg">
								{getAverage(place.ratings)} ({place.ratings.length})
							</span>
						</div>
					</div>

					<hr />
					<div className="map-container">
						<iframe
							loading="lazy"
							width={"100%"}
							height={"150"}
							style={{ borderRadius: "8px", border: "none" }}
							src={`https://www.google.com/maps?q=${encodeURIComponent(`${place.name} ${place.location}`)}&output=embed`}
							title={`Map showing location of ${place.name}`}
						/>
					</div>
					<a
						href={`https://www.google.com/maps/search/${encodeURIComponent(`${place.name} ${place.location}`)}`}
						target="_blank"
						rel="noreferrer"
						aria-label={`View ${place.name} on Google Maps`}
						className="location-link">
						<FaLocationDot size={14} />
						{place.name} {place.location && `· ${place.location}`}
						<FaExternalLinkAlt size={10} />
					</a>
				</div>
			</div>
		</div>
	);
}
