import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, CheckCircle, Truck, RefreshCw, Package, ArrowRight, Settings, Plus, Trash2, Edit2, Save, Image as ImageIcon, ShoppingCart, Minus, Award, Star, ShieldCheck, Search, Users, FileText, Download, Calendar, Camera, Lock, LogOut, Upload, FolderOpen, ExternalLink, MessageCircle, Share2, CalendarSearch, FileSearch, Hash, ToggleLeft, ToggleRight, DollarSign } from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Logo } from './components/Logo';
import { ChatWidget } from './components/ChatWidget';
import { Product, CartItem, SectionId, Customer, Order } from './types';

// Initial Mock Data with Prices
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Kit Desechables Fiesta",
    category: "Desechables",
    description: "Combo completo: Vasos, platos y cubiertos. Ideal para eventos y negocios de comida rápida.",
    imageUrl: "https://images.unsplash.com/photo-1533777324565-a040eb52facd?auto=format&fit=crop&q=80&w=800",
    price: 12500,
    wholesalePrice: 10500
  },
  {
    id: 2,
    title: "Vasos Plásticos VBC",
    category: "Desechables",
    description: "Vasos transparentes de alta resistencia. Paquetes x 50 unidades. Disponibles en 7oz, 10oz y 12oz.",
    imageUrl: "https://images.unsplash.com/photo-1615486511484-92e590508a68?auto=format&fit=crop&q=80&w=800",
    price: 4500,
    wholesalePrice: 3800
  },
  {
    id: 3,
    title: "Bolsas Camiseta VBC",
    category: "Bolsas VBC",
    description: "Paquete de bolsas plásticas tipo camiseta. Máxima resistencia para mercado y comercio.",
    imageUrl: "https://images.unsplash.com/photo-1628131367098-6e7e1088c279?auto=format&fit=crop&q=80&w=800",
    price: 8000,
    wholesalePrice: 6500
  },
  {
    id: 4,
    title: "Platos y Contenedores",
    category: "Desechables",
    description: "Variedad de platos y contenedores de icopor y biodegradables para domicilios.",
    imageUrl: "https://images.unsplash.com/photo-1585514697204-749e7b28292f?auto=format&fit=crop&q=80&w=800",
    price: 3500,
    wholesalePrice: 2900
  },
  {
    id: 5,
    title: "Cubiertos Plásticos",
    category: "Desechables",
    description: "Cucharas, tenedores y cuchillos. Material resistente, paquetes por 20 y 50 unidades.",
    imageUrl: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=800",
    price: 2500,
    wholesalePrice: 1800
  },
  {
    id: 6,
    title: "Servilletas Familia",
    category: "Aseo y Limpieza",
    description: "Servilletas dobladas marca Familia. Suavidad y absorción superior para mesas y barras.",
    imageUrl: "https://images.unsplash.com/photo-1628157577573-047b30188c1b?auto=format&fit=crop&q=80&w=800",
    price: 5500,
    wholesalePrice: 4200
  },
  {
    id: 7,
    title: "Bolsas de Basura Industriales",
    category: "Aseo y Limpieza",
    description: "Bolsas de aseo calibre grueso. Colores reglamentarios (Roja, Negra, Blanca, Verde) para reciclaje.",
    imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d56?auto=format&fit=crop&q=80&w=800",
    price: 15000,
    wholesalePrice: 12500
  },
  {
    id: 8,
    title: "Pitillos Individuales",
    category: "Desechables",
    description: "Pitillos con empaque individual para mayor higiene. Disponibles en varios tamaños.",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
    price: 3000,
    wholesalePrice: 2200
  }
];

