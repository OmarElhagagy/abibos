import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { products, categories } from '../services/api';
import ProductCard from '../components/ProductCard';

// Sample product data for fallback
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    productName: "Classic T-Shirt",
    brand: "Fashion Brand",
    price: 24.99,
    color: "Black",
    size: "M",
    description: "A comfortable classic t-shirt",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 2,
    productName: "Slim Fit Jeans",
    brand: "Denim Co",
    price: 49.99,
    color: "Blue",
    size: "M",
    description: "Premium quality slim fit jeans",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 3,
    productName: "Casual Sneakers",
    brand: "Step Style",
    price: 59.99,
    color: "White",
    size: "L",
    description: "Comfortable casual sneakers for everyday wear",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 4,
    productName: "Hooded Sweatshirt",
    brand: "Urban Wear",
    price: 39.99,
    color: "Gray",
    size: "L",
    description: "Warm and comfortable hooded sweatshirt",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 5,
    productName: "Summer Dress",
    brand: "Elle",
    price: 64.99,
    color: "Floral",
    size: "S",
    description: "Light and elegant summer dress",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 6,
    productName: "Leather Wallet",
    brand: "Accessorize",
    price: 29.99,
    color: "Brown",
    size: "One Size",
    description: "Genuine leather wallet with multiple card slots",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 7,
    productName: "Graphic T-Shirt",
    brand: "Urban Wear",
    price: 27.99,
    color: "Red",
    size: "L",
    description: "Bold graphic design t-shirt",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 8,
    productName: "Summer Shorts",
    brand: "Fashion Brand",
    price: 34.99,
    color: "Khaki",
    size: "M",
    description: "Comfortable cotton shorts for summer",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 9,
    productName: "Formal Shirt",
    brand: "Business Co",
    price: 54.99,
    color: "White",
    size: "XL",
    description: "Premium business formal shirt",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 10,
    productName: "Hiking Boots",
    brand: "Step Style",
    price: 89.99,
    color: "Brown",
    size: "L",
    description: "Durable waterproof hiking boots",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 11,
    productName: "Denim Jacket",
    brand: "Denim Co",
    price: 79.99,
    color: "Blue",
    size: "S",
    description: "Classic denim jacket for all seasons",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 12,
    productName: "Athletic Leggings",
    brand: "SportFit",
    price: 39.99,
    color: "Black",
    size: "M",
    description: "High-performance athletic leggings",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1506902540976-5d4b24e5e2f8?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 13,
    productName: "Leather Belt",
    brand: "Accessorize",
    price: 24.99,
    color: "Black",
    size: "One Size",
    description: "Classic leather belt with metal buckle",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60ae30b?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 14,
    productName: "Wool Sweater",
    brand: "Winter Wear",
    price: 69.99,
    color: "Navy",
    size: "L",
    description: "Warm wool sweater for cold weather",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 15,
    productName: "Silk Scarf",
    brand: "Accessorize",
    price: 19.99,
    color: "Multicolor",
    size: "One Size",
    description: "Elegant silk scarf with printed pattern",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1601924921557-45e6dea0a157?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 16,
    productName: "Baseball Cap",
    brand: "Urban Wear",
    price: 19.99,
    color: "Black",
    size: "One Size",
    description: "Classic baseball cap with embroidered logo",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 17,
    productName: "Evening Gown",
    brand: "Elle",
    price: 129.99,
    color: "Red",
    size: "XS",
    description: "Elegant evening gown for special occasions",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 18,
    productName: "Running Shoes",
    brand: "SportFit",
    price: 79.99,
    color: "Blue",
    size: "M",
    description: "Lightweight running shoes with cushioned sole",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 19,
    productName: "Wool Coat",
    brand: "Winter Wear",
    price: 149.99,
    color: "Gray",
    size: "XL",
    description: "Premium wool coat for winter",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 20,
    productName: "Sunglasses",
    brand: "Accessorize",
    price: 45.99,
    color: "Black",
    size: "One Size",
    description: "UV protection stylish sunglasses",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 21,
    productName: "Leather Backpack",
    brand: "Accessorize",
    price: 89.99,
    color: "Brown",
    size: "One Size",
    description: "Stylish and durable leather backpack",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 22,
    productName: "Beach Shorts",
    brand: "Summer Vibes",
    price: 29.99,
    color: "Blue",
    size: "M",
    description: "Quick-dry beach shorts with pattern",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1565487623262-485063e4cac5?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 23,
    productName: "Linen Shirt",
    brand: "Summer Vibes",
    price: 44.99,
    color: "White",
    size: "L",
    description: "Breathable linen shirt for summer",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 24,
    productName: "Puffer Jacket",
    brand: "Winter Wear",
    price: 109.99,
    color: "Black",
    size: "M",
    description: "Insulated puffer jacket for extreme cold",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 25,
    productName: "Pendant Necklace",
    brand: "Accessorize",
    price: 35.99,
    color: "Silver",
    size: "One Size",
    description: "Elegant pendant necklace",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 26,
    productName: "Leather Gloves",
    brand: "Winter Wear",
    price: 49.99,
    color: "Black",
    size: "M",
    description: "Warm leather gloves with touch screen capability",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1608540764211-d7fca0austxp?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 27,
    productName: "Wide Brim Hat",
    brand: "Summer Vibes",
    price: 32.99,
    color: "Beige",
    size: "One Size",
    description: "Stylish wide brim hat for sun protection",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 28,
    productName: "Canvas Sneakers",
    brand: "Step Style",
    price: 39.99,
    color: "Red",
    size: "M",
    description: "Classic canvas sneakers for casual wear",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1579338908476-3a3a1d71a706?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 29,
    productName: "Cashmere Scarf",
    brand: "Winter Wear",
    price: 59.99,
    color: "Gray",
    size: "One Size",
    description: "Luxurious cashmere scarf for winter",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1584807420143-8eec2be6214c?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 30,
    productName: "Silk Blouse",
    brand: "Elle",
    price: 69.99,
    color: "Pink",
    size: "S",
    description: "Elegant silk blouse for professional wear",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1651238029038-2332c888dced?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 31,
    productName: "Cargo Pants",
    brand: "Urban Wear",
    price: 54.99,
    color: "Olive",
    size: "M",
    description: "Functional cargo pants with multiple pockets",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1517445312882-bc9910d018b2?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 32,
    productName: "Knit Beanie",
    brand: "Winter Wear",
    price: 19.99,
    color: "Blue",
    size: "One Size",
    description: "Warm knit beanie for winter",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&auto=format", isPrimary: true}]
  },
  // Adding more products to have a LOT from each category
  // Men's Category
  {
    id: 33,
    productName: "Slim Fit Dress Shirt",
    brand: "Business Co",
    price: 59.99,
    color: "Light Blue",
    size: "M",
    description: "Premium slim fit dress shirt for business attire",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 34,
    productName: "Classic Blazer",
    brand: "Business Co",
    price: 129.99,
    color: "Navy",
    size: "L",
    description: "Timeless navy blazer for formal occasions",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 35,
    productName: "Chino Pants",
    brand: "Fashion Brand",
    price: 45.99,
    color: "Beige",
    size: "M",
    description: "Versatile chino pants for casual or smart-casual looks",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 36,
    productName: "Oxford Button-Down",
    brand: "Business Co",
    price: 49.99,
    color: "White",
    size: "L",
    description: "Classic Oxford button-down shirt",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 37,
    productName: "Henley Shirt",
    brand: "Urban Wear",
    price: 34.99,
    color: "Burgundy",
    size: "M",
    description: "Comfortable long sleeve henley shirt",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1552831388-6a0b3575b32a?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 38,
    productName: "Fleece Joggers",
    brand: "SportFit",
    price: 39.99,
    color: "Gray",
    size: "L",
    description: "Comfortable fleece joggers for lounging",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 39,
    productName: "Quilted Vest",
    brand: "Winter Wear",
    price: 69.99,
    color: "Black",
    size: "M",
    description: "Lightweight quilted vest for layering",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 40,
    productName: "Polo Shirt",
    brand: "Fashion Brand",
    price: 29.99,
    color: "Navy",
    size: "XL",
    description: "Classic polo shirt with embroidered logo",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&auto=format", isPrimary: true}]
  },
  // Women's Category
  {
    id: 41,
    productName: "Wrap Dress",
    brand: "Elle",
    price: 79.99,
    color: "Green",
    size: "S",
    description: "Elegant wrap dress for professional or evening wear",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 42,
    productName: "Cardigan Sweater",
    brand: "Elle",
    price: 49.99,
    color: "Cream",
    size: "M",
    description: "Soft knit cardigan sweater",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 43,
    productName: "Midi Skirt",
    brand: "Elle",
    price: 54.99,
    color: "Black",
    size: "XS",
    description: "Versatile midi skirt for office or casual wear",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 44,
    productName: "Blouse with Bow",
    brand: "Elle",
    price: 59.99,
    color: "White",
    size: "S",
    description: "Elegant blouse with bow detail",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1552663958-89f4dbf1d91f?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 45,
    productName: "High-Waisted Jeans",
    brand: "Denim Co",
    price: 59.99,
    color: "Dark Blue",
    size: "M",
    description: "Flattering high-waisted jeans",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 46,
    productName: "Maxi Dress",
    brand: "Summer Vibes",
    price: 69.99,
    color: "Blue",
    size: "M",
    description: "Flowing maxi dress for summer occasions",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 47,
    productName: "Yoga Pants",
    brand: "SportFit",
    price: 44.99,
    color: "Black",
    size: "S",
    description: "High-performance yoga pants with pockets",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 48,
    productName: "Peplum Top",
    brand: "Elle",
    price: 39.99,
    color: "Rose",
    size: "XS",
    description: "Flattering peplum top for formal occasions",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1559734841-ded2538ad6ee?w=500&auto=format", isPrimary: true}]
  },
  // Accessories Category
  {
    id: 49,
    productName: "Leather Crossbody Bag",
    brand: "Accessorize",
    price: 79.99,
    color: "Tan",
    size: "One Size",
    description: "Versatile leather crossbody bag",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1591561954555-607968c989ab?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 50,
    productName: "Gold Hoop Earrings",
    brand: "Accessorize",
    price: 29.99,
    color: "Gold",
    size: "One Size",
    description: "Classic gold hoop earrings",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 51,
    productName: "Leather Watch",
    brand: "Accessorize",
    price: 99.99,
    color: "Brown",
    size: "One Size",
    description: "Classic leather watch with analog face",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 52,
    productName: "Woven Tote Bag",
    brand: "Accessorize",
    price: 49.99,
    color: "Natural",
    size: "One Size",
    description: "Spacious woven tote bag for beach or shopping",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 53,
    productName: "Beaded Bracelet Set",
    brand: "Accessorize",
    price: 24.99,
    color: "Mixed",
    size: "One Size",
    description: "Set of 3 beaded bracelets",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 54,
    productName: "Patterned Scarf",
    brand: "Accessorize",
    price: 29.99,
    color: "Blue",
    size: "One Size",
    description: "Lightweight patterned scarf for all seasons",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 55,
    productName: "Aviator Sunglasses",
    brand: "Accessorize",
    price: 59.99,
    color: "Silver",
    size: "One Size",
    description: "Classic aviator sunglasses with UV protection",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 56,
    productName: "Leather Gloves",
    brand: "Winter Wear",
    price: 49.99,
    color: "Black",
    size: "S",
    description: "Elegant leather gloves with cashmere lining",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1584374943049-a61d91debb8a?w=500&auto=format", isPrimary: true}]
  },
  // More Men's Category
  {
    id: 57,
    productName: "Striped Rugby Shirt",
    brand: "Fashion Brand",
    price: 45.99,
    color: "Navy/Red",
    size: "L",
    description: "Classic striped rugby shirt",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 58,
    productName: "V-Neck Sweater",
    brand: "Winter Wear",
    price: 54.99,
    color: "Burgundy",
    size: "XL",
    description: "Classic V-neck sweater for layering",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 59,
    productName: "Military Jacket",
    brand: "Urban Wear",
    price: 89.99,
    color: "Olive",
    size: "M",
    description: "Stylish military-inspired jacket",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1536766768598-e09213fdcf22?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 60,
    productName: "Basketball Shorts",
    brand: "SportFit",
    price: 34.99,
    color: "Black",
    size: "L",
    description: "Performance basketball shorts with pockets",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1562187193-30aa6f72a398?w=500&auto=format", isPrimary: true}]
  },
  // More Women's Category
  {
    id: 61,
    productName: "Off-Shoulder Blouse",
    brand: "Elle",
    price: 49.99,
    color: "White",
    size: "XS",
    description: "Elegant off-shoulder blouse for summer",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1602573091675-813b5952857c?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 62,
    productName: "Pleated Midi Skirt",
    brand: "Elle",
    price: 64.99,
    color: "Pink",
    size: "S",
    description: "Elegant pleated midi skirt for formal occasions",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 63,
    productName: "Lace Detail Top",
    brand: "Elle",
    price: 39.99,
    color: "Cream",
    size: "M",
    description: "Delicate top with lace detail",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=500&auto=format", isPrimary: true}]
  },
  {
    id: 64,
    productName: "Denim Overalls",
    brand: "Denim Co",
    price: 79.99,
    color: "Light Blue",
    size: "S",
    description: "Casual denim overalls for weekend style",
    isActive: true,
    images: [{imageUrl: "https://images.unsplash.com/photo-1548864789-7b0d31045538?w=500&auto=format", isPrimary: true}]
  }
];

