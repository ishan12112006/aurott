-- OTT Cafe Seed Data (Amity University Jaipur)
-- All items extracted directly from the physical OTT menu board

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, is_active) VALUES
('cat-breakfast', 'Breakfast', 'breakfast', 'Hot, fresh morning fuel and campus favorites.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80', 1, TRUE),
('cat-shakes', 'Shakes', 'shakes', 'Thick, creamy shakes loaded with flavor and indulgence.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80', 2, TRUE),
('cat-coolers', 'Coolers', 'coolers', 'Chilled mojitos, iced teas, and fizzy refreshments.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80', 3, TRUE),
('cat-bakery', 'Bakery', 'bakery', 'Warm pastries, gooey brownies, waffles and sweet treats.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', 4, TRUE),
('cat-snacks', 'Bite Up Snacks', 'bite-up-snacks', 'Crispy finger foods, seasoned fries, and quick bites.', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80', 5, TRUE),
('cat-pasta', 'Pasta', 'pasta', 'Rich, saucy Italian pastas prepared fresh to order.', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281745?w=600&auto=format&fit=crop&q=80', 6, TRUE),
('cat-burgers', 'Sandwich & Burger', 'sandwich-burger', 'Grilled sandwiches and stacked American-style burgers.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', 7, TRUE),
('cat-rice', 'Rice Combo', 'rice-combo', 'Wholesome hearty combos: biryanis, dal chawal, rajma chawal.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', 8, TRUE),
('cat-chinese', 'Chinese', 'chinese', 'Wok-tossed noodles, fried rice, crispy chilli potato, and manchurian.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80', 9, TRUE),
('cat-rolls', 'Rolls & Burrito', 'rolls-burrito', 'Portable, loaded wraps and burritos wrapped with taste.', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80', 10, TRUE),
('cat-momos', 'Momos', 'momos', 'Steamed, fried, paneer, and crunchy kurkure momos.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80', 11, TRUE),
('cat-hot-bev', 'Hot Beverages', 'hot-beverages', 'Steaming masala chai, brewed coffee, and rich hot chocolate.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80', 12, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- 2. Insert Menu Items
INSERT INTO public.menu_items (id, category_id, name, slug, description, price, secondary_price, image_url, food_type, is_vegetarian, is_available, is_featured, sort_order, portion_note) VALUES
-- HOT BEVERAGES
('item-tea', 'cat-hot-bev', 'Tea', 'tea', 'Freshly brewed aromatic campus masala chai.', 20, 30, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 1, 'Regular ₹20 / Special ₹30'),
('item-hot-coffee', 'cat-hot-bev', 'Hot Coffee', 'hot-coffee', 'Frothy hot coffee brewed to recharge your energy.', 50, NULL, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 2, NULL),
('item-hot-chocolate', 'cat-hot-bev', 'Hot Chocolate', 'hot-chocolate', 'Velvety melted dark cocoa with steamed milk.', 70, NULL, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 3, NULL),
('item-nutella-hot-chocolate', 'cat-hot-bev', 'Nutella Hot Chocolate', 'nutella-hot-chocolate', 'Decadent hot chocolate infused with rich hazelnut Nutella.', 80, NULL, 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 4, NULL),

-- SHAKES
('item-cold-coffee', 'cat-shakes', 'Cold Coffee', 'cold-coffee', 'The iconic Amity student favorite — thick, chilled and chocolate-drizzled.', 90, NULL, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 10, NULL),
('item-irish-cold-coffee', 'cat-shakes', 'Irish Cold Coffee', 'irish-cold-coffee', 'Classic chilled coffee with a smooth aromatic Irish cream twist.', 99, NULL, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 11, NULL),
('item-iced-cappuccino', 'cat-shakes', 'Iced Cappuccino', 'iced-cappuccino', 'Refreshing bold espresso poured over ice and silky milk foam.', 70, NULL, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 12, NULL),
('item-pineapple-shake', 'cat-shakes', 'Pineapple Shake', 'pineapple-shake', 'Tropical sweet pineapple blended with thick chilled cream.', 90, NULL, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 13, NULL),
('item-butterscotch-shake', 'cat-shakes', 'Butterscotch Shake', 'butterscotch-shake', 'Rich buttery caramel crunch shake topped with butterscotch pralines.', 90, NULL, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 14, NULL),
('item-strawberry-shake', 'cat-shakes', 'Strawberry Shake', 'strawberry-shake', 'Vibrant pink shake made with luscious strawberry puree.', 90, NULL, 'https://images.unsplash.com/photo-1553787499-6f9133860278?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 15, NULL),
('item-chocolate-shake', 'cat-shakes', 'Chocolate Shake', 'chocolate-shake', 'Classic velvety chocolate shake with chocolate fudge syrup.', 90, NULL, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 16, NULL),
('item-nutella-shake', 'cat-shakes', 'Nutella Shake', 'nutella-shake', 'Generously loaded with real hazelnut Nutella goodness.', 99, NULL, 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 17, NULL),
('item-oreo-shake', 'cat-shakes', 'Oreo Shake', 'oreo-shake', 'Crunchy crushed Oreo cookies whipped into smooth vanilla cream.', 99, NULL, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 18, NULL),
('item-blueberry-shake', 'cat-shakes', 'Blueberry Shake', 'blueberry-shake', 'Refreshing tart and sweet wild blueberry delight.', 99, NULL, 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 19, NULL),
('item-brownie-shake', 'cat-shakes', 'Brownie Shake', 'brownie-shake', 'Whole fudgy chocolate brownie blended inside thick milk.', 99, NULL, 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 20, NULL),
('item-kit-kat-shake', 'cat-shakes', 'Kit Kat Shake', 'kit-kat-shake', 'Crisp wafer KitKat bars blended and topped with chocolate crumble.', 99, NULL, 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 21, NULL),
('item-chocolate-peanut-butter-shake', 'cat-shakes', 'Chocolate Peanut Butter Shake', 'chocolate-peanut-butter-shake', 'Power-packed roasted peanut butter combined with dark chocolate.', 99, NULL, 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 22, NULL),

-- COOLERS
('item-virgin-mojito', 'cat-coolers', 'Virgin Mojito', 'virgin-mojito', 'Zesty lime, fresh muddled mint leaves, and effervescent soda.', 80, NULL, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 30, NULL),
('item-watermelon-cooler', 'cat-coolers', 'Watermelon Cooler', 'watermelon-cooler', 'Sweet, juicy watermelon juice with a hint of mint and ice.', 80, NULL, 'https://images.unsplash.com/photo-1587888637140-849b25d80ef9?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 31, NULL),
('item-blueberry-mojito', 'cat-coolers', 'Blueberry Mojito', 'blueberry-mojito', 'Fruity berry burst with cooling mint and sparkling water.', 80, NULL, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 32, NULL),
('item-blue-lagoon-cooler', 'cat-coolers', 'Blue Lagoon Cooler', 'blue-lagoon-cooler', 'Tropical citrus curaçao flavor with an eye-catching ocean blue color.', 80, NULL, 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 33, NULL),
('item-green-apple-cooler', 'cat-coolers', 'Green Apple Cooler', 'green-apple-cooler', 'Crisp, tangy green apple refreshment with chilled bubbles.', 80, NULL, 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 34, NULL),
('item-crazy-mango-cooler', 'cat-coolers', 'Crazy Mango Cooler', 'crazy-mango-cooler', 'Bold mango puree sparked with spices and chilled soda.', 80, NULL, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 35, NULL),
('item-lemon-ice-tea', 'cat-coolers', 'Lemon Ice Tea', 'lemon-ice-tea', 'Brewed black tea infused with sunny lemons and chilled over ice.', 80, NULL, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 36, NULL),
('item-peach-ice-tea', 'cat-coolers', 'Peach Ice Tea', 'peach-ice-tea', 'Smooth summer peach infused iced tea with gentle sweetness.', 80, NULL, 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 37, NULL),
('item-lemonade', 'cat-coolers', 'Lemonade', 'lemonade', 'Classic sweet and salty nimbu pani to beat the heat.', 60, NULL, 'https://images.unsplash.com/photo-1523677068643-490b97779d71?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 38, NULL),

-- BAKERY
('item-truffle-pastry', 'cat-bakery', 'Truffle Pastry', 'truffle-pastry', 'Decadent multi-layered Belgian chocolate ganache pastry.', 80, NULL, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 40, NULL),
('item-hot-brownie', 'cat-bakery', 'Hot Brownie', 'hot-brownie', 'Sizzling warm dark chocolate brownie baked fresh.', 80, NULL, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 41, NULL),
('item-brownie-with-ice-cream', 'cat-bakery', 'Brownie with Ice Cream', 'brownie-with-ice-cream', 'Warm fudgy brownie served with a scoop of creamy vanilla ice cream.', 99, NULL, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 42, NULL),
('item-chocolate-waffle', 'cat-bakery', 'Chocolate Waffle', 'chocolate-waffle', 'Golden crispy Belgian waffle smothered in molten milk chocolate sauce.', 99, NULL, 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 43, NULL),
('item-nutella-waffle', 'cat-bakery', 'Nutella Waffle', 'nutella-waffle', 'Fresh waffle generously coated in hazelnut Nutella spread.', 99, NULL, 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 44, NULL),

-- BREAKFAST
('item-aloo-parantha', 'cat-breakfast', 'Aloo Parantha', 'aloo-parantha', 'Stuffed spiced potato flatbread crisped golden with butter.', 50, NULL, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 50, NULL),
('item-paneer-parantha', 'cat-breakfast', 'Paneer Parantha', 'paneer-parantha', 'Generously stuffed fresh grated cottage cheese flatbread.', 70, NULL, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 51, NULL),
('item-paneer-bread-pakoda', 'cat-breakfast', 'Paneer Bread Pakoda', 'paneer-bread-pakoda', 'Crispy batter-fried bread stuffed with seasoned paneer slice.', 50, NULL, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 52, NULL),
('item-vada-pav', 'cat-breakfast', 'Vada Pav', 'vada-pav', 'Mumbai style batata vada inside soft pav with garlic chutney.', 30, NULL, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 53, NULL),
('item-poha', 'cat-breakfast', 'Poha', 'poha', 'Light flattened rice tempered with mustard, peanuts, and lemon.', 60, NULL, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 54, NULL),
('item-bread-butter-toast', 'cat-breakfast', 'Bread Butter Toast', 'bread-butter-toast', 'Crisp golden toasted bread slices with creamy butter.', 30, NULL, 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 55, NULL),
('item-paneer-chilla', 'cat-breakfast', 'Paneer Chilla', 'paneer-chilla', 'Nutritious besan pancake stuffed with grated paneer and herbs.', 80, NULL, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 56, NULL),
('item-chole-bhature', 'cat-breakfast', 'Chole Bhature', 'chole-bhature', 'Fluffy fried bhature served with rich Delhi-style spicy chickpea curry.', 90, NULL, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 57, NULL),
('item-puri-aloo-sabzi', 'cat-breakfast', 'Puri Aloo Sabzi (6pcs)', 'puri-aloo-sabzi-6pcs', '6 hot crispy puris accompanied by spicy halwai-style potato curry.', 70, NULL, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 58, '6 pcs'),
('item-idli-sambhar', 'cat-breakfast', 'Idli Sambhar', 'idli-sambhar', 'Steamed fluffy rice cakes served with hot lentil sambhar and chutney.', 80, NULL, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 59, NULL),
('item-fried-idli', 'cat-breakfast', 'Fried Idli', 'fried-idli', 'Crispy pan-tossed idlis seasoned with mustard seeds and curry leaves.', 80, NULL, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 60, NULL),
('item-tadka-vegetable-maggie', 'cat-breakfast', 'Tadka Vegetable Maggie', 'tadka-vegetable-maggie', 'Hostel lifeline! Spicy Maggi noodles stir-fried with diced veggies and tadka.', 70, NULL, 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 61, NULL),
('item-macroni-with-pav', 'cat-breakfast', 'Macroni with Pav', 'macroni-with-pav', 'Desi spiced masala macaroni served alongside butter-toasted pav.', 99, NULL, 'https://images.unsplash.com/photo-1621996346565-e3d5d6281745?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 62, NULL),
('item-egg-bhurji-with-pav', 'cat-breakfast', 'Egg Bhurji with Pav', 'egg-bhurji-with-pav', 'Scrambled eggs cooked with onions, green chillies, and served with pav.', 99, NULL, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80', 'egg', FALSE, TRUE, FALSE, 63, NULL),
('item-paneer-bhurji-with-pav', 'cat-breakfast', 'Paneer Bhurji with Pav', 'paneer-bhurji-with-pav', 'Crumbled cottage cheese sautéed with spiced tomatoes and pav.', 99, NULL, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 64, NULL),

-- BITE UP SNACKS
('item-salted-fries', 'cat-snacks', 'Salted Fries', 'salted-fries', 'Golden crispy potato fingers tossed lightly in sea salt.', 80, NULL, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 70, NULL),
('item-peri-peri-fries', 'cat-snacks', 'Peri Peri Fries', 'peri-peri-fries', 'Crispy hot fries dusted with zesty African bird’s eye chili peri peri spice.', 90, NULL, 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 71, NULL),
('item-cheesy-fries-extra', 'cat-snacks', 'Cheesy Fries Extra', 'cheesy-fries-extra', 'Warm melted cheese sauce poured generously over seasoned fries.', 50, NULL, 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 72, NULL),
('item-potato-wedges', 'cat-snacks', 'Potato Wedges', 'potato-wedges', 'Thick cut herb-crusted potato wedges fried till golden crunch.', 80, NULL, 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 73, NULL),
('item-onion-rings', 'cat-snacks', 'Onion Rings', 'onion-rings', 'Batter-dipped sliced onion rings fried crisp and crunchy.', 80, NULL, 'https://images.unsplash.com/photo-1639024471287-03521673892a?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 74, NULL),
('item-paneer-popcorn', 'cat-snacks', 'Paneer Popcorn', 'paneer-popcorn', 'Bite-sized crispy spiced paneer nuggets served with dip.', 99, NULL, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 75, NULL),
('item-aloo-chole-chaat', 'cat-snacks', 'Aloo Chole Chaat', 'aloo-chole-chaat', 'Tangy street-style spiced potatoes and chickpeas with mint and tamarind chutneys.', 90, NULL, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 76, NULL),

-- PASTA
('item-red-sauce-pasta', 'cat-pasta', 'Red Sauce Pasta', 'red-sauce-pasta', 'Penne tossed in spicy garlic tomato arrabbiata sauce with Italian herbs.', 99, NULL, 'https://images.unsplash.com/photo-1621996346565-e3d5d6281745?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 80, NULL),
('item-white-sauce-pasta', 'cat-pasta', 'White Sauce Pasta', 'white-sauce-pasta', 'Creamy Alfredo pasta loaded with cheese, sweet corn, and bell peppers.', 99, NULL, 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 81, NULL),
('item-pink-sauce-pasta', 'cat-pasta', 'Pink Sauce Pasta', 'pink-sauce-pasta', 'The best of both worlds: creamy alfredo meets tangy arrabbiata sauce.', 99, NULL, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 82, NULL),
('item-mac-n-cheese', 'cat-pasta', 'Mac n Cheese', 'mac-n-cheese', 'Elbow macaroni baked in rich melted cheddar cheese sauce.', 99, NULL, 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 83, NULL),

-- SANDWICH & BURGER
('item-aloo-grilled-sandwich', 'cat-burgers', 'Aloo Grilled Sandwich', 'aloo-grilled-sandwich', 'Crisp pressed sandwich stuffed with savory spiced aloo masala.', 70, NULL, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 90, NULL),
('item-veg-grilled-sandwich', 'cat-burgers', 'Veg Grilled Sandwich', 'veg-grilled-sandwich', 'Crisp grilled bread filled with cucumber, tomatoes, onions and green chutney.', 80, NULL, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 91, NULL),
('item-cheese-grilled-sandwich', 'cat-burgers', 'Cheese Grilled Sandwich', 'cheese-grilled-sandwich', 'Gooey melted mozzarella and cheddar cheese toasted to perfection.', 90, NULL, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 92, NULL),
('item-extra-paneer', 'cat-burgers', 'Extra Paneer Add-on', 'extra-paneer', 'Add a thick slice of fresh spiced cottage cheese to any sandwich or burger.', 30, NULL, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 93, NULL),
('item-corn-cheese-sandwich', 'cat-burgers', 'Corn Cheese Sandwich', 'corn-cheese-sandwich', 'Sweet American corn tossed with creamy melted cheese inside grilled bread.', 99, NULL, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 94, NULL),
('item-classic-american-potato-burger', 'cat-burgers', 'Classic American Potato Burger', 'classic-american-potato-burger', 'Crisp seasoned potato patty, lettuce, tomatoes, and burger mayo sauce.', 80, NULL, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 95, NULL),
('item-classic-american-paneer-burger', 'cat-burgers', 'Classic American Paneer Burger', 'classic-american-paneer-burger', 'Thick marinated cottage cheese steak crisped and stacked with veggies.', 90, NULL, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 96, NULL),
('item-classic-american-cheese-burger', 'cat-burgers', 'Classic American Cheese Burger', 'classic-american-cheese-burger', 'Juicy patty topped with double cheese slice, pickles, and dressing.', 99, NULL, 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 97, NULL),
('item-ott-cheese-melt-burger', 'cat-burgers', 'OTT Cheese Melt Burger', 'ott-cheese-melt-burger', 'Signature cafe special! Overflowing molten cheese sauce over a premium patty.', 99, NULL, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 98, NULL),

-- RICE COMBO
('item-veg-dum-biryani', 'cat-rice', 'Veg Dum Biryani', 'veg-dum-biryani', 'Fragrant basmati rice slow-cooked with fresh garden vegetables and saffron.', 80, NULL, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 110, NULL),
('item-paneer-dum-biryani', 'cat-rice', 'Paneer Dum Biryani', 'paneer-dum-biryani', 'Aromatic dum biryani studded with tender roasted cottage cheese cubes.', 99, NULL, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 111, NULL),
('item-egg-dum-biryani', 'cat-rice', 'Egg Dum Biryani', 'egg-dum-biryani', 'Slow-cooked spiced biryani rice served with golden fried boiled eggs.', 99, NULL, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80', 'egg', FALSE, TRUE, FALSE, 112, NULL),
('item-dal-chawal', 'cat-rice', 'Dal Chawal', 'dal-chawal', 'Yellow dal tadka served with steamed basmati rice.', 80, NULL, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 113, NULL),
('item-kadhi-chawal', 'cat-rice', 'Kadhi Chawal', 'kadhi-chawal', 'Tangy Punjabi pakoda yogurt kadhi with cumin steamed rice.', 80, NULL, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 114, NULL),
('item-rajma-chawal', 'cat-rice', 'Rajma Chawal', 'rajma-chawal', 'Slow-simmered rich North Indian red kidney bean curry with fragrant rice.', 80, NULL, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 115, NULL),
('item-chole-chawal', 'cat-rice', 'Chole Chawal', 'chole-chawal', 'Spiced Amritsari chickpea gravy served with fluffy white rice.', 80, NULL, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 116, NULL),
('item-butter-paneer-gravy-jeera-rice', 'cat-rice', 'Butter Paneer Gravy with Jeera Rice', 'butter-paneer-gravy-with-jeera-rice', 'Velvety makhani butter paneer gravy paired with fragrant cumin jeera rice.', 99, NULL, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 117, NULL),
('item-kadhai-paneer-gravy-rice', 'cat-rice', 'Kadhai Paneer Gravy with Rice', 'kadhai-paneer-gravy-with-rice', 'Spicy wok-tossed bell peppers and cottage cheese with steamed rice.', 99, NULL, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 118, NULL),
('item-anda-curry-with-rice', 'cat-rice', 'Anda Curry (2) with Rice', 'anda-curry-2-with-rice', 'Two boiled eggs simmered in rich spicy onion-tomato curry served with rice.', 99, NULL, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80', 'egg', FALSE, TRUE, FALSE, 119, '2 Eggs'),

-- CHINESE
('item-crispy-corn', 'cat-chinese', 'Crispy Corn', 'crispy-corn', 'Batter-fried sweet corn tossed with spring onions, pepper, and schezwan sauce.', 99, NULL, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 130, NULL),
('item-honey-chilli-potato', 'cat-chinese', 'Honey Chilli Potato', 'honey-chilli-potato', 'Crisp potato fingers glazed in sticky honey, chili sauce, and sesame seeds.', 99, NULL, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 131, NULL),
('item-chilli-garlic-noodle', 'cat-chinese', 'Chilli Garlic Noodle', 'chilli-garlic-noodle', 'Spicy noodles tossed with burnt garlic, red chilies, and julienned vegetables.', 90, NULL, 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 132, NULL),
('item-hakka-noodle', 'cat-chinese', 'Hakka Noodle', 'hakka-noodle', 'Classic wok-tossed noodles with crunchy cabbage, capsicum, and soya sauce.', 90, NULL, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 133, NULL),
('item-chowmein', 'cat-chinese', 'Chowmein', 'chowmein', 'Desi style wok tossed street chowmein (Extra egg +₹20).', 90, NULL, 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 134, 'Extra Egg +₹20'),
('item-manchurian', 'cat-chinese', 'Manchurian (Dry / Gravy)', 'manchurian-dry-gravy', 'Vegetable dumplings tossed in dark soya garlic sauce. Choose dry or gravy.', 90, NULL, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 135, NULL),
('item-fried-rice', 'cat-chinese', 'Fried Rice', 'fried-rice', 'Wok-tossed basmati rice with spring onions and oriental seasoning (Extra egg +₹20).', 90, NULL, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 136, 'Extra Egg +₹20'),

-- ROLLS & BURRITO
('item-ott-veg-burrito', 'cat-rolls', 'OTT Veg Burrito', 'ott-veg-burrito', 'Warm tortilla stuffed with Mexican rice, beans, salsa, and crunchy veggies.', 80, NULL, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 150, NULL),
('item-ott-egg-burrito', 'cat-rolls', 'OTT Egg Burrito', 'ott-egg-burrito', 'Fluffy scrambled egg, spicy salsa, and cheese wrapped in a toasted tortilla.', 99, NULL, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=80', 'egg', FALSE, TRUE, FALSE, 151, NULL),
('item-ott-paneer-burrito', 'cat-rolls', 'OTT Paneer Burrito', 'ott-paneer-burrito', 'Spiced paneer chunks, salsa, and creamy dressing rolled inside soft tortilla.', 99, NULL, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 152, NULL),
('item-ott-veg-roll', 'cat-rolls', 'OTT Veg Roll', 'ott-veg-roll', 'Crispy flaky paratha wrapped with tangy vegetable masala and mint mayo.', 70, NULL, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 153, NULL),
('item-ott-egg-roll', 'cat-rolls', 'OTT Egg Roll', 'ott-egg-roll', 'Layered paratha lined with double egg omelette, sliced onions, and green chilies.', 90, NULL, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80', 'egg', FALSE, TRUE, FALSE, 154, NULL),
('item-ott-healthy-paneer-roll', 'cat-rolls', 'OTT Healthy Paneer Roll', 'ott-healthy-paneer-roll', 'Grilled protein-rich paneer chunks tossed with bell peppers and wrapped wholesome.', 99, NULL, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 155, NULL),

-- MOMOS
('item-steam-momos-8pcs', 'cat-momos', 'Steam Momos (8 pcs)', 'steam-momos-8-pcs', '8 delicate steamed vegetable dumplings served with spicy garlic red chutney.', 80, NULL, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 170, '8 pcs'),
('item-fried-momos-8pcs', 'cat-momos', 'Fried Momos (8 pcs)', 'fried-momos-8-pcs', '8 deep-fried crunchy golden momos with hot red chutney and creamy mayo.', 90, NULL, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, FALSE, 171, '8 pcs'),
('item-paneer-momos-8pcs', 'cat-momos', 'Paneer Momos (8 pcs)', 'paneer-momos-8-pcs', '8 steamed momos stuffed with juicy grated paneer, onion, and herbs.', 90, NULL, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 172, '8 pcs'),
('item-kurkure-momos-6pcs', 'cat-momos', 'Kurkure Momos (6 pcs)', 'kurkure-momos-6-pcs', '6 super-crunchy cornflake-crusted deep-fried momos. Extremely crisp!', 99, NULL, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80', 'veg', TRUE, TRUE, TRUE, 173, '6 pcs')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  price = EXCLUDED.price,
  is_available = EXCLUDED.is_available,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order;

-- 3. Default Cafe Settings
INSERT INTO public.cafe_settings (id, cafe_name, tagline, campus, location_address, phone, email, instagram, opening_hours, upi_id, pickup_instructions, is_accepting_orders)
VALUES (
  1,
  'OTT Cafe',
  'Good Food. Good Vibes. Campus Life.',
  'Amity University Jaipur',
  'Amity University Jaipur Campus, Kant Kalwar, NH-11C, Jaipur, Rajasthan 303002',
  '+91 98765 43210',
  'ottcafe.amity@gmail.com',
  '@ottcafe.amity',
  '9:00 AM – 10:00 PM (Mon – Sun)',
  'ottcafe@upi',
  'Pick up your order fresh and hot at the OTT Cafe counter inside campus.',
  TRUE
) ON CONFLICT (id) DO NOTHING;
