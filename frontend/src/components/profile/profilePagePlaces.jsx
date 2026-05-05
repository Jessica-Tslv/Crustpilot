import { useEffect, useState } from "react";
import "../Post.css";

function ProfilePagePlaces() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeIndex, setActiveIndex] = useState(0);
	const [selectedCuisine, setSelectedCuisine] = useState("All");

	const userId = localStorage.getItem("user_id");
	console.log("YOUR ID IS", userId);

  // const cuisines = ["All", "Indian", "Carribean", "Italian", "American"];

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
				console.log("DATA!", data);
				setPosts(data.posts || []);
				setLoading(false);
				setActiveIndex(0);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		setActiveIndex(0);
	}, [selectedCuisine, posts]);

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
      <h1 className="YourPlaces">Your Added Places</h1>

      <div className="filtered-feed">
        {filteredPosts
          .filter((p) => p.author == userId && p._id)
          .map((post) => {
            const ratings = post?.ratings || [];
            const userRating = getUserRating(ratings, userId);

            return (
              <div key={post._id} className="filtered-card">
                <img src={post?.image} alt={post?.name} />
				<br></br>
				<h3>{post?.name}</h3>
				<p className="message">{post?.message}</p>

                <div
                  className="rating"
                  role="img"
                  aria-label={`Rated ${getAverage(ratings)} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= userRating ? "filled" : ""}`}
                      onClick={() => ratePost(post._id, star)}
                      role="button"
                      aria-label={`Rate ${star} out of 5`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="avg">
                    {getAverage(ratings)} ({ratings.length})
                  </span>
                </div>

                <p>{post?.location}</p>
              </div>
            ); 
          })} 
      </div>
    </div>
  );
}

export default ProfilePagePlaces;
