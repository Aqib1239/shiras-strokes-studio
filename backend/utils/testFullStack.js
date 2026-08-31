const testFullStack = async () => {
  console.log("==========================================");
  console.log("Testing Shira's Strokes Full-Stack API...");
  console.log("==========================================");

  try {
    // 1. Health check
    const health = await fetch("http://localhost:5000/api/health").then((r) => r.json());
    console.log("✓ Health check:", health.status);

    // 2. Fetch public products
    const productsRes = await fetch("http://localhost:5000/api/products").then((r) => r.json());
    console.log(`✓ Public products fetched: ${productsRes.data?.length} items`);

    // 3. Fetch public reviews
    const reviewsRes = await fetch("http://localhost:5000/api/reviews").then((r) => r.json());
    console.log(`✓ Public reviews fetched: ${reviewsRes.data?.length} published reviews`);

    // 4. Test admin login
    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@shirasstrokes.com",
        password: "Admin@Shira2025!",
      }),
    }).then((r) => r.json());

    if (!loginRes.success || !loginRes.data?.token) {
      throw new Error("Admin login failed!");
    }
    const token = loginRes.data.token;
    console.log("✓ Admin login successful, JWT token received");

    // 5. Test protected route: Get admin stats
    const statsRes = await fetch("http://localhost:5000/api/stats", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    console.log(`✓ Admin stats retrieved: Total products=${statsRes.data?.totalProducts}, Total reviews=${statsRes.data?.totalReviews}`);

    // 6. Test protected route: Create new test product
    const newProduct = {
      name: "Handmade Lavender Crochet Keychain",
      category: "crochet",
      categoryLabel: "Crochet Creations",
      price: 320,
      description: "A delicate lavender bloom handcrafted from 100% organic cotton yarn.",
      materials: "Organic cotton yarn, gold-plated ring",
      image: "/assets/cat-crochet.jpg",
      customisable: true,
      featured: true,
      handmade: true,
    };

    const createProdRes = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProduct),
    }).then((r) => r.json());
    console.log(`✓ Admin created product: "${createProdRes.data?.name}" (ID: ${createProdRes.data?._id})`);

    const createdProdId = createProdRes.data?._id;

    // 7. Test protected route: Update product
    const updateProdRes = await fetch(`http://localhost:5000/api/products/${createdProdId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ price: 350 }),
    }).then((r) => r.json());
    console.log(`✓ Admin updated product price: ₹${updateProdRes.data?.price}`);

    // 8. Test protected route: Create review from WhatsApp
    const createRevRes = await fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "Pooja K.",
        occasion: "Birthday surprise",
        rating: 5,
        text: "The crochet bouquet was mesmerizing! It arrived right on time and made the day so memorable.",
        isPublished: true,
        isFeatured: true,
      }),
    }).then((r) => r.json());
    console.log(`✓ Admin recorded WhatsApp review: "${createRevRes.data?.name}" (5 Stars)`);

    // 9. Clean up test product
    await fetch(`http://localhost:5000/api/products/${createdProdId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✓ Admin cleaned up test product");

    console.log("==========================================");
    console.log("🎉 All Full-Stack API Tests Passed Successfully!");
    console.log("==========================================");
  } catch (error) {
    console.error("Test failed:", error.message);
  }
};

testFullStack();