// Sample category data for fallback
const SAMPLE_CATEGORIES = [
  { id: 1, name: "Men", description: "Men's clothing" },
  { id: 2, name: "Women", description: "Women's clothing" },
  { id: 3, name: "Accessories", description: "Fashion accessories" }
];

// Available sizes for clothing
const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductsPage = ({ addToCart }) => {
  const [searchParams] = useSearchParams();
  const { categoryName } = useParams();
  const [productList, setProductList] = useState(SAMPLE_PRODUCTS);  // Initialize with sample data
  const [categoryList, setCategoryList] = useState(SAMPLE_CATEGORIES);  // Initialize with sample data
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'latest');
  
  // Available filter options derived from products
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Attempt to fetch real data, but fall back to sample data if anything fails
      try {
        // Fetch categories
        try {
          const categoriesResponse = await categories.getAll();
          if (categoriesResponse.data && categoriesResponse.data.length > 0) {
            setCategoryList(categoriesResponse.data);
          }
        } catch (err) {
          console.log('Using sample category data:', err);
        }
        
        // Determine what products to fetch
        const searchQuery = searchParams.get('search');
        let categoryId = null;
        
        // Handle category from URL parameter
        if (categoryName) {
          const category = categoryList.find(
            c => c.name.toLowerCase() === categoryName.toLowerCase()
          );
          if (category) {
            categoryId = category.id;
            setSelectedCategory(category.id.toString());
          }
        }
        
        // Try to fetch products based on parameters
        let fetchedProducts = [];
        
        try {
          let productsResponse;
          if (searchQuery) {
            productsResponse = await products.search(searchQuery);
          } else if (categoryId) {
            productsResponse = await products.getByCategory(categoryId);
          } else {
            productsResponse = await products.getAll();
          }
          
          if (productsResponse.data && productsResponse.data.length > 0) {
            fetchedProducts = productsResponse.data;
            setProductList(fetchedProducts);
          }
        } catch (err) {
          console.log('Using sample product data:', err);
          
          // Filter sample products if we have a category name
          if (categoryName) {
            const categoryProducts = filterSampleProductsByCategory(categoryName);
            setProductList(categoryProducts);
          } else if (searchQuery) {
            const searchResults = SAMPLE_PRODUCTS.filter(p => 
              p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setProductList(searchResults.length > 0 ? searchResults : SAMPLE_PRODUCTS);
          }
        }
        
        // Extract available filter options
        const productsToUse = productList.length > 0 ? productList : SAMPLE_PRODUCTS;
        const brands = [...new Set(productsToUse.map(p => p.brand))];
        const colors = [...new Set(productsToUse.map(p => p.color))];
        
        setAvailableBrands(brands);
        setAvailableColors(colors);
      } catch (err) {
        console.error('Error in data fetching flow:', err);
        // We're already using sample data as fallback
      }
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [searchParams, categoryName, categoryList]);

  const filterSampleProductsByCategory = (category) => {
    const catName = category.toLowerCase();
    if (catName === 'men') {
      return SAMPLE_PRODUCTS.filter(p => 
        !p.productName.includes('Dress') && 
        !p.productName.includes('Gown') && 
        !p.productName.includes('Leggings')
      );
    } else if (catName === 'women') {
      return SAMPLE_PRODUCTS.filter(p => 
        p.productName.includes('Dress') || 
        p.productName.includes('Gown') || 
        p.productName.includes('Leggings') ||
        p.brand === 'Elle'
      );
    } else if (catName === 'accessories') {
      return SAMPLE_PRODUCTS.filter(p => 
        p.productName.includes('Wallet') || 
        p.productName.includes('Belt') || 
        p.productName.includes('Scarf') ||
        p.productName.includes('Cap') ||
        p.productName.includes('Sunglasses')
      );
    }
    return SAMPLE_PRODUCTS;
  };

  // Apply filters and sorting to products
  const filteredProducts = productList.filter(product => {
    // Apply category filter
    if (selectedCategory && categoryName) {
      // Already filtered by URL parameter
      return true;
    } else if (selectedCategory && !product.categories?.some(cat => cat.id.toString() === selectedCategory)) {
      const category = categoryList.find(c => c.id.toString() === selectedCategory);
      if (category) {
        const filteredProducts = filterSampleProductsByCategory(category.name);
        if (!filteredProducts.some(p => p.id === product.id)) {
          return false;
        }
      } else {
        return false;
      }
    }
    
    // Apply brand filter
    if (selectedBrand && product.brand !== selectedBrand) {
      return false;
    }
    
    // Apply color filter
    if (selectedColor && product.color !== selectedColor) {
      return false;
    }
    
    // Apply size filter
    if (selectedSize && product.size !== selectedSize) {
      return false;
    }
    
    // Apply price range filter
    if (priceRange.min && product.price < parseFloat(priceRange.min)) {
      return false;
    }
    
    if (priceRange.max && product.price > parseFloat(priceRange.max)) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'latest':
        // Since we don't have actual dates, sort by ID (higher ID = newer)
        return b.id - a.id;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      {/* Filters Sidebar */}
      <div className="col-md-3 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">Filters</h5>
            
            {/* Category Filter */}
            <div className="mb-4">
              <label className="form-label fw-bold">Category</label>
              <select 
                className="form-select" 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categoryList.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Brand Filter */}
            <div className="mb-4">
              <label className="form-label fw-bold">Brand</label>
              <select 
                className="form-select" 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {availableBrands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Color Filter */}
            <div className="mb-4">
              <label className="form-label fw-bold">Color</label>
              <select 
                className="form-select" 
                value={selectedColor} 
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <option value="">All Colors</option>
                {availableColors.map(color => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Size Filter */}
            <div className="mb-4">
              <label className="form-label fw-bold">Size</label>
              <select 
                className="form-select" 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">All Sizes</option>
                {CLOTHING_SIZES.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
                <option value="One Size">One Size</option>
              </select>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-4">
              <label className="form-label fw-bold">Price Range</label>
              <div className="d-flex align-items-center">
                <input 
                  type="number" 
                  className="form-control me-2" 
                  placeholder="Min" 
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <span className="mx-1">-</span>
                <input 
                  type="number" 
                  className="form-control ms-2" 
                  placeholder="Max" 
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
              </div>
            </div>
            
            {/* Reset Filters Button */}
            <button 
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setSelectedCategory('');
                setSelectedBrand('');
                setSelectedColor('');
                setSelectedSize('');
                setPriceRange({ min: '', max: '' });
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="col-md-9">
        {/* Sort Options and Results Count */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="text-muted">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
            </span>
          </div>
          <div className="d-flex align-items-center">
            <label className="me-2">Sort by:</label>
            <select 
              className="form-select form-select-sm" 
              style={{ width: 'auto' }}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="latest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="alert alert-info">
            No products found matching your criteria. Try adjusting your filters.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {sortedProducts.map(product => (
              <div key={product.id} className="col">
                <ProductCard product={product} addToCart={addToCart} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage; 