const FEATURES = [
  {
    icon: <Truck className="w-6 h-6 text-aurora-500" />,
    title: "Distribución Nacional",
    desc: "Llegamos a todos los rincones del país con flota propia."
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-aurora-500" />,
    title: "Compromiso Eco",
    desc: "Promovemos el uso de materiales biodegradables y reciclables."
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-aurora-500" />,
    title: "Calidad Certificada",
    desc: "Productos que cumplen con los más altos estándares de higiene."
  }
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Product State Management
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Auth State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const [adminTab, setAdminTab] = useState<'products' | 'customers'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Static Images State (Editable)
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1628131367098-6e7e1088c279?auto=format&fit=crop&q=80&w=1200");
  const [aboutImage, setAboutImage] = useState("https://images.unsplash.com/photo-1615486511484-92e590508a68?auto=format&fit=crop&q=80&w=800");

  // Simple Image Edit Modal State
  const [imageModal, setImageModal] = useState<{ isOpen: boolean, url: string, onSave: (url: string) => void } | null>(null);

  // Product Filtering and Sorting
  const [searchTerm, setSearchTerm] = useState('');
  
  // Quantity Selection per Product Card
  const [cardQuantities, setCardQuantities] = useState<{[key: number]: number}>({});

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Customer Management State
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('aurora_customers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  
  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState('');

  // Order Lookup Modal State
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [foundOrders, setFoundOrders] = useState<{order: Order, customer: Customer}[]>([]);

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    documentId: '',
    phone: '',
    email: '',
    address: ''
  });

  // Form State for Product
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    category: '',
    description: '',
    price: 0,
    wholesalePrice: 0,
    imageUrl: ''
  });

  const WHATSAPP_NUMBER = "573176260984";
  const COMPANY_PHONE = "317 626 0984";
  const COMPANY_EMAIL = "distriaurora2@hotmail.com";
  const COMPANY_ADDRESS = "Carrera 17D # 58-94";
  const COMPANY_CITY = "Barrio Ricaurte, Bucaramanga";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save customers to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem('aurora_customers', JSON.stringify(customers));
  }, [customers]);

  const scrollTo = (id: SectionId) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Auth Logic
  const handleAdminButtonClick = () => {
    if (isAdminMode) {
        setIsAdminMode(false); // Logout
        setIsMenuOpen(false);
    } else {
        setShowLoginModal(true); // Show Login
        setIsMenuOpen(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === '123456789') {
        setIsAdminMode(true);
        setShowLoginModal(false);
        setLoginForm({ username: '', password: '' }); // Clear credentials
        alert("¡Bienvenido al Panel de Administración!");
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
  };

  // Card Quantity Helper
  const getCardQuantity = (id: number) => cardQuantities[id] || 1;
  const updateCardQuantity = (id: number, delta: number) => {
    setCardQuantities(prev => {
      const current = prev[id] || 1;
      const newQty = Math.max(1, current + delta);
      return { ...prev, [id]: newQty };
    });
  };

  // Cart Operations
  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      }
      // Initialize with Retail price by default
      return [...prev, { ...product, quantity: quantityToAdd, selectedPriceType: 'retail' }];
    });
    // Reset the card quantity back to 1
    setCardQuantities(prev => ({ ...prev, [product.id]: 1 }));
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const setCartItemPriceType = (id: number, type: 'retail' | 'wholesale') => {
    setCart(prev => prev.map(item => {
        if (item.id === id) {
            return {
                ...item,
                selectedPriceType: type
            };
        }
        return item;
    }));
  };

  // Helper to get the actual price based on selection
  const getItemPrice = (item: CartItem) => {
    return item.selectedPriceType === 'wholesale' ? item.wholesalePrice : item.price;
  };

  const cartTotal = cart.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  // Helper to open simple image edit modal
  const openImageEdit = (currentUrl: string, onSave: (newUrl: string) => void) => {
    setImageModal({ isOpen: true, url: currentUrl, onSave });
  };

  // Helper to handle file upload from PC
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                setUrl(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
    }
  };

  // Order Search Logic
  const handleSearchOrders = (query: string) => {
    if (!query) {
        setFoundOrders([]);
        return;
    }
    const results: {order: Order, customer: Customer}[] = [];
    const lowerQuery = query.toLowerCase().trim();

    customers.forEach(customer => {
        customer.orders.forEach(order => {
            // Match Order ID (case insensitive)
            if (order.id.toLowerCase().includes(lowerQuery)) {
                results.push({ order, customer });
            }
        });
    });
    // Sort by date descending
    results.sort((a, b) => new Date(b.order.date).getTime() - new Date(a.order.date).getTime());
    setFoundOrders(results);
  };

  // PDF Generation Logic (Returns doc for manipulation or Blob for sharing)
  const createPDFDocument = (invoiceNumber: string, existingOrder?: Order, existingCustomer?: Customer) => {
    const doc = new jsPDF();
    
    // Determine data source (Current cart or historical order)
    const itemsToPrint = existingOrder ? existingOrder.items : cart;
    const totalToPrint = existingOrder ? existingOrder.total : cartTotal;
    const customerToPrint = existingCustomer ? 
        { name: existingCustomer.name, documentId: existingCustomer.documentId, phone: existingCustomer.phone, address: existingCustomer.address, email: existingCustomer.email } 
        : checkoutForm;

    // Header Background
    doc.setFillColor(249, 115, 22); // Orange Aurora
    doc.rect(0, 0, 210, 40, 'F');
    
    // Logo Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("DISTRIBUIDORA AURORA SAS", 14, 20);
    doc.setFontSize(10);
    doc.text("Suministros de Plásticos y Desechables para su Negocio", 14, 28);
    
    // Invoice Info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`FACTURA DE VENTA`, 150, 20);
    doc.setFontSize(14);
    doc.text(`# ${invoiceNumber}`, 150, 28);
    
    // Reset text color for body
    doc.setTextColor(40, 40, 40);
    
    // Company Details
    doc.setFontSize(9);
    doc.text("NIT: 900.123.456-7", 14, 50);
    doc.text(`${COMPANY_ADDRESS}, ${COMPANY_CITY}`, 14, 55);
    doc.text(`Tel: ${COMPANY_PHONE}`, 14, 60);
    doc.text(`Email: ${COMPANY_EMAIL}`, 14, 65);
    
    // Customer Details Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(120, 45, 80, 35, 2, 2, 'FD');
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Cliente:", 125, 52);
    doc.setFont("helvetica", "normal");
    doc.text(customerToPrint.name || 'Consumidor Final', 125, 58);
    doc.text(customerToPrint.documentId || '', 125, 63);
    doc.text(customerToPrint.phone || '', 125, 68);
    doc.text(customerToPrint.address || '', 125, 73);

    // Date
    const orderDate = existingOrder ? new Date(existingOrder.date).toLocaleDateString() : new Date().toLocaleDateString();
    doc.text(`Fecha: ${orderDate}`, 14, 85);

    // Product Table
    const tableColumn = ["Producto", "Tipo Precio", "Cant", "Precio Unit", "Subtotal"];
    const tableRows: any[] = [];

    itemsToPrint.forEach(item => {
      // Logic to handle both old orders (without selectedPriceType) and new ones
      const priceType = item.selectedPriceType === 'wholesale' ? 'Mayorista' : 'Detal';
      const unitPrice = item.selectedPriceType === 'wholesale' ? item.wholesalePrice : item.price;
      
      const itemData = [
        item.title,
        priceType,
        item.quantity,
        formatPrice(unitPrice),
        formatPrice(unitPrice * item.quantity)
      ];
      tableRows.push(itemData);
    });

    // @ts-ignore
    autoTable(doc, {
      startY: 90,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [249, 115, 22], textColor: 255 },
      styles: { fontSize: 10 },
    });

    // Total
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL A PAGAR: ${formatPrice(totalToPrint)}`, 130, finalY);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Gracias por su compra. Somos distribuidores directos VBC.", 14, finalY + 20);
    
    return doc;
  };

  const handleFinalizeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Generate Invoice Number & Order
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
        id: invoiceNumber,
        date: new Date().toISOString(),
        items: [...cart],
        total: cartTotal
    };

    // 2. Prepare WhatsApp Text (Full Backup)
    const itemsList = cart.map(item => {
        const unitPrice = getItemPrice(item);
        const type = item.selectedPriceType === 'wholesale' ? '(Mayor)' : '(Detal)';
        return `▪️ ${item.title} ${type} (x${item.quantity}) - ${formatPrice(unitPrice * item.quantity)}`;
    }).join('%0A');

    const text = `🧾 *ORDEN DE COMPRA - DISTRIBUIDORA AURORA*%0A` +
                 `🗓️ *Fecha:* ${new Date().toLocaleDateString()}%0A` +
                 `📄 *Factura No:* ${invoiceNumber}%0A%0A` +
                 `👤 *DATOS DEL CLIENTE:*%0A` +
                 `Nombre: ${checkoutForm.name}%0A` +
                 `NIT/CC: ${checkoutForm.documentId}%0A` +
                 `Tel: ${checkoutForm.phone}%0A` +
                 `Dir: ${checkoutForm.address}%0A%0A` +
                 `🛒 *DETALLE DEL PEDIDO:*%0A` +
                 itemsList + 
                 `%0A%0A💰 *TOTAL A PAGAR: ${formatPrice(cartTotal)}*%0A%0A` +
                 `✅ *NOTA:* Acabo de generar este pedido en la web. Adjunto PDF si es necesario.`;

    // 3. Save to History (LocalStorage happens via useEffect)
    setCustomers(prev => {
        const existingIndex = prev.findIndex(c => c.phone === checkoutForm.phone || c.email === checkoutForm.email);
        const newCustomers = [...prev];
        if (existingIndex >= 0) {
            const existing = newCustomers[existingIndex];
            newCustomers[existingIndex] = {
                ...existing,
                name: checkoutForm.name,
                address: checkoutForm.address,
                orders: [...existing.orders, newOrder],
                lastPurchaseDate: newOrder.date
            };
        } else {
            newCustomers.push({
                id: checkoutForm.phone,
                ...checkoutForm,
                orders: [newOrder],
                firstPurchaseDate: newOrder.date,
                lastPurchaseDate: newOrder.date
            });
        }
        return newCustomers;
    });

    // 4. Download PDF
    const doc = createPDFDocument(invoiceNumber);
    doc.save(`Factura_Aurora_${invoiceNumber}.pdf`);
    
    // 5. Update UI States
    setCurrentInvoiceNumber(invoiceNumber);
    setWhatsappMessage(text);
    setShowCheckoutModal(false);

    // 6. AUTOMATICALLY Open WhatsApp after brief delay (to allow PDF download to start)
    setTimeout(() => {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
        window.open(url, '_blank');
        
        // Only clear cart after sending is triggered
        setCart([]);
        setCheckoutForm({ name: '', documentId: '', phone: '', email: '', address: '' });
    }, 1500);

    // Show modal as guidance/backup
    setShowSuccessModal(true);
  };

  const confirmWhatsAppSend = async () => {
    // Attempt Web Share API first (Mobile Native Share)
    if (navigator.share) {
        try {
            const doc = createPDFDocument(currentInvoiceNumber);
            const pdfBlob = doc.output('blob');
            const file = new File([pdfBlob], `Factura_${currentInvoiceNumber}.pdf`, { type: 'application/pdf' });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Factura Distribuidora Aurora',
                    text: whatsappMessage.replace(/%0A/g, '\n'), // Convert encoded breaks back for native share
                });
                return;
            }
        } catch (error) {
            console.log("Error sharing file:", error);
        }
    }

    // Fallback: Open WhatsApp with text (Backup button action)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, '_blank');
  };

  const handleCheckoutClick = () => {
    setShowCheckoutModal(true);
    setIsCartOpen(false); // Close sidebar, open modal
  };

  // CRUD Operations
  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        category: 'Desechables',
        description: '',
        price: 0,
        wholesalePrice: 0,
        imageUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 500)}/800/600` // Random default image
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Update existing
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } as Product : p));
    } else {
      // Create new
      const newProduct = {
        ...formData,
        id: Date.now(),
      } as Product;
      setProducts(prev => [newProduct, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Filter and Sort Products
  const filteredProducts = products
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Logo />
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: 'Inicio', id: SectionId.HOME },
              { label: 'Nosotros', id: SectionId.ABOUT },
              { label: 'Productos', id: SectionId.PRODUCTS },
              { label: 'Contacto', id: SectionId.CONTACT },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-sm font-bold uppercase tracking-wide hover:text-aurora-600 transition-colors ${
                  scrolled ? 'text-slate-700' : 'text-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <button 
              onClick={handleAdminButtonClick}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 ${isAdminMode ? 'bg-aurora-500 text-white shadow-lg px-3' : 'text-slate-400 hover:text-slate-600'}`}
              title={isAdminMode ? "Cerrar Sesión Admin" : "Iniciar Sesión Admin"}
            >
              {isAdminMode ? <LogOut className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
              {isAdminMode && <span className="text-xs font-bold">Salir</span>}
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative group p-3 bg-aurora-600 rounded-full hover:bg-aurora-500 transition-all text-white shadow-lg shadow-aurora-500/30 hover:scale-105"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-xs flex items-center justify-center rounded-full font-bold border-2 border-white">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>

            <button 
              onClick={() => scrollTo(SectionId.CONTACT)}
              className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-aurora-600 transition-colors shadow-lg shadow-aurora-500/10"
            >
              Cotizar
            </button>
          </nav>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-aurora-600 text-white rounded-full shadow-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold border border-white">
                  {cart.length}
                </span>
              )}
            </button>
            <button 
              className="p-2 text-slate-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" onClick={() => setIsCartOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
            <div className="p-5 bg-aurora-500 text-white border-b border-aurora-600 flex justify-between items-center shadow-md">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                Carrito de Compras
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-slate-300" />
                  </div>
                  <p className="font-medium text-lg">Tu carrito está vacío</p>
                  <button onClick={() => { setIsCartOpen(false); scrollTo(SectionId.PRODUCTS); }} className="text-aurora-600 font-bold hover:underline">
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow relative">
                    <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-lg bg-gray-100 border border-gray-200" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 line-clamp-1 text-sm md:text-base">{item.title}</h4>
                        <div className="flex flex-col mt-2">
                            <span className="text-aurora-600 font-bold text-lg leading-none">
                                {formatPrice(getItemPrice(item))} 
                                <span className="text-[10px] text-gray-500 font-normal ml-1">c/u</span>
                            </span>
                            
                            {/* SEPARATE PRICE BUTTONS */}
                            <div className="flex items-center gap-2 mt-2">
                                <button 
                                    onClick={() => setCartItemPriceType(item.id, 'retail')}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all flex items-center gap-1 ${
                                        item.selectedPriceType === 'retail' 
                                        ? 'bg-blue-50 text-blue-700 border-blue-500 shadow-sm' 
                                        : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${item.selectedPriceType === 'retail' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                    DETAL
                                </button>

                                <button 
                                    onClick={() => setCartItemPriceType(item.id, 'wholesale')}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all flex items-center gap-1 ${
                                        item.selectedPriceType === 'wholesale' 
                                        ? 'bg-orange-50 text-orange-700 border-orange-500 shadow-sm' 
                                        : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${item.selectedPriceType === 'wholesale' ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
                                    MAYOR
                                </button>
                            </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 border border-gray-200">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md text-slate-600 transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-8 text-center text-slate-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md text-slate-600 transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors absolute top-2 right-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex justify-between items-center text-slate-600 text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-slate-900 font-bold text-lg">Total a Pagar</span>
                    <span className="text-3xl font-black text-slate-900">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
                
                {/* Continue Shopping Button */}
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    scrollTo(SectionId.PRODUCTS);
                  }}
                  className="w-full bg-white text-aurora-600 border border-aurora-600 py-3 rounded-xl font-bold mb-3 hover:bg-aurora-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Seguir Agregando Productos
                </button>

                <button 
                  onClick={handleCheckoutClick}
                  className="w-full bg-aurora-600 hover:bg-aurora-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
                >
                  <FileText className="w-6 h-6" /> Finalizar Pedido
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout Info Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
               <div className="bg-aurora-500 p-6 text-white flex justify-between items-center">
                   <h3 className="font-bold text-xl flex items-center gap-2">
                       <FileText className="w-6 h-6" />
                       Datos de Facturación
                   </h3>
                   <button onClick={() => setShowCheckoutModal(false)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-5 h-5"/></button>
               </div>
               <form onSubmit={handleFinalizeOrder} className="p-6 space-y-4">
                   <p className="text-sm text-gray-500 mb-4">Complete sus datos para generar la factura automática y proceder con el pedido por WhatsApp.</p>
                   
                   <div>
                       <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nombre Completo / Razón Social</label>
                       <input 
                        required 
                        type="text" 
                        value={checkoutForm.name}
                        onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none"
                        placeholder="Ej: Distribuciones SAS"
                       />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">NIT o Cédula</label>
                            <input 
                                required 
                                type="text" 
                                value={checkoutForm.documentId}
                                onChange={e => setCheckoutForm({...checkoutForm, documentId: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none"
                                placeholder="900123456"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Teléfono / WhatsApp</label>
                            <input 
                                required 
                                type="tel" 
                                value={checkoutForm.phone}
                                onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none"
                                placeholder="310..."
                            />
                        </div>
                   </div>

                   <div>
                       <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Correo Electrónico</label>
                       <input 
                        required 
                        type="email" 
                        value={checkoutForm.email}
                        onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none"
                        placeholder="email@ejemplo.com"
                       />
                   </div>

                   <div>
                       <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Dirección de Envío</label>
                       <input 
                        required 
                        type="text" 
                        value={checkoutForm.address}
                        onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none"
                        placeholder="Dirección completa"
                       />
                   </div>
                   
                   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800 flex gap-2 items-start mt-2">
                      <div className="mt-0.5 font-bold">⚠️</div>
                      <p>Al hacer clic, se descargará el PDF y se abrirá WhatsApp con el pedido escrito automáticamente.</p>
                   </div>

                   <button type="submit" className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 mt-2">
                        <Download className="w-5 h-5" />
                        Generar y Enviar Pedido
                   </button>
               </form>
           </div>
        </div>
      )}

      {/* Success Modal - PDF Attachment Instruction */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 text-center p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-in zoom-in delay-150 duration-500">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">¡Pedido Generado!</h3>
            <p className="text-slate-600 mb-6">
              La factura <strong>#{currentInvoiceNumber}</strong> se ha guardado y el chat de WhatsApp se abrirá automáticamente.
            </p>
            
            <div className="bg-aurora-50 border border-aurora-100 p-5 rounded-2xl mb-6 text-left shadow-sm">
              <p className="text-sm font-bold text-aurora-700 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-aurora-500 text-white flex items-center justify-center text-xs shadow">1</span>
                Siguiente Paso:
              </p>
              <p className="text-sm text-slate-700 pl-8 leading-relaxed">
                Si el chat no se abrió automáticamente, pulsa el botón de abajo. Recuerda adjuntar el PDF si lo deseas (el texto ya está incluido).
              </p>
            </div>

            <button 
              onClick={confirmWhatsAppSend}
              className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-[#25D366]/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-6 h-6 fill-current" />
              Reintentar Enviar WhatsApp
            </button>
            
            <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-4 text-slate-500 text-sm hover:underline"
            >
                Cerrar y volver a la tienda
            </button>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-slate-900 p-6 text-white text-center">
                    <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-aurora-400" />
                    </div>
                    <h3 className="font-bold text-xl">Acceso Administrativo</h3>
                    <p className="text-slate-400 text-sm mt-1">Ingresa tus credenciales para gestionar productos</p>
                </div>
                
                <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Usuario</label>
                        <input 
                            type="text" 
                            autoFocus
                            value={loginForm.username}
                            onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none bg-gray-50"
                            placeholder="Usuario"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Contraseña</label>
                        <input 
                            type="password" 
                            value={loginForm.password}
                            onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none bg-gray-50"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-aurora-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-aurora-700 transition-colors mt-2"
                    >
                        Ingresar
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => setShowLoginModal(false)}
                        className="w-full text-slate-500 font-bold py-3 hover:text-slate-800 transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-[#25D366]/40 hover:scale-110 transition-all duration-300"
        title="Contactar por WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <Phone className="w-7 h-7 fill-current" />
      </a>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-30 bg-white/95 backdrop-blur-xl transition-transform duration-300 md:hidden flex flex-col items-center justify-center gap-8 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <Logo className="scale-110 mb-8" />
        {[
          { label: 'Inicio', id: SectionId.HOME },
          { label: 'Nosotros', id: SectionId.ABOUT },
          { label: 'Productos', id: SectionId.PRODUCTS },
          { label: 'Contacto', id: SectionId.CONTACT },
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="text-xl font-bold text-slate-800 hover:text-aurora-600"
          >
            {item.label}
          </button>
        ))}
         <button 
            onClick={handleAdminButtonClick}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg ${isAdminMode ? 'bg-red-100 text-red-700' : 'text-slate-500 bg-gray-100'}`}
          >
            {isAdminMode ? <LogOut className="w-4 h-4" /> : <Lock className="w-4 h-4" />} 
            {isAdminMode ? 'Cerrar Sesión' : 'Acceso Admin'}
          </button>
      </div>

      {/* Hero Section */}
      <section id={SectionId.HOME} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-slate-50 skew-x-[-15deg] translate-x-32 z-0"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-aurora-50/50 rounded-tr-[100px] z-0"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aurora-100 text-aurora-700 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-aurora-500 animate-pulse"></span>
              Líderes en el Mercado
            </div>
            
            {/* VBC Distinction Badge - Desktop Placement */}
            <div className="hidden md:inline-flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 p-2 pr-6 rounded-xl border border-slate-700 shadow-xl mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-red-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-black shadow-inner">
                VBC
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold uppercase tracking-wide">Distribuidor Directo</span>
                <span className="text-gray-300 text-[10px] flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  La mejor marca en calidad
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Suministros de <br/>
              <span className="text-aurora-600">Plásticos y Desechables</span> <br/>
              para su Negocio
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg border-l-4 border-aurora-200 pl-4">
              Distribuidora Aurora SAS ofrece soluciones integrales en materias primas, empaques y logística para potenciar su producción y ventas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 flex-wrap">
              <button 
                onClick={() => scrollTo(SectionId.PRODUCTS)}
                className="inline-flex items-center justify-center gap-2 bg-aurora-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-aurora-700 transition-all shadow-xl shadow-aurora-600/20"
              >
                Ver Catálogo
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollTo(SectionId.CONTACT)}
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 border-2 border-slate-900 px-8 py-4 rounded-lg font-bold hover:bg-slate-900 hover:text-white transition-all"
              >
                Contactar Asesor
              </button>
              
              {/* NEW ORDER LOOKUP BUTTON */}
              <button 
                onClick={() => setIsLookupOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 border-2 border-slate-200 px-6 py-4 rounded-lg font-bold hover:bg-slate-200 transition-all"
              >
                <FileSearch className="w-5 h-5" />
                Consultar Pedidos
              </button>
            </div>
          </div>
          <div className="relative">
             {/* VBC Distinction Badge - Mobile Overlay */}
            <div className="md:hidden absolute -top-6 left-4 right-4 z-20 flex items-center gap-3 bg-slate-900 p-2 pr-6 rounded-xl border border-slate-700 shadow-xl">
              <div className="bg-red-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-black shadow-inner flex-shrink-0">
                VBC
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold uppercase tracking-wide">Distribuidor Directo</span>
                <span className="text-gray-300 text-[10px] flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  Bolsas y Vasos de Calidad
                </span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20 aspect-[4/3] group border-4 border-white mt-8 md:mt-0">
              <img 
                src={heroImage}
                alt="Productos Desechables y Empaques" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-transparent pointer-events-none"></div>
              
              {/* Admin Image Edit Button */}
              {isAdminMode && (
                <button 
                  onClick={() => openImageEdit(heroImage, setHeroImage)}
                  className="absolute top-4 right-4 z-30 bg-white text-slate-900 p-3 rounded-full shadow-xl hover:bg-aurora-500 hover:text-white transition-all group/edit"
                  title="Cambiar Imagen"
                >
                  <Camera className="w-6 h-6" />
                </button>
              )}
            </div>
            {/* Stats Card */}
            <div className="absolute -bottom-10 -left-6 bg-slate-900 text-white p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Package className="w-8 h-8 text-aurora-400" />
                </div>
                <div>
                  <p className="text-3xl font-black">+500</p>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Referencias Disponibles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <div className="bg-slate-50 border-y border-slate-200 py-12">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="p-4 bg-aurora-50 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section id={SectionId.ABOUT} className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-aurora-100 transform rotate-3 rounded-3xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-lg transform -rotate-3 transition-transform hover:rotate-0 duration-500 bg-gray-100">
                <img 
                  src={aboutImage}
                  alt="Team" 
                  className="w-full h-full object-cover aspect-[4/3]" 
                />
                 {/* Admin Image Edit Button */}
                 {isAdminMode && (
                    <button 
                      onClick={() => openImageEdit(aboutImage, setAboutImage)}
                      className="absolute top-4 right-4 z-30 bg-white text-slate-900 p-3 rounded-full shadow-xl hover:bg-aurora-500 hover:text-white transition-all"
                      title="Cambiar Imagen"
                    >
                      <Camera className="w-6 h-6" />
                    </button>
                  )}
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <span className="text-aurora-600 font-black uppercase tracking-widest text-sm">Nuestra Empresa</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Eficiencia y <span className="text-aurora-600">Confianza</span> en cada entrega
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                En <strong>DISTRIBUIDORA AURORA SAS</strong>, nos especializamos en conectar la industria nacional con los mejores insumos del mercado. Nuestra trayectoria nos avala como un socio estratégico confiable.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {["Stock Permanente", "Envíos a todo el país", "Precios Competitivos", "Asesoría Técnica"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-aurora-500 flex-shrink-0" />
                    <span className="font-semibold text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id={SectionId.PRODUCTS} className="py-24 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          {/* Section Header & Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
            <div className="max-w-2xl">
              <span className="text-aurora-400 font-bold uppercase tracking-wider text-sm mb-2 block">Catálogo 2024</span>
              <h2 className="text-3xl md:text-4xl font-black text-white">Nuestros Productos</h2>
              <p className="text-slate-400 mt-4 text-lg">Soluciones especializadas para diferentes sectores industriales. Calidad garantizada en cada referencia.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search Bar */}
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-aurora-500 focus:ring-1 focus:ring-aurora-500 sm:text-sm transition-all"
                    />
                </div>

                <button 
                    onClick={handleAdminButtonClick}
                    className={`px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors border ${
                        isAdminMode 
                        ? 'bg-aurora-500 text-white border-aurora-500 shadow-lg shadow-aurora-500/20' 
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                >
                    {isAdminMode ? <LogOut className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                    {isAdminMode ? 'Cerrar Sesión' : 'Acceso Admin'}
                </button>
                
                {isAdminMode && (
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20 animate-in fade-in slide-in-from-right"
                    >
                        <Plus className="w-5 h-5" /> Nuevo
                    </button>
                )}
            </div>
          </div>

          {/* Admin Tabs */}
          {isAdminMode && (
            <div className="flex gap-4 mb-8 border-b border-slate-700">
                <button 
                    onClick={() => setAdminTab('products')} 
                    className={`pb-3 px-2 font-bold transition-colors ${adminTab === 'products' ? 'text-aurora-400 border-b-2 border-aurora-400' : 'text-slate-500 hover:text-white'}`}
                >
                    Gestión de Productos
                </button>
                <button 
                    onClick={() => setAdminTab('customers')} 
                    className={`pb-3 px-2 font-bold transition-colors flex items-center gap-2 ${adminTab === 'customers' ? 'text-aurora-400 border-b-2 border-aurora-400' : 'text-slate-500 hover:text-white'}`}
                >
                    <Users className="w-4 h-4" /> Gestión de Clientes
                </button>
            </div>
          )}

          {/* Products Grid */}
          {(!isAdminMode || adminTab === 'products') && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-xl font-medium">No se encontraron productos con "{searchTerm}"</p>
                        <button onClick={() => setSearchTerm('')} className="mt-4 text-aurora-400 hover:underline">Limpiar búsqueda</button>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                    <div key={product.id} className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 group flex flex-col h-full relative hover:shadow-aurora-500/10 transition-shadow">
                        <div className="h-64 overflow-hidden relative bg-slate-900 group/image">
                        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur text-xs font-bold px-3 py-1 rounded text-white border border-slate-700 z-10 uppercase tracking-wider">
                            {product.category}
                        </div>
                        
                        {isAdminMode && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm gap-2 animate-in fade-in">
                                <button 
                                onClick={(e) => { e.stopPropagation(); handleOpenModal(product); }}
                                className="px-4 py-2 bg-white text-slate-900 rounded-lg hover:scale-105 transition-transform font-bold flex items-center gap-2 shadow-xl"
                                >
                                <Edit2 className="w-4 h-4" /> Editar
                                </button>
                                <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:scale-105 transition-transform font-bold flex items-center gap-2 shadow-xl"
                                >
                                <Trash2 className="w-4 h-4" /> Borrar
                                </button>
                            </div>
                        )}
                        
                        {/* Direct Image Edit Button for Products (Top Right corner of image) */}
                        {isAdminMode && (
                             <button 
                             onClick={(e) => { 
                                 e.stopPropagation(); 
                                 openImageEdit(product.imageUrl, (newUrl) => {
                                     setProducts(prev => prev.map(p => p.id === product.id ? { ...p, imageUrl: newUrl } : p));
                                 });
                             }}
                             className="absolute top-4 right-4 z-40 bg-white/90 text-slate-900 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all group/cam"
                             title="Cambiar solo Imagen"
                             >
                             <Camera className="w-5 h-5 group-hover/cam:text-aurora-600" />
                             </button>
                        )}

                        <img 
                            src={product.imageUrl} 
                            alt={product.title} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-aurora-400 transition-colors">{product.title}</h3>
                            <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3">{product.description}</p>
                            
                            <div className="pt-4 border-t border-slate-700 mt-auto">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Precio Detal</span>
                                    <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-aurora-500 uppercase block mb-0.5">Por Mayor</span>
                                    <span className="text-lg font-bold text-aurora-400">{formatPrice(product.wholesalePrice)}</span>
                                </div>
                                </div>
                                
                                {/* Quantity and Add to Cart Section */}
                                <div className="flex gap-3">
                                    <div className="flex items-center bg-slate-900 border border-slate-600 rounded-lg overflow-hidden shrink-0">
                                        <button 
                                            onClick={() => updateCardQuantity(product.id, -1)}
                                            className="px-3 py-3 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-bold text-white select-none">
                                            {getCardQuantity(product.id)}
                                        </span>
                                        <button 
                                            onClick={() => updateCardQuantity(product.id, 1)}
                                            className="px-3 py-3 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <button 
                                    onClick={() => addToCart(product, getCardQuantity(product.id))}
                                    className="flex-1 bg-slate-700 hover:bg-aurora-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-bold text-sm"
                                    >
                                    <ShoppingCart className="w-5 h-5" />
                                    Agregar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))
                )}
            </div>
          )}

          {/* Customer Management (CRM) */}
          {isAdminMode && adminTab === 'customers' && (
             <div className="bg-white rounded-xl overflow-hidden shadow-xl animate-in fade-in">
                 <div className="overflow-x-auto">
                     <table className="w-full text-left text-slate-800">
                         <thead className="bg-slate-100 border-b border-gray-200">
                             <tr>
                                 <th className="px-6 py-4 font-bold text-sm text-slate-600">Cliente</th>
                                 <th className="px-6 py-4 font-bold text-sm text-slate-600">Contacto</th>
                                 <th className="px-6 py-4 font-bold text-sm text-slate-600">Total Compras</th>
                                 <th className="px-6 py-4 font-bold text-sm text-slate-600">Última Compra</th>
                                 <th className="px-6 py-4 font-bold text-sm text-slate-600">Periodicidad</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                             {customers.length === 0 ? (
                                 <tr>
                                     <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                         Aún no hay clientes registrados. Realiza una prueba de compra.
                                     </td>
                                 </tr>
                             ) : (
                                 customers.map((customer) => {
                                     // Calculate Frequency
                                     let periodicityText = "Nuevo Cliente";
                                     if (customer.orders.length > 1) {
                                         const first = new Date(customer.firstPurchaseDate).getTime();
                                         const last = new Date(customer.lastPurchaseDate).getTime();
                                         const diffDays = Math.ceil((last - first) / (1000 * 60 * 60 * 24));
                                         
                                         if (diffDays === 0) periodicityText = "Cliente Recurrente (Hoy)";
                                         else periodicityText = `Cada ${Math.max(1, Math.round(diffDays / (customer.orders.length - 1)))} días`;
                                     }

                                     const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);

                                     return (
                                        <tr key={customer.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{customer.name}</div>
                                                <div className="text-xs text-gray-500">{customer.documentId}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">{customer.phone}</div>
                                                <div className="text-xs text-gray-500">{customer.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-aurora-600">{formatPrice(totalSpent)}</div>
                                                <div className="text-xs text-gray-500">{customer.orders.length} pedidos</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {new Date(customer.lastPurchaseDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                                    customer.orders.length > 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    <Calendar className="w-3 h-3" />
                                                    {periodicityText}
                                                </span>
                                            </td>
                                        </tr>
                                     )
                                 })
                             )}
                         </tbody>
                     </table>
                 </div>
             </div>
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-aurora-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-black mb-6">¿Necesitas una cotización formal?</h2>
          <p className="text-aurora-100 text-lg max-w-2xl mx-auto mb-10">
            Nuestro equipo comercial está listo para brindarte la mejor oferta del mercado. Precios especiales para mayoristas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button 
                onClick={() => scrollTo(SectionId.CONTACT)}
                className="bg-white text-aurora-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-xl"
             >
               Solicitar Cotización
             </button>
             <a 
               href={`tel:${COMPANY_PHONE.replace(/\s/g,'')}`}
               className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-xl flex items-center justify-center gap-2"
              >
               <Phone className="w-5 h-5" /> Llamar Ahora
             </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id={SectionId.CONTACT} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <span className="text-aurora-600 font-bold uppercase tracking-wider text-sm">Contáctanos</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2 mb-6">Estamos a su servicio</h2>
              <p className="text-slate-600 mb-8 text-lg">
                Visítenos en nuestra sede principal o contáctenos por los medios digitales.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-3 bg-aurora-50 rounded-lg text-aurora-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Sede Principal</h4>
                    <p className="text-slate-500">{COMPANY_ADDRESS}<br/>{COMPANY_CITY}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-3 bg-aurora-50 rounded-lg text-aurora-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Líneas de Atención</h4>
                    <a href={`tel:${COMPANY_PHONE.replace(/\s/g,'')}`} className="text-slate-500 font-bold text-lg hover:text-aurora-600 transition-colors">{COMPANY_PHONE}</a>
                    <p className="text-slate-500">Atención Personalizada</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-3 bg-aurora-50 rounded-lg text-aurora-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Correo Corporativo</h4>
                    <p className="text-slate-500">{COMPANY_EMAIL}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="p-3 bg-white border border-gray-200 rounded-full text-slate-600 hover:bg-aurora-500 hover:text-white hover:border-aurora-500 transition-all">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-gray-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Formulario de Contacto</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nombre</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-500/20 focus:border-aurora-500 transition-all" placeholder="Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Teléfono</label>
                    <input type="tel" className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-500/20 focus:border-aurora-500 transition-all" placeholder={COMPANY_PHONE} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Correo Electrónico</label>
                  <input type="email" className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-500/20 focus:border-aurora-500 transition-all" placeholder="juan@empresa.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Mensaje</label>
                  <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aurora-500/20 focus:border-aurora-500 transition-all" placeholder="Estoy interesado en..."></textarea>
                </div>
                <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-aurora-600 transition-colors shadow-lg">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1 space-y-4">
              <Logo light />
              <p className="text-sm leading-relaxed">
                Empresa líder en la distribución de insumos industriales. Comprometidos con la calidad, la sostenibilidad y el servicio al cliente.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Navegación</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => scrollTo(SectionId.HOME)} className="hover:text-aurora-400 transition-colors">Inicio</button></li>
                <li><button onClick={() => scrollTo(SectionId.ABOUT)} className="hover:text-aurora-400 transition-colors">Nosotros</button></li>
                <li><button onClick={() => scrollTo(SectionId.PRODUCTS)} className="hover:text-aurora-400 transition-colors">Productos</button></li>
                <li><button onClick={() => scrollTo(SectionId.CONTACT)} className="hover:text-aurora-400 transition-colors">Contacto</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-aurora-400 transition-colors">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-aurora-400 transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-aurora-400 transition-colors">Política de Devoluciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Horario de Atención</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-slate-800 pb-2"><span>Lun - Vie:</span> <span className="text-white">8:00 AM - 6:00 PM</span></li>
                <li className="flex justify-between border-b border-slate-800 pb-2"><span>Sábados:</span> <span className="text-white">8:00 AM - 12:00 PM</span></li>
                <li className="flex justify-between pt-2"><span>Domingos:</span> <span className="text-aurora-500">Cerrado</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <p>&copy; {new Date().getFullYear()} Distribuidora Aurora SAS. Todos los derechos reservados.</p>
            <div className="flex items-center gap-2">
              <span>Diseñado con tecnología React & Gemini AI</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Management Modal (Existing) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {editingProduct ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Producto</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 focus:border-aurora-500 outline-none"
                  placeholder="Ej: Rollos de Plástico"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Categoría</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none"
                >
                    <option>Desechables</option>
                    <option>Bolsas VBC</option>
                    <option>Aseo y Limpieza</option>
                    <option>Empaques</option>
                    <option>Institucional</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Precio Detal (COP)</label>
                   <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none"
                  />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Precio Mayor (COP)</label>
                   <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.wholesalePrice}
                    onChange={e => setFormData({...formData, wholesalePrice: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Imagen del Producto</label>
                
                {/* Upload from PC */}
                <div className="mb-2">
                    <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-aurora-500 transition-colors">
                        <div className="flex flex-col items-center gap-1 text-gray-500">
                            <Upload className="w-5 h-5" />
                            <span className="text-xs font-bold">Subir desde Carpeta</span>
                        </div>
                        <input 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, (url) => setFormData({...formData, imageUrl: url}))}
                        />
                    </label>
                </div>

                <div className="flex items-center gap-2 mb-2 text-xs text-gray-400 font-bold uppercase">
                    <span className="h-px bg-gray-200 flex-1"></span>
                    O pegar enlace
                    <span className="h-px bg-gray-200 flex-1"></span>
                </div>

                <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input 
                      type="url" 
                      value={formData.imageUrl}
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none text-sm"
                      placeholder="https://..."
                    />
                </div>

                {formData.imageUrl && (
                  <div className="mt-2 h-24 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <img src={formData.imageUrl} alt="Preview" className="h-full object-contain" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none"
                  placeholder="Detalles técnicos del producto..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-slate-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 px-4 bg-aurora-600 text-white font-bold rounded-lg hover:bg-aurora-700 transition-colors flex justify-center items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simple Image Edit Modal */}
      {imageModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
               <h3 className="font-bold flex items-center gap-2">
                 <Camera className="w-5 h-5" /> Cambiar Imagen
               </h3>
               <button onClick={() => setImageModal(null)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
             </div>
             <div className="p-6">
               {/* Large Quick Folder Upload Button */}
               <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-aurora-50 hover:border-aurora-500 transition-all mb-6 group relative overflow-hidden">
                    <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-aurora-600 z-10">
                        <FolderOpen className="w-10 h-10 mb-1" />
                        <span className="text-sm font-bold">Clic para abrir Carpeta Rápida</span>
                        <span className="text-xs text-slate-400 group-hover:text-aurora-400">Subir desde tu PC</span>
                    </div>
                    <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, (url) => setImageModal({...imageModal, url}))}
                    />
               </label>
               
               <div className="flex items-center gap-3 mb-4">
                  <span className="h-px bg-gray-200 flex-1"></span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">O usar enlace</span>
                  <span className="h-px bg-gray-200 flex-1"></span>
               </div>

               <input 
                 type="url" 
                 value={imageModal.url}
                 onChange={(e) => setImageModal({...imageModal, url: e.target.value})}
                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-aurora-500 outline-none text-sm mb-4 bg-gray-50"
                 placeholder="https://..."
               />
               
               <div className="mb-6 h-48 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative shadow-inner">
                  <img 
                    src={imageModal.url} 
                    className="w-full h-full object-cover" 
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300?text=Vista+Previa')}
                    alt="Preview"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white text-xs py-1.5 text-center font-medium">Vista Previa</div>
               </div>
               
               <button 
                 onClick={() => {
                   imageModal.onSave(imageModal.url);
                   setImageModal(null);
                 }}
                 className="w-full bg-aurora-600 text-white font-bold py-4 rounded-xl hover:bg-aurora-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
               >
                 <Save className="w-5 h-5" /> Guardar Cambios
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Order Lookup Modal (New) */}
      {isLookupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[85vh] flex flex-col">
               <div className="bg-aurora-600 p-6 text-white flex justify-between items-center shrink-0">
                   <h3 className="font-bold text-xl flex items-center gap-2">
                       <FileSearch className="w-6 h-6" />
                       Consultar Pedidos
                   </h3>
                   <button onClick={() => setIsLookupOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X className="w-5 h-5"/></button>
               </div>
               
               <div className="p-6 flex-1 overflow-y-auto">
                   <div className="mb-6">
                       <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                           <Hash className="w-4 h-4 text-aurora-600" /> 
                           Número de Orden (ID)
                       </label>
                       <div className="flex gap-2">
                           <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aurora-500 outline-none"
                                placeholder="Ej: INV-123456"
                           />
                           <button 
                                onClick={() => handleSearchOrders(searchQuery)}
                                className="bg-slate-900 text-white px-6 rounded-lg font-bold hover:bg-slate-800 transition-colors"
                           >
                               Buscar
                           </button>
                       </div>
                   </div>

                   <div className="space-y-4">
                       {foundOrders.length > 0 ? (
                           <>
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                {foundOrders.length} Pedido(s) encontrado(s)
                             </p>
                             {foundOrders.map(({order, customer}, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:border-aurora-200 hover:shadow-md transition-all bg-gray-50/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="inline-block bg-aurora-100 text-aurora-700 text-xs font-bold px-2 py-1 rounded mb-1">
                                                {order.id}
                                            </span>
                                            <h4 className="font-bold text-slate-800">{customer.name}</h4>
                                        </div>
                                        <span className="font-bold text-lg text-slate-900">{formatPrice(order.total)}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 flex justify-between items-center mb-4">
                                        <span>{new Date(order.date).toLocaleString()}</span>
                                        <span>{order.items.length} items</span>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const doc = createPDFDocument(order.id, order, customer);
                                            doc.save(`Copia_Factura_${order.id}.pdf`);
                                        }}
                                        className="w-full bg-white border border-slate-300 text-slate-700 py-2 rounded-lg font-bold text-sm hover:bg-aurora-50 hover:text-aurora-600 hover:border-aurora-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" /> Descargar Copia PDF
                                    </button>
                                </div>
                             ))}
                           </>
                       ) : searchQuery ? (
                           <div className="text-center py-8 text-slate-400">
                               <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                               <p>No se encontraron pedidos con ese número.</p>
                           </div>
                       ) : (
                           <div className="text-center py-8 text-slate-400">
                               <FileSearch className="w-12 h-12 mx-auto mb-2 opacity-50" />
                               <p>Ingresa el número de factura para buscar.</p>
                           </div>
                       )}
                   </div>
               </div>
           </div>
        </div>
      )}

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;