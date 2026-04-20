import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AAINA BOUTIQUE database...");

  // Create admin user
  const seedPassword = process.env.ADMIN_SEED_PASSWORD || "Admin@123";
  const adminPassword = await bcrypt.hash(seedPassword, 12);
  const admin = await prisma.user.upsert({
    where: { phone: "9999999999" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@aainaboutique.com",
      phone: "9999999999",
      passwordHash: adminPassword,
      role: "ADMIN",
      phoneVerified: true,
      emailVerified: true,
    },
  });

  // Create categories
  const kurtis = await prisma.category.upsert({
    where: { slug: "kurti" },
    update: { image: "/images/products/kurtis/pk-1.jpg" },
    create: {
      name: "Kurti",
      nameHi: "कुर्ती",
      slug: "kurti",
      description: "Beautiful handcrafted kurtis for every occasion",
      image: "/images/products/kurtis/pk-1.jpg",
      sortOrder: 1,
    },
  });

  const sarees = await prisma.category.upsert({
    where: { slug: "saree" },
    update: { image: "/images/products/sarees/ps-1.jpg" },
    create: {
      name: "Saree",
      nameHi: "साड़ी",
      slug: "saree",
      description: "Elegant sarees woven with tradition and love",
      image: "/images/products/sarees/ps-1.jpg",
      sortOrder: 2,
    },
  });

  // ─── KURTI PRODUCTS (38 items) ───
  const kurtiProducts = [
    { name: "Royal Mughal Embroidered Kurti", nameHi: "रॉयल मुगल एम्ब्रॉइडरी कुर्ती", slug: "royal-mughal-embroidered-kurti", description: "Exquisite Mughal-inspired embroidery on premium cotton. Perfect for festive occasions.", descHi: "प्रीमियम कॉटन पर उत्कृष्ट मुगल-प्रेरित कढ़ाई। त्योहारों के लिए एकदम सही।", price: 2499, salePrice: 1999, sku: "KRT-001", stock: 50, isFeatured: true, fabric: "Cotton", color: "Maroon", sizes: ["S", "M", "L", "XL", "XXL"], tags: ["festive", "embroidered", "cotton"], img: "pk-1.jpg" },
    { name: "Lucknowi Chikan Kurti", nameHi: "लखनवी चिकन कुर्ती", slug: "lucknowi-chikan-kurti", description: "Handcrafted Lucknowi chikankari work on soft georgette. A timeless classic.", descHi: "सॉफ्ट जॉर्जेट पर हस्तनिर्मित लखनवी चिकनकारी। एक कालजयी क्लासिक।", price: 3499, salePrice: 2799, sku: "KRT-002", stock: 30, isFeatured: true, fabric: "Georgette", color: "White", sizes: ["S", "M", "L", "XL"], tags: ["chikankari", "lucknowi", "elegant"], img: "pk-2.jpg" },
    { name: "Jaipuri Block Print Kurti", nameHi: "जयपुरी ब्लॉक प्रिंट कुर्ती", slug: "jaipuri-block-print-kurti", description: "Traditional Jaipur block printing on pure cotton. Light and comfortable.", descHi: "शुद्ध कॉटन पर पारंपरिक जयपुर ब्लॉक प्रिंटिंग। हल्का और आरामदायक।", price: 1799, sku: "KRT-003", stock: 80, fabric: "Cotton", color: "Blue", sizes: ["M", "L", "XL", "XXL"], tags: ["block-print", "jaipur", "casual"], img: "pk-3.jpg" },
    { name: "Anarkali Festive Kurti", nameHi: "अनारकली फेस्टिव कुर्ती", slug: "anarkali-festive-kurti", description: "Stunning Anarkali style kurti with golden zari work. Ideal for weddings.", descHi: "सुनहरी जरी काम के साथ शानदार अनारकली स्टाइल कुर्ती। शादियों के लिए आदर्श।", price: 4999, salePrice: 3999, sku: "KRT-004", stock: 25, isFeatured: true, fabric: "Silk Blend", color: "Gold", sizes: ["S", "M", "L", "XL"], tags: ["anarkali", "wedding", "festive", "zari"], img: "pk-4.jpg" },
    { name: "Navy Blue Printed Kurti", nameHi: "नेवी ब्लू प्रिंटेड कुर्ती", slug: "navy-blue-printed-kurti", description: "Elegant navy blue kurti with white geometric prints. Perfect office wear.", descHi: "सफेद ज्यामितीय प्रिंट के साथ सुंदर नेवी ब्लू कुर्ती। ऑफिस वियर।", price: 1599, salePrice: 1299, sku: "KRT-005", stock: 60, fabric: "Cotton", color: "Navy Blue", sizes: ["S", "M", "L", "XL", "XXL"], tags: ["office", "printed", "casual"], img: "pk-5.jpg" },
    { name: "White Cotton Embroidered Kurti", nameHi: "सफेद कॉटन एम्ब्रॉइडर्ड कुर्ती", slug: "white-cotton-embroidered-kurti", description: "Pure white cotton with delicate embroidery. Elegant summer wear.", descHi: "नाजुक कढ़ाई के साथ शुद्ध सफेद कॉटन। गर्मियों का सुंदर वियर।", price: 1899, sku: "KRT-006", stock: 45, fabric: "Cotton", color: "White", sizes: ["M", "L", "XL"], tags: ["summer", "white", "embroidered"], img: "pk-6.jpg" },
    { name: "Graphic Print Casual Kurti", nameHi: "ग्राफिक प्रिंट कैजुअल कुर्ती", slug: "graphic-print-casual-kurti", description: "Trendy graphic print on soft cotton blend. Youthful and fun.", descHi: "सॉफ्ट कॉटन ब्लेंड पर ट्रेंडी ग्राफिक प्रिंट। युवा और मजेदार।", price: 1299, salePrice: 999, sku: "KRT-007", stock: 70, fabric: "Cotton Blend", color: "Multi", sizes: ["S", "M", "L", "XL"], tags: ["casual", "graphic", "trendy"], img: "pk-7.jpg" },
    { name: "Off White Georgette Kurti", nameHi: "ऑफ व्हाइट जॉर्जेट कुर्ती", slug: "off-white-georgette-kurti", description: "Graceful off-white georgette kurti with subtle detailing. Versatile and classy.", descHi: "सूक्ष्म डिटेलिंग के साथ ऑफ-व्हाइट जॉर्जेट कुर्ती। बहुमुखी और क्लासी।", price: 2299, sku: "KRT-008", stock: 35, fabric: "Georgette", color: "Off White", sizes: ["S", "M", "L", "XL"], tags: ["georgette", "classy", "versatile"], img: "pk-8.jpg" },
    { name: "Round Neck Solid Kurti", nameHi: "राउंड नेक सॉलिड कुर्ती", slug: "round-neck-solid-kurti", description: "Classic round neck solid color kurti in soft cotton. Everyday essential.", descHi: "सॉफ्ट कॉटन में क्लासिक राउंड नेक सॉलिड कलर कुर्ती। रोज़ का जरूरी।", price: 999, sku: "KRT-009", stock: 100, fabric: "Cotton", color: "Pink", sizes: ["S", "M", "L", "XL", "XXL"], tags: ["solid", "daily", "basic"], img: "pk-9.jpg" },
    { name: "Floral Embroidered A-Line Kurti", nameHi: "फ्लोरल एम्ब्रॉइडर्ड ए-लाइन कुर्ती", slug: "floral-embroidered-aline-kurti", description: "Beautiful floral embroidery on A-line silhouette. Flattering fit.", descHi: "ए-लाइन सिल्हूट पर सुंदर फ्लोरल कढ़ाई। आकर्षक फिट।", price: 2199, salePrice: 1799, sku: "KRT-010", stock: 40, isFeatured: true, fabric: "Cotton", color: "Yellow", sizes: ["S", "M", "L", "XL"], tags: ["floral", "a-line", "embroidered"], img: "pk-10.jpg" },
    { name: "Silk Blend Designer Kurti", nameHi: "सिल्क ब्लेंड डिज़ाइनर कुर्ती", slug: "silk-blend-designer-kurti", description: "Premium silk blend with intricate design. For special occasions.", descHi: "जटिल डिज़ाइन के साथ प्रीमियम सिल्क ब्लेंड। विशेष अवसरों के लिए।", price: 3999, salePrice: 3299, sku: "KRT-011", stock: 20, fabric: "Silk Blend", color: "Maroon", sizes: ["S", "M", "L", "XL"], tags: ["silk", "designer", "special"], img: "pk-11.jpg" },
    { name: "Straight Cut Cotton Kurti", nameHi: "स्ट्रेट कट कॉटन कुर्ती", slug: "straight-cut-cotton-kurti", description: "Clean straight cut in breathable cotton. Minimalist and modern.", descHi: "ब्रीदेबल कॉटन में क्लीन स्ट्रेट कट। न्यूनतम और आधुनिक।", price: 1499, sku: "KRT-012", stock: 55, fabric: "Cotton", color: "Green", sizes: ["M", "L", "XL", "XXL"], tags: ["straight", "minimal", "modern"], img: "pk-12.jpg" },
    { name: "Mirror Work Party Kurti", nameHi: "मिरर वर्क पार्टी कुर्ती", slug: "mirror-work-party-kurti", description: "Glamorous mirror work kurti for parties and celebrations.", descHi: "पार्टियों और उत्सवों के लिए ग्लैमरस मिरर वर्क कुर्ती।", price: 3299, salePrice: 2699, sku: "KRT-013", stock: 30, fabric: "Georgette", color: "Red", sizes: ["S", "M", "L", "XL"], tags: ["mirror", "party", "glamorous"], img: "pk-13.jpg" },
    { name: "Pastel Printed Summer Kurti", nameHi: "पेस्टल प्रिंटेड समर कुर्ती", slug: "pastel-printed-summer-kurti", description: "Light pastel printed kurti perfect for summer. Cool and comfortable.", descHi: "गर्मी के लिए हल्की पेस्टल प्रिंटेड कुर्ती। ठंडी और आरामदायक।", price: 1399, sku: "KRT-014", stock: 65, fabric: "Cotton", color: "Pastel", sizes: ["S", "M", "L", "XL", "XXL"], tags: ["pastel", "summer", "light"], img: "pk-14.jpg" },
    { name: "Rayon Mandarin Collar Kurti", nameHi: "रेयॉन मंदारिन कॉलर कुर्ती", slug: "rayon-mandarin-collar-kurti", description: "Stylish mandarin collar rayon kurti. Modern with traditional touch.", descHi: "स्टाइलिश मंदारिन कॉलर रेयॉन कुर्ती। पारंपरिक स्पर्श।", price: 1699, salePrice: 1399, sku: "KRT-015", stock: 50, fabric: "Rayon", color: "Teal", sizes: ["S", "M", "L", "XL"], tags: ["rayon", "mandarin", "modern"], img: "pk-15.jpg" },
    { name: "Heavy Embroidered Wedding Kurti", nameHi: "हैवी एम्ब्रॉइडर्ड वेडिंग कुर्ती", slug: "heavy-embroidered-wedding-kurti", description: "Richly embroidered kurti for weddings. Royal and majestic.", descHi: "शादी के लिए समृद्ध कढ़ाई कुर्ती। शाही और भव्य।", price: 5999, salePrice: 4999, sku: "KRT-016", stock: 15, isFeatured: true, fabric: "Silk", color: "Gold", sizes: ["S", "M", "L", "XL"], tags: ["wedding", "heavy", "embroidered", "premium"], img: "pk-16.jpg" },
    { name: "Printed Viscose Kurti", nameHi: "प्रिंटेड विस्कोस कुर्ती", slug: "printed-viscose-kurti", description: "Soft viscose with vibrant prints. Comfortable all-day wear.", descHi: "जीवंत प्रिंट के साथ सॉफ्ट विस्कोस। पूरे दिन का आरामदायक।", price: 1599, sku: "KRT-017", stock: 45, fabric: "Viscose", color: "Blue", sizes: ["M", "L", "XL"], tags: ["viscose", "printed", "comfortable"], img: "pk-17.jpg" },
    { name: "Palazzo Set Designer Kurti", nameHi: "पलाज़ो सेट डिज़ाइनर कुर्ती", slug: "palazzo-set-designer-kurti", description: "Elegant kurti and palazzo set. Ready to wear festive outfit.", descHi: "सुंदर कुर्ती और पलाज़ो सेट। रेडी टू वियर फेस्टिव।", price: 3799, salePrice: 2999, sku: "KRT-018", stock: 25, fabric: "Cotton Blend", color: "Peach", sizes: ["S", "M", "L", "XL"], tags: ["set", "palazzo", "festive"], img: "pk-18.jpg" },
    { name: "Indigo Tie-Dye Kurti", nameHi: "इंडिगो टाई-डाई कुर्ती", slug: "indigo-tie-dye-kurti", description: "Artisanal indigo tie-dye on premium cotton. Unique and hand-finished.", descHi: "प्रीमियम कॉटन पर इंडिगो टाई-डाई। अनोखा और हैंड-फिनिश्ड।", price: 1899, sku: "KRT-019", stock: 35, fabric: "Cotton", color: "Indigo", sizes: ["S", "M", "L", "XL"], tags: ["tie-dye", "indigo", "artisan"], img: "pk-19.jpg" },
    { name: "Chanderi Silk Kurti", nameHi: "चंदेरी सिल्क कुर्ती", slug: "chanderi-silk-kurti", description: "Lightweight chanderi silk with gold zari border. Everyday luxury.", descHi: "गोल्ड ज़री बॉर्डर के साथ हल्की चंदेरी सिल्क। हर दिन की शान।", price: 2999, salePrice: 2499, sku: "KRT-020", stock: 30, fabric: "Chanderi Silk", color: "Pink", sizes: ["S", "M", "L", "XL"], tags: ["chanderi", "silk", "zari"], img: "pk-20.jpg" },
    { name: "Kalamkari Print Kurti", nameHi: "कलमकारी प्रिंट कुर्ती", slug: "kalamkari-print-kurti", description: "Traditional Kalamkari art print on cotton. Heritage with modern fit.", descHi: "कॉटन पर पारंपरिक कलमकारी प्रिंट। आधुनिक फिट।", price: 1999, sku: "KRT-021", stock: 40, fabric: "Cotton", color: "Multi", sizes: ["M", "L", "XL", "XXL"], tags: ["kalamkari", "heritage", "print"], img: "pk-21.jpg" },
    { name: "Bandhani Festive Kurti", nameHi: "बंधनी फेस्टिव कुर्ती", slug: "bandhani-festive-kurti", description: "Authentic bandhani tie-dye from Rajasthan. Vibrant and celebratory.", descHi: "राजस्थान से प्रामाणिक बंधनी टाई-डाई। जीवंत और उत्सवी।", price: 2299, salePrice: 1899, sku: "KRT-022", stock: 35, fabric: "Cotton", color: "Red", sizes: ["S", "M", "L", "XL"], tags: ["bandhani", "rajasthan", "festive"], img: "pk-22.jpg" },
    { name: "Linen Straight Kurti", nameHi: "लिनन स्ट्रेट कुर्ती", slug: "linen-straight-kurti", description: "Premium linen kurti for summer comfort. Breathable and chic.", descHi: "गर्मी के आराम के लिए प्रीमियम लिनन कुर्ती। हवादार।", price: 2199, sku: "KRT-023", stock: 40, fabric: "Linen", color: "Beige", sizes: ["S", "M", "L", "XL"], tags: ["linen", "summer", "chic"], img: "pk-23.jpg" },
    { name: "Velvet Winter Kurti", nameHi: "वेलवेट विंटर कुर्ती", slug: "velvet-winter-kurti", description: "Luxurious velvet kurti for winter season. Warm and stylish.", descHi: "सर्दियों के लिए शानदार वेलवेट कुर्ती। गर्म और स्टाइलिश।", price: 3499, salePrice: 2799, sku: "KRT-024", stock: 20, fabric: "Velvet", color: "Wine", sizes: ["S", "M", "L", "XL"], tags: ["velvet", "winter", "warm"], img: "pk-24.jpg" },
    { name: "Ikat Print Cotton Kurti", nameHi: "इकत प्रिंट कॉटन कुर्ती", slug: "ikat-print-cotton-kurti", description: "Handwoven ikat pattern on pure cotton. Artisan crafted.", descHi: "शुद्ध कॉटन पर हैंडवोवन इकत पैटर्न। कारीगर निर्मित।", price: 1699, sku: "KRT-025", stock: 50, fabric: "Cotton", color: "Blue", sizes: ["M", "L", "XL", "XXL"], tags: ["ikat", "handwoven", "artisan"], img: "pk-25.jpg" },
    { name: "Sharara Set Kurti", nameHi: "शरारा सेट कुर्ती", slug: "sharara-set-kurti", description: "Elegant sharara set with embroidered kurti. Complete festive look.", descHi: "एम्ब्रॉइडर्ड कुर्ती के साथ सुंदर शरारा सेट। पूरा फेस्टिव लुक।", price: 4499, salePrice: 3699, sku: "KRT-026", stock: 20, isFeatured: true, fabric: "Georgette", color: "Green", sizes: ["S", "M", "L", "XL"], tags: ["sharara", "set", "festive"], img: "pk-26.jpg" },
    { name: "Ajrakh Print Kurti", nameHi: "अजरख प्रिंट कुर्ती", slug: "ajrakh-print-kurti", description: "Traditional ajrakh block print from Gujarat. Rich earthy tones.", descHi: "गुजरात से पारंपरिक अजरख ब्लॉक प्रिंट। मिट्टी के रंग।", price: 1899, sku: "KRT-027", stock: 45, fabric: "Cotton", color: "Brown", sizes: ["S", "M", "L", "XL", "XXL"], tags: ["ajrakh", "block-print", "earthy"], img: "pk-27.jpg" },
    { name: "Pintuck Detail Kurti", nameHi: "पिनटक डिटेल कुर्ती", slug: "pintuck-detail-kurti", description: "Delicate pintuck detailing on cotton. Subtle yet sophisticated.", descHi: "कॉटन पर नाजुक पिनटक डिटेलिंग। सूक्ष्म और परिष्कृत।", price: 1499, salePrice: 1199, sku: "KRT-028", stock: 55, fabric: "Cotton", color: "Lavender", sizes: ["S", "M", "L", "XL"], tags: ["pintuck", "subtle", "sophisticated"], img: "pk-28.jpg" },
    { name: "Brocade Party Kurti", nameHi: "ब्रोकेड पार्टी कुर्ती", slug: "brocade-party-kurti", description: "Rich brocade fabric kurti for parties. Opulent and eye-catching.", descHi: "पार्टियों के लिए रिच ब्रोकेड कुर्ती। भव्य और आकर्षक।", price: 3999, salePrice: 3299, sku: "KRT-029", stock: 18, fabric: "Brocade", color: "Gold", sizes: ["S", "M", "L", "XL"], tags: ["brocade", "party", "opulent"], img: "pk-29.jpg" },
    { name: "Denim Style Kurti", nameHi: "डेनिम स्टाइल कुर्ती", slug: "denim-style-kurti", description: "Fusion denim kurti with Indian embroidery. Contemporary meets traditional.", descHi: "भारतीय कढ़ाई के साथ फ्यूज़न डेनिम कुर्ती। समकालीन।", price: 1799, sku: "KRT-030", stock: 40, fabric: "Denim", color: "Blue", sizes: ["S", "M", "L", "XL", "XXL"], tags: ["denim", "fusion", "contemporary"], img: "pk-30.jpg" },
    { name: "Sequin Work Evening Kurti", nameHi: "सिक्विन वर्क ईवनिंग कुर्ती", slug: "sequin-work-evening-kurti", description: "Dazzling sequin work for evening parties. Shimmer and shine.", descHi: "शाम की पार्टियों के लिए चमकदार सिक्विन वर्क।", price: 3699, salePrice: 2999, sku: "KRT-031", stock: 22, fabric: "Georgette", color: "Black", sizes: ["S", "M", "L", "XL"], tags: ["sequin", "evening", "party"], img: "pk-31.jpg" },
    { name: "Khadi Cotton Kurti", nameHi: "खादी कॉटन कुर्ती", slug: "khadi-cotton-kurti", description: "Handspun khadi cotton kurti. Sustainable fashion with heritage.", descHi: "हैंडस्पन खादी कॉटन कुर्ती। सस्टेनेबल फैशन।", price: 1599, sku: "KRT-032", stock: 50, fabric: "Khadi", color: "Natural", sizes: ["M", "L", "XL", "XXL"], tags: ["khadi", "sustainable", "heritage"], img: "pk-32.jpg" },
    { name: "Angrakha Style Kurti", nameHi: "अंगरखा स्टाइल कुर्ती", slug: "angrakha-style-kurti", description: "Traditional angrakha wrap style. Flattering and unique silhouette.", descHi: "पारंपरिक अंगरखा रैप स्टाइल। आकर्षक सिल्हूट।", price: 2499, salePrice: 1999, sku: "KRT-033", stock: 30, fabric: "Cotton Blend", color: "Rust", sizes: ["S", "M", "L", "XL"], tags: ["angrakha", "wrap", "traditional"], img: "pk-33.jpg" },
    { name: "Tussar Silk Kurti", nameHi: "तुसार सिल्क कुर्ती", slug: "tussar-silk-kurti", description: "Natural tussar silk with raw texture. Premium handloom quality.", descHi: "कच्ची बनावट के साथ प्राकृतिक तुसार सिल्क। प्रीमियम हैंडलूम।", price: 3299, sku: "KRT-034", stock: 15, fabric: "Tussar Silk", color: "Gold", sizes: ["S", "M", "L", "XL"], tags: ["tussar", "silk", "handloom"], img: "pk-34.jpg" },
    { name: "Gota Patti Work Kurti", nameHi: "गोटा पट्टी वर्क कुर्ती", slug: "gota-patti-work-kurti", description: "Rajasthani gota patti embellishment. Festive and vibrant.", descHi: "राजस्थानी गोटा पट्टी सजावट। उत्सवी और जीवंत।", price: 2799, salePrice: 2299, sku: "KRT-035", stock: 28, fabric: "Cotton", color: "Orange", sizes: ["S", "M", "L", "XL"], tags: ["gota-patti", "rajasthan", "festive"], img: "pk-35.jpg" },
    { name: "Asymmetric Hem Kurti", nameHi: "एसिमेट्रिक हेम कुर्ती", slug: "asymmetric-hem-kurti", description: "Modern asymmetric hemline. Contemporary fashion-forward look.", descHi: "आधुनिक एसिमेट्रिक हेमलाइन। फैशन-फॉरवर्ड लुक।", price: 1899, sku: "KRT-036", stock: 35, fabric: "Rayon", color: "Olive", sizes: ["S", "M", "L", "XL", "XXL"], tags: ["asymmetric", "modern", "trendy"], img: "pk-36.jpg" },
    { name: "Patchwork Boho Kurti", nameHi: "पैचवर्क बोहो कुर्ती", slug: "patchwork-boho-kurti", description: "Bohemian patchwork with mixed prints. Free-spirited and artistic.", descHi: "मिक्स्ड प्रिंट के साथ बोहेमियन पैचवर्क। कलात्मक।", price: 1699, salePrice: 1399, sku: "KRT-037", stock: 40, fabric: "Cotton", color: "Multi", sizes: ["S", "M", "L", "XL"], tags: ["patchwork", "boho", "artistic"], img: "pk-37.jpg" },
    { name: "Zardozi Bridal Kurti", nameHi: "ज़रदोज़ी ब्राइडल कुर्ती", slug: "zardozi-bridal-kurti", description: "Exquisite zardozi handwork for bridal wear. Pinnacle of Indian craft.", descHi: "ब्राइडल वियर के लिए उत्कृष्ट ज़रदोज़ी हैंडवर्क।", price: 7999, salePrice: 6499, sku: "KRT-038", stock: 10, isFeatured: true, fabric: "Silk", color: "Red", sizes: ["S", "M", "L", "XL"], tags: ["zardozi", "bridal", "premium", "handwork"], img: "pk-38.jpg" },
  ];

  // ─── SAREE PRODUCTS (44 items) ───
  const sareeProducts = [
    { name: "Banarasi Silk Saree", nameHi: "बनारसी सिल्क साड़ी", slug: "banarasi-silk-saree", description: "Pure Banarasi silk with intricate gold zari weaving. A masterpiece.", descHi: "जटिल सोने की जरी बुनाई के साथ शुद्ध बनारसी सिल्क।", price: 12999, salePrice: 9999, sku: "SAR-001", stock: 15, isFeatured: true, fabric: "Pure Silk", color: "Red", sizes: ["Free Size"], tags: ["banarasi", "silk", "wedding", "premium"], img: "ps-1.jpg" },
    { name: "Chanderi Cotton Saree", nameHi: "चंदेरी कॉटन साड़ी", slug: "chanderi-cotton-saree", description: "Lightweight Chanderi cotton with subtle gold motifs. Daily elegance.", descHi: "सूक्ष्म सोने के मोटिफ्स के साथ हल्की चंदेरी कॉटन।", price: 3999, salePrice: 3299, sku: "SAR-002", stock: 40, isFeatured: true, fabric: "Chanderi Cotton", color: "Peach", sizes: ["Free Size"], tags: ["chanderi", "cotton", "daily-wear"], img: "ps-2.jpg" },
    { name: "Kanjivaram Silk Saree", nameHi: "कांजीवरम सिल्क साड़ी", slug: "kanjivaram-silk-saree", description: "Authentic Kanjivaram silk from Tamil Nadu. Rich and luxurious.", descHi: "तमिलनाडु से प्रामाणिक कांजीवरम सिल्क। समृद्ध।", price: 18999, sku: "SAR-003", stock: 10, isFeatured: true, fabric: "Pure Silk", color: "Green", sizes: ["Free Size"], tags: ["kanjivaram", "silk", "premium", "wedding"], img: "ps-3.jpg" },
    { name: "Printed Georgette Saree", nameHi: "प्रिंटेड जॉर्जेट साड़ी", slug: "printed-georgette-saree", description: "Digital print on flowing georgette. Lightweight and easy to drape.", descHi: "बहती जॉर्जेट पर डिजिटल प्रिंट। हल्का।", price: 2499, salePrice: 1899, sku: "SAR-004", stock: 60, fabric: "Georgette", color: "Navy", sizes: ["Free Size"], tags: ["georgette", "printed", "casual"], img: "ps-4.jpg" },
    { name: "Ombre Zari Saree", nameHi: "ओम्ब्रे ज़री साड़ी", slug: "ombre-zari-saree", description: "Stunning ombre effect with delicate zari work. Modern yet traditional.", descHi: "नाजुक ज़री वर्क के साथ ओम्ब्रे इफेक्ट।", price: 4999, salePrice: 3999, sku: "SAR-005", stock: 25, isFeatured: true, fabric: "Silk Blend", color: "Orange", sizes: ["Free Size"], tags: ["ombre", "zari", "modern"], img: "ps-5.jpg" },
    { name: "Embroidered Net Saree", nameHi: "एम्ब्रॉइडर्ड नेट साड़ी", slug: "embroidered-net-saree", description: "Delicate net with heavy embroidery. Perfect for cocktail parties.", descHi: "भारी कढ़ाई के साथ नाजुक नेट। कॉकटेल पार्टियों के लिए।", price: 5999, salePrice: 4799, sku: "SAR-006", stock: 20, fabric: "Net", color: "Pink", sizes: ["Free Size"], tags: ["net", "embroidered", "party"], img: "ps-6.jpg" },
    { name: "Cotton Silk Daily Saree", nameHi: "कॉटन सिल्क डेली साड़ी", slug: "cotton-silk-daily-saree", description: "Comfortable cotton silk for everyday wear. Elegant simplicity.", descHi: "रोज़ के वियर के लिए कॉटन सिल्क। सुंदर सादगी।", price: 2299, sku: "SAR-007", stock: 50, fabric: "Cotton Silk", color: "Beige", sizes: ["Free Size"], tags: ["cotton-silk", "daily", "simple"], img: "ps-7.jpg" },
    { name: "Bandhani Rajasthani Saree", nameHi: "बंधनी राजस्थानी साड़ी", slug: "bandhani-rajasthani-saree", description: "Authentic bandhani tie-dye from Rajasthan. Vibrant and traditional.", descHi: "राजस्थान से प्रामाणिक बंधनी।", price: 3499, salePrice: 2799, sku: "SAR-008", stock: 30, fabric: "Cotton", color: "Red", sizes: ["Free Size"], tags: ["bandhani", "rajasthan", "traditional"], img: "ps-8.jpg" },
    { name: "Tussar Silk Handloom Saree", nameHi: "तुसार सिल्क हैंडलूम साड़ी", slug: "tussar-silk-handloom-saree", description: "Handwoven tussar silk with natural texture. Artisan elegance.", descHi: "प्राकृतिक बनावट के साथ हैंडवोवन तुसार सिल्क।", price: 6999, sku: "SAR-009", stock: 12, fabric: "Tussar Silk", color: "Gold", sizes: ["Free Size"], tags: ["tussar", "handloom", "artisan"], img: "ps-9.jpg" },
    { name: "Patola Silk Saree", nameHi: "पटोला सिल्क साड़ी", slug: "patola-silk-saree", description: "Traditional Patola double ikat from Gujarat. Heritage masterpiece.", descHi: "गुजरात से पारंपरिक पटोला डबल इकत।", price: 15999, salePrice: 12999, sku: "SAR-010", stock: 8, isFeatured: true, fabric: "Pure Silk", color: "Multi", sizes: ["Free Size"], tags: ["patola", "ikat", "heritage", "premium"], img: "ps-10.jpg" },
    { name: "Linen Handloom Saree", nameHi: "लिनन हैंडलूम साड़ी", slug: "linen-handloom-saree", description: "Premium linen handloom for summer. Breathable and luxurious.", descHi: "गर्मियों के लिए प्रीमियम लिनन हैंडलूम।", price: 4499, sku: "SAR-011", stock: 25, fabric: "Linen", color: "White", sizes: ["Free Size"], tags: ["linen", "handloom", "summer"], img: "ps-11.jpg" },
    { name: "Organza Floral Saree", nameHi: "ऑर्गेंज़ा फ्लोरल साड़ी", slug: "organza-floral-saree", description: "Sheer organza with floral prints. Light as air and stunning.", descHi: "फ्लोरल प्रिंट के साथ शीयर ऑर्गेंज़ा। हवा जैसी हल्की।", price: 3799, salePrice: 2999, sku: "SAR-012", stock: 35, fabric: "Organza", color: "Pastel Pink", sizes: ["Free Size"], tags: ["organza", "floral", "sheer"], img: "ps-12.jpg" },
    { name: "Kalamkari Print Saree", nameHi: "कलमकारी प्रिंट साड़ी", slug: "kalamkari-print-saree", description: "Traditional Kalamkari art on cotton. Heritage art meets fashion.", descHi: "कॉटन पर कलमकारी कला। विरासत।", price: 2799, sku: "SAR-013", stock: 40, fabric: "Cotton", color: "Multi", sizes: ["Free Size"], tags: ["kalamkari", "art", "heritage"], img: "ps-13.jpg" },
    { name: "Sequin Party Saree", nameHi: "सिक्विन पार्टी साड़ी", slug: "sequin-party-saree", description: "Glamorous sequin embellished saree for parties. Sparkle and shine.", descHi: "पार्टियों के लिए सिक्विन साड़ी। चमक और दमक।", price: 6499, salePrice: 5299, sku: "SAR-014", stock: 18, fabric: "Georgette", color: "Black", sizes: ["Free Size"], tags: ["sequin", "party", "glamorous"], img: "ps-14.jpg" },
    { name: "Maheshwari Silk Saree", nameHi: "माहेश्वरी सिल्क साड़ी", slug: "maheshwari-silk-saree", description: "Classic Maheshwari silk from Madhya Pradesh. Reversible and beautiful.", descHi: "मध्य प्रदेश से क्लासिक माहेश्वरी सिल्क।", price: 5499, sku: "SAR-015", stock: 15, fabric: "Silk", color: "Purple", sizes: ["Free Size"], tags: ["maheshwari", "silk", "reversible"], img: "ps-15.jpg" },
    { name: "Chiffon Printed Saree", nameHi: "शिफॉन प्रिंटेड साड़ी", slug: "chiffon-printed-saree", description: "Flowing chiffon with digital prints. Lightweight gorgeous drape.", descHi: "डिजिटल प्रिंट के साथ बहती शिफॉन।", price: 2199, salePrice: 1799, sku: "SAR-016", stock: 55, fabric: "Chiffon", color: "Coral", sizes: ["Free Size"], tags: ["chiffon", "printed", "flowing"], img: "ps-16.jpg" },
    { name: "Pochampally Ikat Saree", nameHi: "पोचमपल्ली इकत साड़ी", slug: "pochampally-ikat-saree", description: "Handwoven Pochampally ikat from Telangana. Geometric perfection.", descHi: "तेलंगाना से हैंडवोवन पोचमपल्ली इकत।", price: 4999, sku: "SAR-017", stock: 20, fabric: "Cotton", color: "Blue", sizes: ["Free Size"], tags: ["pochampally", "ikat", "handwoven"], img: "ps-17.jpg" },
    { name: "Velvet Bridal Saree", nameHi: "वेलवेट ब्राइडल साड़ी", slug: "velvet-bridal-saree", description: "Luxurious velvet with heavy zardozi work. Royal bridal choice.", descHi: "भारी ज़रदोज़ी वर्क के साथ शानदार वेलवेट। शाही ब्राइडल।", price: 19999, salePrice: 16999, sku: "SAR-018", stock: 5, isFeatured: true, fabric: "Velvet", color: "Maroon", sizes: ["Free Size"], tags: ["velvet", "bridal", "zardozi", "premium"], img: "ps-18.jpg" },
    { name: "Mulmul Cotton Saree", nameHi: "मलमल कॉटन साड़ी", slug: "mulmul-cotton-saree", description: "Ultra-soft mulmul cotton. Feather-light for summer.", descHi: "अल्ट्रा-सॉफ्ट मलमल कॉटन। गर्मी के लिए।", price: 1899, sku: "SAR-019", stock: 60, fabric: "Mulmul Cotton", color: "Yellow", sizes: ["Free Size"], tags: ["mulmul", "cotton", "summer"], img: "ps-19.jpg" },
    { name: "Paithani Silk Saree", nameHi: "पैठानी सिल्क साड़ी", slug: "paithani-silk-saree", description: "Exquisite Paithani silk from Maharashtra. Peacock motifs.", descHi: "महाराष्ट्र से उत्कृष्ट पैठानी सिल्क। मोर मोटिफ।", price: 22999, sku: "SAR-020", stock: 6, fabric: "Pure Silk", color: "Green", sizes: ["Free Size"], tags: ["paithani", "silk", "peacock", "premium"], img: "ps-20.jpg" },
    { name: "Tant Cotton Bengal Saree", nameHi: "तांत कॉटन बंगाल साड़ी", slug: "tant-cotton-bengal-saree", description: "Traditional tant cotton from Bengal. Airy and elegant.", descHi: "बंगाल से तांत कॉटन। हवादार और सुंदर।", price: 2499, salePrice: 1999, sku: "SAR-021", stock: 35, fabric: "Cotton", color: "White", sizes: ["Free Size"], tags: ["tant", "bengal", "cotton"], img: "ps-21.jpg" },
    { name: "Banarasi Organza Saree", nameHi: "बनारसी ऑर्गेंज़ा साड़ी", slug: "banarasi-organza-saree", description: "Modern Banarasi weaving on organza. Sheer elegance redefined.", descHi: "ऑर्गेंज़ा पर आधुनिक बनारसी बुनाई।", price: 7999, salePrice: 6499, sku: "SAR-022", stock: 12, fabric: "Organza", color: "Gold", sizes: ["Free Size"], tags: ["banarasi", "organza", "modern"], img: "ps-22.jpg" },
    { name: "Satin Silk Party Saree", nameHi: "सैटिन सिल्क पार्टी साड़ी", slug: "satin-silk-party-saree", description: "Glossy satin silk with designer pallu. Statement saree.", descHi: "डिज़ाइनर पल्लू के साथ सैटिन सिल्क। स्टेटमेंट साड़ी।", price: 4299, salePrice: 3499, sku: "SAR-023", stock: 22, fabric: "Satin Silk", color: "Wine", sizes: ["Free Size"], tags: ["satin", "party", "designer"], img: "ps-23.jpg" },
    { name: "Jamdani Muslin Saree", nameHi: "जामदानी मसलिन साड़ी", slug: "jamdani-muslin-saree", description: "Heritage Jamdani on fine muslin. Timeless Bengali craft.", descHi: "फाइन मसलिन पर जामदानी। कालजयी बंगाली शिल्प।", price: 8999, sku: "SAR-024", stock: 10, fabric: "Muslin", color: "Off White", sizes: ["Free Size"], tags: ["jamdani", "muslin", "bengal"], img: "ps-24.jpg" },
    { name: "Bhagalpuri Silk Saree", nameHi: "भागलपुरी सिल्क साड़ी", slug: "bhagalpuri-silk-saree", description: "Textured Bhagalpuri silk with natural sheen. Earthy and sophisticated.", descHi: "प्राकृतिक चमक के साथ भागलपुरी सिल्क।", price: 3999, sku: "SAR-025", stock: 28, fabric: "Bhagalpuri Silk", color: "Brown", sizes: ["Free Size"], tags: ["bhagalpuri", "silk", "earthy"], img: "ps-25.jpg" },
    { name: "Mirror Work Kutch Saree", nameHi: "मिरर वर्क कच्छ साड़ी", slug: "mirror-work-kutch-saree", description: "Traditional Kutch mirror work from Gujarat. Festive and colorful.", descHi: "गुजरात से कच्छ मिरर वर्क। उत्सवी और रंगीन।", price: 4499, salePrice: 3699, sku: "SAR-026", stock: 18, fabric: "Cotton", color: "Multi", sizes: ["Free Size"], tags: ["mirror", "kutch", "festive"], img: "ps-26.jpg" },
    { name: "Tissue Silk Saree", nameHi: "टिश्यू सिल्क साड़ी", slug: "tissue-silk-saree", description: "Luxurious tissue silk with metallic finish. Glamour personified.", descHi: "मेटैलिक फिनिश के साथ टिश्यू सिल्क। ग्लैमर।", price: 5999, salePrice: 4999, sku: "SAR-027", stock: 15, fabric: "Tissue Silk", color: "Gold", sizes: ["Free Size"], tags: ["tissue", "silk", "glamour"], img: "ps-27.jpg" },
    { name: "Handpainted Silk Saree", nameHi: "हैंडपेंटेड सिल्क साड़ी", slug: "handpainted-silk-saree", description: "Hand-painted artwork on pure silk. One-of-a-kind wearable art.", descHi: "शुद्ध सिल्क पर हैंड-पेंटेड कलाकृति। अनोखी कला।", price: 9999, sku: "SAR-028", stock: 8, fabric: "Pure Silk", color: "Multi", sizes: ["Free Size"], tags: ["handpainted", "art", "unique"], img: "ps-28.jpg" },
    { name: "Crepe Silk Daily Saree", nameHi: "क्रेप सिल्क डेली साड़ी", slug: "crepe-silk-daily-saree", description: "Easy-to-manage crepe silk for everyday. Wrinkle-free elegance.", descHi: "रोज़ के लिए क्रेप सिल्क। शिकन-मुक्त।", price: 2699, salePrice: 2199, sku: "SAR-029", stock: 45, fabric: "Crepe Silk", color: "Teal", sizes: ["Free Size"], tags: ["crepe", "daily", "wrinkle-free"], img: "ps-29.jpg" },
    { name: "Kasavu Kerala Saree", nameHi: "कसावु केरला साड़ी", slug: "kasavu-kerala-saree", description: "Classic Kerala kasavu with golden border. Simple and divine.", descHi: "सुनहरी बॉर्डर के साथ केरला कसावु। सादी और दिव्य।", price: 3299, sku: "SAR-030", stock: 30, fabric: "Cotton", color: "Cream", sizes: ["Free Size"], tags: ["kasavu", "kerala", "golden"], img: "ps-30.jpg" },
    { name: "Gadwal Silk Saree", nameHi: "गडवाल सिल्क साड़ी", slug: "gadwal-silk-saree", description: "Traditional Gadwal silk from Telangana. Cotton body silk border.", descHi: "तेलंगाना से गडवाल सिल्क। कॉटन बॉडी सिल्क बॉर्डर।", price: 6499, salePrice: 5499, sku: "SAR-031", stock: 14, fabric: "Silk", color: "Red", sizes: ["Free Size"], tags: ["gadwal", "silk", "telangana"], img: "ps-31.jpg" },
    { name: "Ajrakh Block Print Saree", nameHi: "अजरख ब्लॉक प्रिंट साड़ी", slug: "ajrakh-block-print-saree", description: "Natural dyed ajrakh block print. Ancient techniques.", descHi: "प्राकृतिक रंगे अजरख ब्लॉक प्रिंट।", price: 2999, sku: "SAR-032", stock: 35, fabric: "Cotton", color: "Indigo", sizes: ["Free Size"], tags: ["ajrakh", "block-print", "natural-dye"], img: "ps-32.jpg" },
    { name: "Embroidered Silk Wedding Saree", nameHi: "एम्ब्रॉइडर्ड सिल्क वेडिंग साड़ी", slug: "embroidered-silk-wedding-saree", description: "Heavy embroidered silk for the big day. Every bride's dream.", descHi: "बड़े दिन के लिए भारी कढ़ाई सिल्क। दुल्हन का सपना।", price: 24999, salePrice: 19999, sku: "SAR-033", stock: 5, isFeatured: true, fabric: "Pure Silk", color: "Red", sizes: ["Free Size"], tags: ["wedding", "bridal", "embroidered", "premium"], img: "ps-33.jpg" },
    { name: "Sambalpuri Ikat Saree", nameHi: "संबलपुरी इकत साड़ी", slug: "sambalpuri-ikat-saree", description: "Handwoven Sambalpuri ikat from Odisha. Traditional tie-dye.", descHi: "ओडिशा से संबलपुरी इकत। पारंपरिक।", price: 4999, sku: "SAR-034", stock: 16, fabric: "Cotton Silk", color: "Red", sizes: ["Free Size"], tags: ["sambalpuri", "ikat", "odisha"], img: "ps-34.jpg" },
    { name: "Brocade Heavy Saree", nameHi: "ब्रोकेड हैवी साड़ी", slug: "brocade-heavy-saree", description: "Rich brocade with raised patterns. Regal and magnificent.", descHi: "उठे पैटर्न के साथ रिच ब्रोकेड। शाही।", price: 8499, salePrice: 6999, sku: "SAR-035", stock: 10, fabric: "Brocade", color: "Gold", sizes: ["Free Size"], tags: ["brocade", "heavy", "regal"], img: "ps-35.jpg" },
    { name: "Khadi Cotton Saree", nameHi: "खादी कॉटन साड़ी", slug: "khadi-cotton-saree", description: "Handspun khadi cotton. Sustainable and elegantly simple.", descHi: "हैंडस्पन खादी कॉटन। सस्टेनेबल।", price: 1999, sku: "SAR-036", stock: 50, fabric: "Khadi", color: "Natural", sizes: ["Free Size"], tags: ["khadi", "sustainable", "simple"], img: "ps-36.jpg" },
    { name: "Designer Ruffle Saree", nameHi: "डिज़ाइनर रफल साड़ी", slug: "designer-ruffle-saree", description: "Modern ruffle border in georgette. Trendy and Instagram-worthy.", descHi: "जॉर्जेट में रफल बॉर्डर। ट्रेंडी।", price: 3499, salePrice: 2799, sku: "SAR-037", stock: 30, fabric: "Georgette", color: "Lavender", sizes: ["Free Size"], tags: ["ruffle", "designer", "trendy"], img: "ps-37.jpg" },
    { name: "Bomkai Silk Saree", nameHi: "बोमकाई सिल्क साड़ी", slug: "bomkai-silk-saree", description: "Traditional Bomkai silk from Odisha with tribal motifs.", descHi: "ओडिशा से बोमकाई सिल्क। जनजातीय मोटिफ।", price: 7499, sku: "SAR-038", stock: 8, fabric: "Silk", color: "Maroon", sizes: ["Free Size"], tags: ["bomkai", "tribal", "odisha"], img: "ps-38.jpg" },
    { name: "Net Embroidered Saree", nameHi: "नेट एम्ब्रॉइडर्ड साड़ी", slug: "net-embroidered-saree-beige", description: "Elegant beige net with all-over embroidery. Sophisticated party wear.", descHi: "ऑल-ओवर कढ़ाई के साथ बेज नेट। पार्टी वियर।", price: 5499, salePrice: 4499, sku: "SAR-039", stock: 20, fabric: "Net", color: "Beige", sizes: ["Free Size"], tags: ["net", "embroidered", "party"], img: "ps-39.jpg" },
    { name: "Grey Glamour Net Saree", nameHi: "ग्रे ग्लैमर नेट साड़ी", slug: "grey-glamour-net-saree", description: "Sophisticated grey net with silver embroidery. Modern elegance.", descHi: "सिल्वर कढ़ाई के साथ ग्रे नेट। आधुनिक सुंदरता।", price: 4999, salePrice: 3999, sku: "SAR-040", stock: 15, fabric: "Net", color: "Grey", sizes: ["Free Size"], tags: ["grey", "net", "silver"], img: "ps-40.jpg" },
    { name: "Silk Blend Ethnic Saree", nameHi: "सिल्क ब्लेंड एथनिक साड़ी", slug: "silk-blend-ethnic-saree", description: "Silk blend with ethnic motifs and rich border. Traditional charm.", descHi: "एथनिक मोटिफ और रिच बॉर्डर। पारंपरिक।", price: 3799, sku: "SAR-041", stock: 25, fabric: "Silk Blend", color: "Beige", sizes: ["Free Size"], tags: ["silk-blend", "ethnic", "traditional"], img: "ps-41.jpg" },
    { name: "White Embroidered Net Saree", nameHi: "सफेद एम्ब्रॉइडर्ड नेट साड़ी", slug: "white-embroidered-net-saree", description: "Pristine white net with delicate embroidery. Graceful and pure.", descHi: "नाजुक कढ़ाई के साथ सफेद नेट। सुंदर।", price: 4299, salePrice: 3499, sku: "SAR-042", stock: 18, fabric: "Net", color: "White", sizes: ["Free Size"], tags: ["white", "net", "embroidered"], img: "ps-42.jpg" },
    { name: "Mustard Red Ethnic Saree", nameHi: "मस्टर्ड रेड एथनिक साड़ी", slug: "mustard-red-ethnic-saree", description: "Vibrant mustard and red with ethnic motifs. Festive statement.", descHi: "एथनिक मोटिफ। उत्सवी स्टेटमेंट।", price: 3599, salePrice: 2899, sku: "SAR-043", stock: 22, fabric: "Silk Blend", color: "Mustard", sizes: ["Free Size"], tags: ["mustard", "festive", "ethnic"], img: "ps-43.jpg" },
    { name: "Maroon Net Bridal Saree", nameHi: "मैरून नेट ब्राइडल साड़ी", slug: "maroon-net-bridal-saree", description: "Stunning maroon net bridal with heavy embroidery. Wedding masterpiece.", descHi: "भारी कढ़ाई के साथ मैरून नेट ब्राइडल। वेडिंग मास्टरपीस।", price: 16999, salePrice: 13999, sku: "SAR-044", stock: 6, isFeatured: true, fabric: "Net", color: "Maroon", sizes: ["Free Size"], tags: ["bridal", "net", "wedding", "premium"], img: "ps-44.jpg" },
  ];

  // Create all kurti products with images
  let kurtiCount = 0;
  for (const { img, ...product } of kurtiProducts) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: { ...product, categoryId: kurtis.id },
    });
    await prisma.productImage.upsert({
      where: { id: `img-${product.sku}` },
      update: {},
      create: {
        id: `img-${product.sku}`,
        productId: created.id,
        url: `/images/products/kurtis/${img}`,
        altText: product.name,
        isPrimary: true,
        sortOrder: 0,
      },
    });
    kurtiCount++;
  }

  // Create all saree products with images
  let sareeCount = 0;
  for (const { img, ...product } of sareeProducts) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: { ...product, categoryId: sarees.id },
    });
    await prisma.productImage.upsert({
      where: { id: `img-${product.sku}` },
      update: {},
      create: {
        id: `img-${product.sku}`,
        productId: created.id,
        url: `/images/products/sarees/${img}`,
        altText: product.name,
        isPrimary: true,
        sortOrder: 0,
      },
    });
    sareeCount++;
  }

  console.log("✅ Seeding complete!");
  console.log(`   Admin: ${admin.email}`);
  console.log(`   Categories: ${kurtis.name}, ${sarees.name}`);
  console.log(`   Kurtis: ${kurtiCount} products`);
  console.log(`   Sarees: ${sareeCount} products`);
  console.log(`   Total: ${kurtiCount + sareeCount} products with images`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
