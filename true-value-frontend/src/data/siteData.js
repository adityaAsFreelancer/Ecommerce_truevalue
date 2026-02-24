export const articles = [
    {
        id: 'a1',
        title: "How to Paint Cabinets Like a Pro",
        category: "Kitchen",
        readTime: "8 min read",
        excerpt: "Learn the secrets to a smooth, durable finish on your kitchen cabinets without the professional price tag.",
        image: "http://localhost:5000/uploads/a1-1771010439149.jpg",
        author: "Sarah J.",
        date: "Jan 12, 2024"
    },
    {
        id: 'a2',
        title: "Spring Gardening 101",
        category: "Gardening",
        readTime: "12 min read",
        excerpt: "Prepare your soil, choose the right seeds, and get your garden ready for a vibrant spring bloom.",
        image: "http://localhost:5000/uploads/a2-1771010439726.jpg",
        author: "Mike D.",
        date: "Feb 05, 2024"
    },
    {
        id: 'a3',
        title: "Understanding Circuit Breakers",
        category: "Electrical",
        readTime: "15 min read",
        excerpt: "A beginner's guide to home electrical safety and managing your breaker panel effectively.",
        image: "http://localhost:5000/uploads/a3-1771010440431.jpg",
        author: "Tom H.",
        date: "Mar 10, 2024"
    },
    {
        id: 'a4',
        title: "Refinishing Hardwood Floors",
        category: "Flooring",
        readTime: "20 min read",
        excerpt: "Step-by-step instructions on sanding, staining, and sealing your old wood floors for a brand new look.",
        image: "http://localhost:5000/uploads/a4-1771010515435.jpg",
        author: "Kevin L.",
        date: "April 15, 2024"
    }
];

export const deals = [
    {
        id: 'd1',
        title: "$10 OFF Any Gallon of Paint",
        code: "PAINT10",
        expiry: "Ends in 3 days",
        type: "Coupon",
        discount: 10,
        minPurchase: 40
    },
    {
        id: 'd2',
        title: "Buy 2 Get 1 Free: Hand Tools",
        code: "TOOLB2G1",
        expiry: "Ends in 1 week",
        type: "Promotion",
        discount: "33%"
    },
    {
        id: 'd3',
        title: "Flash Sale: Lawnmowers 20% OFF",
        expiry: "Ends in 4 hours",
        type: "Flash Sale",
        discount: "20%"
    }
];

export const stores = [
    {
        id: 's1',
        name: "TrueValue Downtown",
        address: "123 Main St, Anytown, CA 90210",
        phone: "0000000000",
        distance: "1.2 miles",
        hours: "8:00 AM - 8:00 PM",
        inventory: "High Stock"
    },
    {
        id: 's2',
        name: "TrueValue Westside",
        address: "456 Oak Ave, Otherville, CA 90211",
        phone: "(555) 987-6543",
        distance: "4.5 miles",
        hours: "7:00 AM - 9:00 PM",
        inventory: "Limited Stock"
    },
    {
        id: 's3',
        name: "TrueValue East Suburban",
        address: "789 Pine Rd, Suburbia, CA 90215",
        phone: "(555) 246-8135",
        distance: "8.1 miles",
        hours: "9:00 AM - 7:00 PM",
        inventory: "Full Stock"
    }
];

export const cmsContent = {
    stats: [
        { id: 1, iconType: 'Brain', label: 'Expert Advice', title: 'In-Store Pros' },
        { id: 2, iconType: 'ShoppingBag', label: 'Fast Delivery', title: 'Within 30 Min' },
        { id: 3, iconType: 'Verified', label: 'Price Match', title: 'Guaranteed' }
    ],

    categories: [
        { name: 'Grocery', sub: 'Fresh & Organic', img: 'http://localhost:5000/uploads/cat1-1771010442070.jpg', iconType: 'Apple' },
        { name: 'Clothing', sub: 'Fashion for All', img: 'http://localhost:5000/uploads/cat2-1771010444269.jpg', iconType: 'Shirt' },
        { name: 'Pharmacy', sub: 'Health & Wellness', img: 'http://localhost:5000/uploads/ph1-1771010424869.jpg', iconType: 'Pill' },
        { name: 'Tools', sub: 'Power & Hand', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW0x3Mj8SkibW9Of5sQGGGnxSBNu8tbzzXcWVU-4oaGg1nhzOQUpkiRtDq0ISC22QmuUah-Wa4wamtXXifDWz-nti6GG-pKaot_y6OXpZnrOKx6nOZ2FrMgfvTM9Srei4szLHFVWpnSg4LtqkhUWQhbqw4yn072YrnYXbt6ts8Jv2L4C-ny22xssw65TyLzQNryY0KHSQja6HfzennucJ7hCWVX7f-gwNji4eGz3He8O3mns5UJKvEQYuB6zQphDcfRgDY_9moFztB', iconType: 'Hammer' },
        { name: 'Garden', sub: 'Outdoor Living', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmJ6CnPbg2ClUc8ebXhz2fDTEFaZ12QE7DaFDokW0ZP-FYu748xDbZevAHYDwsvJJk_giFV638v_zznx2ww2QIfT2NL9B1YyuHOPWuGqmu9mksCbdvjOdfVjIjTUbjzVNvCJbLlUfqL3IeQyzJDCFNZADDsuCk8wy9sX_uou4_XoCT7FK-EQLZB-812NWhRvYs_1TLa05fYoGogspNWaYjHTHzbpGeWcV9wwAz-_DDBg5I7P1LGLBUI-ES6Ap7exJK1JEp_CSxSjP9', iconType: 'Flower2' },
        { name: 'Personal Care', sub: 'Essentials', img: 'http://localhost:5000/uploads/cat5-1771010516836.jpg', iconType: 'Sparkles' },
    ],
    footer: {
        company: {
            description: "Helping you master your next home project with quality tools and expert advice since 1948."
        },
        columns: {
            customerService: [
                { label: "Contact Us", action: "contact" }, // Special action
                { label: "Track Order", action: "track" },
                { label: "Shipping & Returns", action: "shipping" },
                { label: "FAQ", action: "faq" },
                { label: "Help Center", action: "help" }
            ],
            resources: [

                { label: "Store Locator", action: "stores" },
                { label: "Weekly Ad", action: "deals" },
                { label: "TrueValue Rewards", action: "rewards" },
                { label: "Credit Cards", action: "credit" }
            ],
            shop: [
                { label: "Products", action: "products" },
                { label: "Home", action: "home" },
                { label: "Privacy Policy", action: "privacy" },
                { label: "Terms of Use", action: "terms" }
            ]
        }
    }
};
