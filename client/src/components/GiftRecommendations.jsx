import { useEffect, useMemo, useState } from "react";
import { giftItems } from "../data/parkData";
import api from "../utils/api";

function GiftRecommendations({ checkInHistory }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recommendedGifts = useMemo(() => {
    if (checkInHistory.length === 0) {
      return [];
    }

    return giftItems.filter(
      (gift) =>
        gift.linkedZone === "Any" || checkInHistory.includes(gift.linkedZone)
    );
  }, [checkInHistory]);

  // Load the visitor's saved wishlist from the backend once, on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get("/wishlist");
        setWishlist(res.data);
      } catch (err) {
        setError("Couldn't load your wishlist. Try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToWishlist = async (gift) => {
    const alreadySaved = wishlist.some((item) => item.giftId === gift.id);
    if (alreadySaved) return;

    try {
      const res = await api.post("/wishlist", {
        giftId: gift.id,
        name: gift.name,
        category: gift.category,
        linkedZone: gift.linkedZone,
        linkedRide: gift.linkedRide,
      });
      setWishlist((currentWishlist) => [res.data.item, ...currentWishlist]);
    } catch (err) {
      setError("Couldn't save that gift. Try again.");
    }
  };

  const handleRemoveFromWishlist = async (giftId) => {
    try {
      await api.delete(`/wishlist/${giftId}`);
      setWishlist((currentWishlist) =>
        currentWishlist.filter((item) => item.giftId !== giftId)
      );
    } catch (err) {
      setError("Couldn't remove that gift. Try again.");
    }
  };

  return (
    <section className="gift-section">
      <div className="section-heading">
        <div>
          <h2>Recommended Gifts</h2>
          <p>Recommendations are based on the zones you have checked into.</p>
        </div>

        <span className="result-count">
          {recommendedGifts.length} result
          {recommendedGifts.length === 1 ? "" : "s"}
        </span>
      </div>

      {recommendedGifts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🎁</span>
          <p>No recommendations yet. Scan a park-zone QR code first.</p>
        </div>
      ) : (
        <div className="gift-list">
          {recommendedGifts.map((gift) => {
            const isSaved = wishlist.some((item) => item.giftId === gift.id);

            return (
              <article className="gift-card" key={gift.id}>
                <div className="gift-card-top">
                  <span className="category-tag">{gift.category}</span>
                  <span className="gift-icon">🎁</span>
                </div>

                <h3>{gift.name}</h3>

                <p>
                  <strong>Linked zone:</strong> {gift.linkedZone}
                </p>

                <p>
                  <strong>Linked attraction:</strong> {gift.linkedRide}
                </p>

                <button
                  type="button"
                  disabled={isSaved}
                  onClick={() => handleAddToWishlist(gift)}
                >
                  {isSaved ? "Saved ✓" : "Save to Wishlist"}
                </button>
              </article>
            );
          })}
        </div>
      )}

      <div className="wishlist-section">
        <h2>My Wishlist</h2>

        {error && <p className="wishlist-error">{error}</p>}

        {loading ? (
          <p>Loading your wishlist...</p>
        ) : wishlist.length === 0 ? (
          <p>No gifts saved yet.</p>
        ) : (
          <ul className="wishlist-list">
            {wishlist.map((item) => (
              <li key={item.giftId}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.category}</span>
                </div>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleRemoveFromWishlist(item.giftId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default GiftRecommendations;
