import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPlace } from "../../services/posts";
import "./AddPlacePage.css";

export const AddPlacePage = () => {
  // State to hold our form inputs
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [rating, setRating] = useState("5"); // Default to 5 stars
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent page reload on form submit
		setError(null);

		try {
			// Get the user's token from localStorage (adjust if you store it differently)
			const token = localStorage.getItem("token");

      // const placeData = {
      //   name,
      //   message,
      //   cuisine,
      //   rating: Number(rating),
      //   image,
      //   location,
      // };
      
      const placeData = new FormData();

      placeData.append("name", name);
      placeData.append("message", message);
      placeData.append("cuisine", cuisine);
      placeData.append("rating", rating);
      placeData.append("location", location);
      placeData.append("image", image);


			// Call our service function
			await addPlace(placeData, token);

			// If successful, redirect the user back to the feed/home page
			navigate("/");
		} catch (err) {
			if (
				err.message.includes("Unauthorized") ||
				err.message.includes("token") ||
				err.message.includes("auth")
			) {
				localStorage.removeItem("token");
				navigate("/login");
			} else {
				setError(err.message);
			}
		}
	};

	return (
		<div className="add-place-wrapper">
			<div className="add-place-card">
				<h2>Add a place</h2>

				{error && (
					<p className="error-message" role="alert" aria-live="assertive">
						{error}
					</p>
				)}

				<form
					onSubmit={handleSubmit}
					className="add-place-form"
					aria-label="Add a place form">
					<div className="form-group">
						<label htmlFor="name">Name</label>
            <input
              id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							aria-required="true"
						/>
					</div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. 42 Albemarle St, London"
              required
            />
          </div>

          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>

					<div className="form-group">
						<label htmlFor="description">Description</label>
						<textarea
							rows="4"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="What did you think of the place?"
							required
							aria-required="true"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="cuisine">Cuisine</label>
						<input
							type="text"
							value={cuisine}
							onChange={(e) => setCuisine(e.target.value)}
							placeholder="e.g. Italian, Indian"
							required
							aria-required="true"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="rating">First rating</label>
						<select
							id="rating"
							value={rating}
							onChange={(e) => setRating(e.target.value)}>
							<option value="5" aria-label="5 stars">
								⭐⭐⭐⭐⭐ (5)
							</option>
							<option value="4" aria-label="4 stars">
								⭐⭐⭐⭐ (4)
							</option>
							<option value="3" aria-label="3 stars">
								⭐⭐⭐ (3)
							</option>
							<option value="2" aria-label="2 stars">
								⭐⭐ (2)
							</option>
							<option value="1" aria-label="1 stars">
								⭐ (1)
							</option>
						</select>
					</div>

					<button
						type="submit"
						className="submit-btn"
						aria-label="Submit and add this place">
						Add place
					</button>
				</form>
			</div>
		</div>
	);
};
