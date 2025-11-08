import React, { useEffect, useRef, useState } from 'react';
import Nav from './Nav';
import CategoryCard from './CategoryCard';
import { categories } from '../category';
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';
import shoppimage from '../assets/shopregister.png';
import itemimage from '../assets/itemavial.png';

const SCROLL_AMOUNT = 300 // Smooth scroll step

const UserDashboard = () => {
  const cateScrollRef = useRef();
  const shopScrollRef = useRef();

  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector((state) => state.user);
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);
  const navigate = useNavigate();

  // ✅ Filter by category
  const handleFilterByCategory = (category) => {
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      const filtered = itemsInMyCity?.filter((i) => i.category === category) || [];
      setUpdatedItemsList(filtered);
    }
  };

  // ✅ Update items whenever Redux data changes
  useEffect(() => {
    if (itemsInMyCity && itemsInMyCity.length > 0) {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      setUpdatedItemsList([]);
    }
  }, [itemsInMyCity, currentCity]);

  // ✅ Update scroll buttons
  const updateScrollButtons = (ref, setLeft, setRight) => {
    const el = ref.current;
    if (el) {
      setLeft(el.scrollLeft > 0);
      setRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    }
  };

  // ✅ Scroll handler
  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
        behavior: 'smooth',
      });
    }
  };

  // ✅ Add scroll listeners
  useEffect(() => {
    const cateEl = cateScrollRef.current;
    const shopEl = shopScrollRef.current;

    const handleCateScroll = () => updateScrollButtons(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
    const handleShopScroll = () => updateScrollButtons(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);

    if (cateEl) cateEl.addEventListener('scroll', handleCateScroll);
    if (shopEl) shopEl.addEventListener('scroll', handleShopScroll);

      updateScrollButtons(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      updateScrollButtons(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)

    return () => {
      if (cateEl) cateEl.removeEventListener('scroll', handleCateScroll);
      if (shopEl) shopEl.removeEventListener('scroll', handleShopScroll);
    };
  }, [categories, shopInMyCity]);

  // ✅ Debugging info (remove later if needed)
  useEffect(() => {
    console.log("City:", currentCity);
    console.log("Shops:", shopInMyCity);
    console.log("Items:", itemsInMyCity);
  }, [currentCity, shopInMyCity, itemsInMyCity]);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-10 items-center bg-gradient-to-b from-[#fff8f5] to-[#ffe7da] overflow-y-auto pb-16 font-[Poppins]">
      {/* Navbar */}
      <Nav />

      {/* Fixed Info Note */}
      <p className="fixed top-22 right-6 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg py-2 px-4 shadow-md font-medium text-sm max-w-xs z-50 mt-1"> ⚡ Note: To see working, enter city: <span className="font-semibold">sabour</span> </p>

      {/* Search Results */}
      {searchItems && searchItems.length > 0 && (
        <div className="w-full max-w-6xl flex flex-col gap-6 items-start p-6 bg-white shadow-xl rounded-3xl mt-4">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-3">
            Search Results
          </h1>
          <div className="w-full flex flex-wrap gap-6 justify-center">
            {searchItems.map(item => <FoodCard data={item} key={item._id} />)}
          </div>
        </div>
      )}

      {/* Categories Section */}
      <section className="w-full max-w-6xl flex flex-col gap-6 items-start px-4 sm:px-6">
        <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold tracking-tight">Explore by Categories</h1>
        <div className="relative w-full">
          {showLeftCateButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-3 rounded-full shadow-lg hover:scale-105 hover:bg-[#e64528] transition-transform z-10"
              onClick={() => scroll(cateScrollRef, 'left')}
            >
              <FaCircleChevronLeft size={24} />
            </button>
          )}
          <div
            ref={cateScrollRef}
            className="w-full flex overflow-x-auto gap-5 py-4 scrollbar-hide scroll-smooth"
          >
            {categories.map((cate, index) => (
              <CategoryCard
                key={index}
                name={cate.category}
                image={cate.image}
                onClick={() => handleFilterByCategory(cate.category)}
              />
            ))}
          </div>
          {showRightCateButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-3 rounded-full shadow-lg hover:scale-105 hover:bg-[#e64528] transition-transform z-10"
              onClick={() => scroll(cateScrollRef, 'right')}
            >
              <FaCircleChevronRight size={24} />
            </button>
          )}
        </div>
      </section>

      {/* Shops Section */}
      <section className="w-full max-w-6xl flex flex-col gap-6 items-start px-4 sm:px-6">
        <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold tracking-tight">
          Top Rated Shops in <span className="text-[#ff4d2d]">{currentCity}</span>
        </h1>
        <div className="relative w-full">
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-3 rounded-full shadow-lg hover:scale-105 hover:bg-[#e64528] transition-transform z-10"
              onClick={() => scroll(shopScrollRef, 'left')}
            >
              <FaCircleChevronLeft size={24} />
            </button>
          )}
          <div
            ref={shopScrollRef}
            className="w-full flex overflow-x-auto gap-5 py-4 scrollbar-hide scroll-smooth"
          >
            {shopInMyCity?.length > 0 ? (
              shopInMyCity.map(shop => (
                <CategoryCard
                  key={shop._id}
                  name={shop.name}
                  image={shop.image}
                  onClick={() => navigate(`/shop/${shop._id}`)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-8 gap-6 bg-gradient-to-br from-[#ffe0cf] to-[#fff6f3] rounded-3xl shadow-inner">
                <p className="text-gray-600 text-center text-lg sm:text-xl font-medium">No shops available</p>
                <div className="w-80 h-80 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img src={shoppimage} alt="No shops" className="w-72 h-72 object-contain" />
                </div>
                <p className="text-gray-400 text-sm sm:text-base">Try a different city or check back later.</p>
              </div>
            )}
          </div>
          {showRightShopButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-3 rounded-full shadow-lg hover:scale-105 hover:bg-[#e64528] transition-transform z-10"
              onClick={() => scroll(shopScrollRef, 'right')}
            >
              <FaCircleChevronRight size={24} />
            </button>
          )}
        </div>
      </section>

      {/* Suggested Items */}
      <section className="w-full max-w-6xl flex flex-col gap-6 items-start px-4 sm:px-6">
        <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold tracking-tight">Recommended for You</h1>
        <div className="w-full flex flex-wrap gap-6 justify-center">
          {updatedItemsList?.length > 0 ? (
            updatedItemsList.map(item => (
              <FoodCard key={item._id} data={item} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-8 gap-6 bg-gradient-to-br from-[#fff5ee] to-[#ffe3d6] rounded-3xl shadow-lg">
              <p className="text-gray-700 text-lg sm:text-xl font-semibold">No food items found</p>
              <div className="w-80 h-80 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <img src={itemimage} alt="No items" className="w-72 h-72 object-contain" />
              </div>
              <p className="text-gray-400 text-sm sm:text-base">Try selecting another category or search again.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
