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

const SCROLL_AMOUNT = 250; // Smooth scroll step

const UserDashboard = () => {
  const cateScrollRef = useRef();
  const shopScrollRef = useRef();
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(state => state.user);
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
      setUpdatedItemsList(itemsInMyCity?.filter(i => i.category === category) || []);
    }
  };

  // ✅ Update items when available (no infinite reload)
  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity || []);
  }, [itemsInMyCity]);

  /*
  ⚠️ If you *really* want a one-time reload, use this instead:
  useEffect(() => {
    if (itemsInMyCity && itemsInMyCity.length > 0) {
      setUpdatedItemsList(itemsInMyCity);
      if (!sessionStorage.getItem("hasReloaded")) {
        sessionStorage.setItem("hasReloaded", "true");
        window.location.reload();
      }
    }
  }, [itemsInMyCity]);
  */

  // ✅ Update scroll buttons visibility
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

    if (cateEl && shopEl) {
      const handleCateScroll = () => updateScrollButtons(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
      const handleShopScroll = () => updateScrollButtons(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);

      cateEl.addEventListener('scroll', handleCateScroll);
      shopEl.addEventListener('scroll', handleShopScroll);

      // Initial check
      updateScrollButtons(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
      updateScrollButtons(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);

      return () => {
        cateEl.removeEventListener('scroll', handleCateScroll);
        shopEl.removeEventListener('scroll', handleShopScroll);
      };
    }
  }, [categories, shopInMyCity]);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-8 items-center bg-gradient-to-b from-[#fff9f6] to-[#ffece0] overflow-y-auto pb-10">
      {/* Navbar */}
      <Nav />

      {/* Info Note */}
      <p className="fixed top-22 right-6 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg py-2 px-4 shadow-md font-medium text-sm max-w-xs z-50">
        ⚡ Note: To see working, enter city: <span className="font-semibold">sabour</span>
      </p>

      {/* Search Results */}
      {searchItems && searchItems.length > 0 && (
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2">
            Search Results
          </h1>
          <div className="w-full h-auto flex flex-wrap gap-6 justify-center">
            {searchItems.map(item => <FoodCard data={item} key={item._id} />)}
          </div>
        </div>
      )}

      {/* Categories Section */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start px-4 sm:px-6">
        <h1 className="text-gray-800 text-2xl sm:text-3xl font-semibold">Inspiration for your first order</h1>
        <div className="w-full relative">
          {showLeftCateButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-3 rounded-full shadow-lg hover:bg-[#e64528] transition-all z-10"
              onClick={() => scroll(cateScrollRef, 'left')}
            >
              <FaCircleChevronLeft size={24} />
            </button>
          )}

          <div className="w-full flex overflow-x-auto gap-4 py-3 scrollbar-hide" ref={cateScrollRef}>
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
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-3 rounded-full shadow-lg hover:bg-[#e64528] transition-all z-10"
              onClick={() => scroll(cateScrollRef, 'right')}
            >
              <FaCircleChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Shops Section */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start px-4 sm:px-6">
        <h1 className="text-gray-800 text-2xl sm:text-3xl font-semibold">Best Shops in {currentCity}</h1>
        <div className="w-full relative">
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-3 rounded-full shadow-lg hover:bg-[#e64528] transition-all z-10"
              onClick={() => scroll(shopScrollRef, 'left')}
            >
              <FaCircleChevronLeft size={24} />
            </button>
          )}

          <div className="w-full flex overflow-x-auto gap-4 py-3 scrollbar-hide" ref={shopScrollRef}>
            {shopInMyCity?.length > 0 ? shopInMyCity.map(shop => (
              <CategoryCard
                key={shop._id}
                name={shop.name}
                image={shop.image}
                onClick={() => navigate(`/shop/${shop._id}`)}
              />
            )) : (
              <div className="flex flex-col items-center justify-center w-full py-8 gap-6 bg-gradient-to-br from-[#edd1bb] to-[#f9f4f0] rounded-3xl shadow-md">
                <p className="text-gray-600 text-center text-xl sm:text-2xl font-semibold">No shops available</p>
                <div className="w-96 h-96 bg-white rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden animate-bounce-slow">
                  <img src={shoppimage} alt="No shops" className="w-80 h-80 object-contain" />
                </div>
                <p className="text-gray-400 text-center text-sm sm:text-base">Try selecting a different city or check back later.</p>
              </div>
            )}
          </div>

          {showRightShopButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-3 rounded-full shadow-lg hover:bg-[#e64528] transition-all z-10"
              onClick={() => scroll(shopScrollRef, 'right')}
            >
              <FaCircleChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Food Items */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start px-4 sm:px-6">
        <h1 className="text-gray-800 text-2xl sm:text-3xl font-semibold">Suggested Food Items</h1>
        <div className="w-full flex flex-wrap gap-6 justify-center">
          {updatedItemsList?.length > 0 ? updatedItemsList.map(item => (
            <FoodCard key={item._id} data={item} />
          )) : (
            <div className="flex flex-col items-center justify-center w-full py-8 gap-6 bg-gradient-to-br from-[#fff5ee] to-[#ffe3d6] rounded-3xl shadow-xl">
              <p className="text-gray-600 text-center text-xl sm:text-2xl font-semibold">No food items found</p>
              <div className="w-96 h-96 bg-white rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden animate-bounce-slow">
                <img src={itemimage} alt="No items" className="w-80 h-80 object-contain" />
              </div>
              <p className="text-gray-400 text-center text-sm sm:text-base">Try selecting a different category or search for another item.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
