import React from "react";

const featuredItems = [
  {
    title: "Front Bumper",
    imageUrl: "https://via.placeholder.com/300x200?text=Bumper"
  },
  {
    title: "Headlight",
    imageUrl: "https://via.placeholder.com/300x200?text=Headlight"
  },
  {
    title: "Brake Pads",
    imageUrl: "https://via.placeholder.com/300x200?text=Brakes"
  },
  {
    title: "Mirror",
    imageUrl: "https://via.placeholder.com/300x200?text=Mirror"
  },
  {
    title: "Fender",
    imageUrl: "https://via.placeholder.com/300x200?text=Fender"
  },
  {
    title: "Tail Light",
    imageUrl: "https://via.placeholder.com/300x200?text=Tail+Light"
  },
  {
    title: "Grille",
    imageUrl: "https://via.placeholder.com/300x200?text=Grille"
  },
  {
    title: "Touchscreen",
    imageUrl: "https://via.placeholder.com/300x200?text=Touchscreen"
  }
];

// Utility to chunk array into groups of 4
const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
};

const FeaturedCarousel = () => {
  const slides = chunkArray(featuredItems, 4); // 4 items per slide

  return (
    <div className="container my-5">
      <h2 className="mb-4">Featured Listings</h2>
      <div id="featuredCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {slides.map((group, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <div className="row">
                {group.map((item, i) => (
                  <div key={i} className="col-md-3">
                    <div className="card h-100 shadow-sm">
                      <img src={item.imageUrl} className="card-img-top" alt={item.title} />
                      <div className="card-body text-center">
                        <h6 className="card-title mb-0">{item.title}</h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#featuredCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#featuredCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
