import { useState, useEffect } from "react";
import { giftItems } from "../data/parkData";
import api from "../utils/api";

function GiftRecommendations({ checkInHistory }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recommendedGifts = giftItems.filter((gift) =>
    checkInHistory.includes(gift.linkedZone)
  );

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
    const alreadySaved = wishlist.find((item) => item.giftId === gift.id);
    if (alreadySaved) return;

    try {
      const res = await api.post("/wishlist", {
        giftId: gift.id,
        name: gift.name,
        category: gift.category,
        linkedZone: gift.linkedZone,
        linkedRide: gift.linkedRide,
      });
      setWishlist([res.data.item, ...wishlist]);
    } catch (err) {
      setError("Couldn't save that gift. Try again.");
    }
  };

  const handleRemoveFromWishlist = async (giftId) => {
    try {
      await api.delete(`/wishlist/${giftId}`);
      setWishlist(wishlist.filter((item) => item.giftId !== giftId));
    } catch (err) {
      setError("Couldn't remove that gift. Try again.");
    }
  };

  return (
    <div className="gift-section">
      <h2>Recommended Gifts</h2>

      {recommendedGifts.length === 0 ? (
        <p>No recommendations yet. Check in to a zone first.</p>
      ) : (
        <div className="gift-list">
          {recommendedGifts.map((gift) => {
            const isSaved = wishlist.some((item) => item.giftId === gift.id);
            return (
              <div className="gift-card" key={gift.id}>
                <h3>{gift.name}</h3>

                <p>
                  <strong>Category:</strong> {gift.category}
                </p>

                <p>
                  <strong>Linked Zone:</strong> {gift.linkedZone}
                </p>

                <p>
                  <strong>Linked Ride:</strong> {gift.linkedRide}
                </p>

                <button
                  onClick={() => handleAddToWishlist(gift)}
                  disabled={isSaved}
                >
                  {isSaved ? "Saved" : "Save to Wishlist"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <h2>My Wishlist</h2>

      {error && <p className="wishlist-error">{error}</p>}

      {loading ? (
        <p>Loading your wishlist...</p>
      ) : wishlist.length === 0 ? (
        <p className="wishlist-empty">
          Nothing saved yet — check in to a zone and save a gift above.
        </p>
      ) : (
        <div className="wishlist-list">
          {wishlist.map((item) => (
            <div className="wishlist-card" key={item.giftId}>
              <div className="wishlist-card-info">
                <span className="wishlist-card-name">{item.name}</span>
                {item.category && (
                  <span className="wishlist-card-tag">{item.category}</span>
                )}
              </div>
              <button
                className="wishlist-remove-btn"
                onClick={() => handleRemoveFromWishlist(item.giftId)}
                aria-label={`Remove ${item.name} from wishlist`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GiftRecommendations;
