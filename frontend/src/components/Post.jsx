import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AddToFavourites } from "./AddToFavouritesBtn";
import "./Post.css";

function Post() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeIndex, setActiveIndex] = useState(0);
	const [selectedCuisine, setSelectedCuisine] = useState("All");
	const [loggedIn, setLoggedIn] = useState(false);
	const location = useLocation();
	const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null && token !== "undefined";

    setLoggedIn(loggedIn);
  }, [location]);

  const userId = localStorage.getItem("user_id");

  const cuisines = [
    "All",
    ...new Set(
      posts
        .map((post) => post.cuisine)
        .filter(Boolean)
        .map(
          (cuisine) =>
            cuisine.charAt(0).toUpperCase() + cuisine.slice(1).toLowerCase(),
        ),
    ),
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
		fetch("http://localhost:3000/posts", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				if (!res.ok) throw new Error("Auth failed");
				return res.json();
			})
			.then((data) => {
				setPosts(data.posts || []);
				setLoading(false);
				setActiveIndex(0);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, [loggedIn]);


  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCuisine]);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) return;

		fetch("http://localhost:3000/favourites", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setFavourites(data.data?.favouriteRestaurants || []);
			})
			.catch((err) => console.error(err));
	}, []);

	function handleFavouriteAdded(postId) {
		setFavourites((prev) => [...prev, { _id: postId }]);
	}

	const filteredPosts =
		selectedCuisine === "All"
			? posts
			: posts.filter(
					(p) =>
						p &&
						p.cuisine &&
						p.cuisine.toLowerCase() === selectedCuisine.toLowerCase(),
				);

	function next() {
		setActiveIndex((i) => Math.min(i + 1, filteredPosts.length - 1));
	}

	function prev() {
		setActiveIndex((i) => Math.max(i - 1, 0));
	}

	function getAverage(ratings = []) {
		if (!ratings.length) return 0;
		return (
			ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
		).toFixed(1);
	}

	function getUserRating(ratings = [], userId) {
		const r = ratings.find((r) => r.user === userId);
		return r ? r.value : 0;
	}

	function ratePost(id, rating) {
		const token = localStorage.getItem("token");

		setPosts((prev) =>
			prev.map((p) => {
				if (!p || p._id !== id) return p;

				const oldRatings = p.ratings || [];
				const filtered = oldRatings.filter((r) => r.user !== userId);

				return {
					...p,
					ratings: [...filtered, { user: userId, value: rating }],
				};
			}),
		);

		fetch(`http://localhost:3000/posts/${id}/rate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ rating }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (!data?.post?._id) return;

				setPosts((prev) => prev.map((p) => (p._id === id ? data.post : p)));
			})
			.catch((err) => console.error(err));
	}

	if (loading)
		return (
			<div role="status" aria-live="polite">
				Loading feed...
			</div>
		);
	if (!posts.length) return <div role="status">No posts found</div>;

	return (
		<div className="feed-wrapper">
			<h2 className="most-popular">Most Popular</h2>
			<div className="feed-container">
				<button
					className="nav left"
					onClick={prev}
					aria-label="Previous restaurant">
					◀
				</button>

				<div
					className="feed-track"
					style={{
						transform: `translateX(-${activeIndex * 100}vw)`,
					}}>
					{filteredPosts
						.filter((p) => p && p._id)
						.map((post, index) => {
							const ratings = post?.ratings || [];
							const userRating = loggedIn
								? getUserRating(ratings, userId)
								: parseFloat(getAverage(ratings));

							return (
								<div className="slide" key={post._id}>
									<div
										className={`card ${index === activeIndex ? "active" : ""}`}>
										<img src={post?.image} alt={`Image of ${post?.name}`} />
										<h2>{post?.name}</h2>
										<p>{post?.message}</p>

										<div
											className="rating"
											role="img"
											aria-label={`Rated ${getAverage(ratings)} out of 5 stars from ${ratings.length} reviews`}>
											{[1, 2, 3, 4, 5].map((star) => (
												<span
													key={star}
													className={`star ${star <= userRating ? "filled" : ""} ${!loggedIn ? "no-hover" : ""}`}
													role="button"
													aria-label={`Rate ${star} ouf of 5`}
													onClick={() => {
														if (loggedIn) ratePost(post._id, star);
													}}>
													★
												</span>
											))}
											<span className="avg">
												{getAverage(ratings)} ({ratings.length})
											</span>
										</div>

										<p>{post?.location}</p>
										<AddToFavourites
											restaurantId={post._id}
											isFavourited={favourites.some(
												(fav) => fav._id === post._id,
											)}
											onFavouriteAdded={handleFavouriteAdded}
										/>
									</div>
								</div>
							);
						})}
				</div>

				<button
					className="nav right"
					onClick={next}
					aria-label="Next restaurant">
					▶
				</button>
			</div>

			<div className="cuisine-bar">
				{cuisines.map((cuisine) => (
					<button
						key={cuisine}
						className={selectedCuisine === cuisine ? "active" : ""}
						aria-pressed={selectedCuisine === cuisine}
						aria-label={`Filter by ${cuisine}`}
						onClick={() => setSelectedCuisine(cuisine)}>
						{cuisine}
					</button>
				))}
			</div>

			<div className="filtered-feed">
				{filteredPosts
					.filter((p) => p && p._id)
					.map((post) => {
						const ratings = post?.ratings || [];
						const userRating = loggedIn
							? getUserRating(ratings, userId)
							: parseFloat(getAverage(ratings));

						{
							/* filtered content?*/
						}
						return (
							<div key={post._id} className="filtered-card">
								<img src={post?.image} alt={`Image of ${post?.name}`} />

								<div className="filtered-content">
									<h3>{post?.name}</h3>
									<p>{post?.message}</p>

									<div
										className="rating"
										role="img"
										aria-label={`Rated ${getAverage(ratings)} out of 5 stars from ${ratings.length} reviews`}>
										{[1, 2, 3, 4, 5].map((star) => (
											<span
												key={star}
												className={`star ${star <= userRating ? "filled" : ""} ${!loggedIn ? "no-hover" : ""}`}
												role="button"
												aria-label={`Rate ${star} ouf of 5`}
												onClick={() => {
													if (loggedIn) ratePost(post._id, star);
												}}>
												★
											</span>
										))}
										<span className="avg">
											{getAverage(ratings)} ({ratings.length})
										</span>
									</div>

									<p>{post?.location}</p>
									<AddToFavourites
										restaurantId={post._id}
										isFavourited={favourites.some(
											(fav) => fav._id === post._id,
										)}
										onFavouriteAdded={handleFavouriteAdded}
									/>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
}

export default Post;