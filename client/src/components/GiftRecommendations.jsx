import { useMemo, useState } from "react";
import { giftItems } from "../data/parkData";

function GiftRecommendations({ checkInHistory }) {
  const [wishlist, setWishlist] = useState([]);

  const recommendedGifts = useMemo(() => {
    if (checkInHistory.length === 0) {
      return [];
    }

    return giftItems.filter(
      (gift) =>
        gift.linkedZone === "Any" ||
        checkInHistory.includes(gift.linkedZone)
    );
  }, [checkInHistory]);

  const handleAddToWishlist = (gift) => {
    setWishlist((currentWishlist) => {
      const alreadySaved = currentWishlist.some(
        (item) => item.id === gift.id
      );

      if (alreadySaved) {
        return currentWishlist;
      }

      return [...currentWishlist, gift];
    });
  };

  const handleRemoveFromWishlist = (giftId) => {
    setWishlist((currentWishlist) =>
      currentWishlist.filter((gift) => gift.id !== giftId)
    );
  };

  return (
    <section className="gift-section">
      <div className="section-heading">
        <div>
          <h2>Recommended Gifts</h2>
          <p>
            Recommendations are based on the zones you have checked into.
          </p>
        </div>

        <span className="result-count">
          {recommendedGifts.length} result
          {recommendedGifts.length === 1 ? "" : "s"}
        </span>
      </div>

      {recommendedGifts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🎁</span>
          <p>
            No recommendations yet. Scan a park-zone QR code first.
          </p>
        </div>
      ) : (
        <div className="gift-list">
          {recommendedGifts.map((gift) => {
            const isSaved = wishlist.some(
              (item) => item.id === gift.id
            );

            return (
              <article className="gift-card" key={gift.id}>
                <div className="gift-card-top">
                  <span className="category-tag">
                    {gift.category}
                  </span>

                  <span className="gift-icon">🎁</span>
                </div>

                <h3>{gift.name}</h3>

                <p>
                  <strong>Linked zone:</strong>{" "}
                  {gift.linkedZone}
                </p>

                <p>
                  <strong>Linked attraction:</strong>{" "}
                  {gift.linkedRide}
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

        {wishlist.length === 0 ? (
          <p>No gifts saved yet.</p>
        ) : (
          <ul className="wishlist-list">
            {wishlist.map((gift) => (
              <li key={gift.id}>
                <div>
                  <strong>{gift.name}</strong>
                  <span>{gift.category}</span>
                </div>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() =>
                    handleRemoveFromWishlist(gift.id)
                  }
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