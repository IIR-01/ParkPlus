import { useState } from "react";
import { giftItems } from "../data/parkData";

function GiftRecommendations({ checkInHistory }) {
  const [wishlist, setWishlist] = useState([]);

  const recommendedGifts = giftItems.filter((gift) =>
    checkInHistory.includes(gift.linkedZone)
  );

  const handleAddToWishlist = (gift) => {
    const alreadySaved = wishlist.find((item) => item.id === gift.id);

    if (!alreadySaved) {
      setWishlist([...wishlist, gift]);
    }
  };

  return (
    <div className="gift-section">
      <h2>Recommended Gifts</h2>

      {recommendedGifts.length === 0 ? (
        <p>No recommendations yet. Check in to a zone first.</p>
      ) : (
        <div className="gift-list">
          {recommendedGifts.map((gift) => (
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

              <button onClick={() => handleAddToWishlist(gift)}>
                Save to Wishlist
              </button>
            </div>
          ))}
        </div>
      )}

      <h2>My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No gift saved yet.</p>
      ) : (
        <ul>
          {wishlist.map((gift) => (
            <li key={gift.id}>{gift.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GiftRecommendations;