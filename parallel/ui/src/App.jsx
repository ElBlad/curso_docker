import { useCallback, useEffect, useMemo, useState } from "react";
import { http } from "./api/http.js";
import { ordersApi, productsApi } from "./api/resources.js";

const money = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );

const getProductBackgroundColor = (color) => {
  const match =
    /^bg-\[(#[\da-f]{3}(?:[\da-f]{1}|[\da-f]{3}|[\da-f]{5})?)\]$/i.exec(
      color ?? "",
    );
  return match?.[1];
};

const displayDate = (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

function Icon({ name, className = "h-5 w-5" }) {
  const paths = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    bag: (
      <>
        <path d="M5 8h14l1 13H4L5 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    leaf: (
      <>
        <path d="M20 4c-9 0-14 4-14 10a6 6 0 0 0 6 6c6 0 10-5 8-16Z" />
        <path d="M4 21c3-6 7-9 12-12" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14m-7-7h14" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Brand({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 text-left"
      aria-label="Common Goods home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-white">
        <Icon name="leaf" className="h-[18px] w-[18px]" />
      </span>
      <span className="font-display text-[21px] tracking-[-0.04em] text-ink">
        common goods
      </span>
    </button>
  );
}

function Header({ role, onHome, cartCount, onCart, onLogout }) {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-black/[0.07] bg-white px-5 sm:px-10 lg:px-16">
      <Brand onClick={onHome} />
      <div className="flex items-center gap-3 sm:gap-6">
        {role === "client" && (
          <button
            onClick={onCart}
            className="relative flex items-center gap-2 text-sm font-medium text-ink hover:text-forest"
          >
            <Icon name="bag" className="h-[19px] w-[19px]" />
            <span className="hidden sm:inline">Your bag</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-leaf px-1 text-[11px] text-forest">
              {cartCount}
            </span>
          </button>
        )}
        {role && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 border-l border-black/10 pl-4 text-sm text-muted hover:text-ink sm:pl-6"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-paper text-forest">
              <Icon name="user" className="h-4 w-4" />
            </span>
            <span className="hidden capitalize sm:inline">{role}</span>
          </button>
        )}
      </div>
    </header>
  );
}

function Login({ onLogin }) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    setIsSubmitting(true);

    try {
      const usertype = formData.get("username");
      await http.post("/login", {
        username: usertype,
        password: formData.get("password"),
      });
      onLogin(usertype);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to log in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="flex min-h-[calc(100vh-76px)] items-center justify-center px-5 py-12">
      <section className="w-full max-w-[440px] rounded-3xl border border-black/[0.06] bg-white p-7 shadow-soft sm:p-10">
        <div className="mb-8 grid h-12 w-12 place-items-center rounded-full bg-leaf text-forest">
          <Icon name="leaf" className="h-6 w-6" />
        </div>
        <p className="eyebrow mb-3">A little more considered</p>
        <h1 className="font-display text-4xl tracking-[-0.04em] text-ink">
          Login
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Welcome to Common Goods. Sign in to continue.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="field-label">
            Username
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              className="field-input"
            />
          </label>
          <label className="field-label">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="field-input"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-between rounded-full bg-forest px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#244b39] disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? "Signing in…" : "Login"}
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </form>
      </section>
    </main>
  );
}

function ProductCard({ product, quantity, onAdd }) {
  return (
    <article className="group">
      <div
        className="product-art relative flex aspect-[1.12/1] items-center justify-center overflow-hidden rounded-2xl bg-paper"
        style={{ backgroundColor: getProductBackgroundColor(product.color) }}
      >
        <span className="absolute left-4 top-4 text-[10px] tracking-[0.16em] text-ink/50">
          {product.category.toUpperCase()}
        </span>
        <span className="product-shape grid h-32 w-32 place-items-center rounded-full border border-white/50 bg-white/25 font-display text-4xl text-ink/35 shadow-inner">
          {product.mark}
        </span>
        <button
          onClick={() => onAdd(product.id)}
          aria-label={`Add ${product.name} to bag`}
          className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-soft transition hover:bg-forest hover:text-white"
        >
          <Icon name="plus" className="h-5 w-5" />
        </button>
        {quantity > 0 && (
          <span className="absolute bottom-5 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-forest">
            {quantity} in bag
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 pt-4">
        <div>
          <h3 className="font-display text-[19px] text-ink">{product.name}</h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            {product.description}
          </p>
        </div>
        <span className="pt-1 text-sm font-medium text-ink">
          {money(product.price)}
        </span>
      </div>
    </article>
  );
}

function Shop({ products, cart, onAdd, onCart }) {
  const count = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );
  return (
    <main className="mx-auto max-w-[1260px] px-5 pb-20 pt-10 sm:px-10 lg:px-16">
      <div className="flex flex-col justify-between gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow mb-3">Objects for the everyday</p>
          <h1 className="font-display text-[42px] tracking-[-0.045em] text-ink sm:text-[52px]">
            Thoughtful things,
            <br className="sm:hidden" /> well made.
          </h1>
        </div>
        <p className="max-w-[310px] text-sm leading-6 text-muted">
          Useful, beautiful pieces from makers who care about how things are
          made — and how long they last.
        </p>
      </div>
      <div className="flex items-center justify-between py-6">
        <p className="text-sm text-muted">
          The collection{" "}
          <span className="ml-1 text-xs">· {products.length} pieces</span>
        </p>
        <button
          onClick={onCart}
          className="flex items-center gap-2 text-sm font-medium text-forest hover:text-ink"
        >
          View bag{" "}
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-leaf px-1 text-xs">
            {count}
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={cart[product.id] ?? 0}
            onAdd={onAdd}
          />
        ))}
      </div>
    </main>
  );
}

function Checkout({ products, cart, onChangeQuantity, onBack, onPlaceOrder }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
  });
  const [error, setError] = useState("");
  const cartItems = products.filter((product) => cart[product.id] > 0);
  const subtotal = cartItems.reduce(
    (sum, product) => sum + product.price * cart[product.id],
    0,
  );
  const setField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    setError("");
  };
  const submit = (event) => {
    event.preventDefault();
    if (!cartItems.length) {
      setError("Your bag is empty. Add something lovely before checking out.");
      return;
    }
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.address.trim()
    ) {
      setError("Please complete your name and delivery address.");
      return;
    }
    onPlaceOrder(form);
  };
  return (
    <main className="mx-auto max-w-[1120px] px-5 pb-20 pt-10 sm:px-10 lg:px-16">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm text-muted transition hover:text-forest"
      >
        ← <span>Back to collection</span>
      </button>
      <div className="mb-9">
        <p className="eyebrow mb-2">Almost yours</p>
        <h1 className="font-display text-[42px] tracking-[-0.04em] text-ink">
          Checkout
        </h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <section className="order-2 lg:order-1">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink">Your bag</h2>
            <span className="text-sm text-muted">
              {cartItems.reduce((sum, p) => sum + cart[p.id], 0)} pieces
            </span>
          </div>
          {cartItems.length ? (
            <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
              {cartItems.map((product) => (
                <div key={product.id} className="flex items-center gap-4 py-5">
                  <div
                    className="grid h-[76px] w-[76px] shrink-0 place-items-center rounded-xl bg-paper font-display text-2xl text-ink/40"
                    style={{
                      backgroundColor: getProductBackgroundColor(product.color),
                    }}
                  >
                    {product.mark}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg text-ink">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {money(product.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 rounded-full border border-black/10 px-2 py-1.5">
                    <button
                      onClick={() => onChangeQuantity(product.id, -1)}
                      aria-label={`Remove one ${product.name}`}
                      className="text-muted hover:text-ink"
                    >
                      <Icon name="minus" className="h-4 w-4" />
                    </button>
                    <span className="w-4 text-center text-sm">
                      {cart[product.id]}
                    </span>
                    <button
                      onClick={() => onChangeQuantity(product.id, 1)}
                      aria-label={`Add one ${product.name}`}
                      className="text-muted hover:text-ink"
                    >
                      <Icon name="plus" className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="w-16 text-right text-sm font-medium text-ink">
                    {money(product.price * cart[product.id])}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/15 py-14 text-center">
              <p className="font-display text-xl text-ink">
                Your bag is waiting.
              </p>
              <button
                onClick={onBack}
                className="mt-3 text-sm text-forest underline underline-offset-4"
              >
                Explore the collection
              </button>
            </div>
          )}
          <div className="mt-5 flex items-center justify-between text-sm text-muted">
            <span>Shipping</span>
            <span>Complimentary</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-5">
            <span className="font-medium text-ink">Total</span>
            <span className="font-display text-2xl text-ink">
              {money(subtotal)}
            </span>
          </div>
        </section>
        <section className="order-1 rounded-3xl bg-white p-6 shadow-soft sm:p-8 lg:order-2">
          <p className="eyebrow mb-2">Delivery details</p>
          <h2 className="font-display text-2xl text-ink">
            Where should we send it?
          </h2>
          <form onSubmit={submit} className="mt-7 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field-label">
                First name
                <input
                  value={form.firstName}
                  onChange={setField("firstName")}
                  autoComplete="given-name"
                  placeholder="Maya"
                  className="field-input"
                />
              </label>
              <label className="field-label">
                Last name
                <input
                  value={form.lastName}
                  onChange={setField("lastName")}
                  autoComplete="family-name"
                  placeholder="Chen"
                  className="field-input"
                />
              </label>
            </div>
            <label className="field-label">
              Delivery address
              <input
                value={form.address}
                onChange={setField("address")}
                autoComplete="street-address"
                placeholder="Street address, city, ZIP"
                className="field-input"
              />
            </label>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              className="flex w-full items-center justify-between rounded-full bg-forest px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#244b39]"
            >
              Place your order <Icon name="arrow" className="h-4 w-4" />
            </button>
            <p className="text-center text-xs leading-5 text-muted">
              A little care goes into every order. We’ll take it from here.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

function OrderDetail({ order, products }) {
  return (
    <section className="min-h-full p-6 sm:p-9 lg:p-11">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/[0.08] pb-7">
        <div>
          <p className="eyebrow mb-2">Order details</p>
          <h2 className="font-display text-3xl tracking-[-0.03em] text-ink">
            {order.id}
          </h2>
          <p className="mt-2 text-sm text-muted">
            Placed on {displayDate(order.date)}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${order.status === "Delivered" ? "bg-leaf text-forest" : order.status === "Shipped" ? "bg-blue-50 text-blue-700" : "bg-[#f8eee8] text-[#9b5638]"}`}
        >
          {order.status}
        </span>
      </div>
      <div className="grid gap-8 border-b border-black/[0.08] py-7 sm:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">Customer</p>
          <p className="text-sm font-medium text-ink">{order.customerName}</p>
          <p className="mt-2 max-w-[260px] text-sm leading-6 text-muted">
            {order.address}
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Order total</p>
          <p className="font-display text-3xl text-ink">{money(order.total)}</p>
          <p className="mt-2 text-sm text-muted">
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items ·
            Shipping included
          </p>
        </div>
      </div>
      <div className="pt-7">
        <p className="eyebrow mb-4">In this order</p>
        <div className="space-y-4">
          {order.items.map((item) => {
            const product = products.find(
              (entry) => entry.id === item.productId,
            );
            if (!product) return null;
            return (
              <div key={item.productId} className="flex items-center gap-4">
                <div
                  className="grid h-14 w-14 place-items-center rounded-xl bg-paper font-display text-lg text-ink/40"
                  style={{
                    backgroundColor: getProductBackgroundColor(product.color),
                  }}
                >
                  {product.mark}
                </div>
                <div className="flex-1">
                  <p className="font-display text-lg text-ink">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs text-muted">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-ink">
                  {money(product.price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-8 rounded-2xl bg-paper p-5">
        <p className="eyebrow mb-2">Delivering to</p>
        <p className="text-sm leading-6 text-ink">
          {order.customerName}
          <br />
          {order.address}
        </p>
      </div>
    </section>
  );
}

function Admin({ orders, products, selectedId, onSelect }) {
  const selectedOrder =
    orders.find((order) => order.id === selectedId) ?? orders[0];
  return (
    <main className="mx-auto max-w-[1360px] px-4 pb-10 pt-8 sm:px-8 lg:px-12">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Your workspace</p>
          <h1 className="font-display text-[38px] tracking-[-0.04em] text-ink">
            Orders
          </h1>
          <p className="mt-1 text-sm text-muted">
            A little care, from our hands to theirs.
          </p>
        </div>
        <div className="rounded-full bg-white px-4 py-2 text-sm text-muted shadow-sm">
          <span className="font-semibold text-ink">{orders.length}</span> total
          orders
        </div>
      </div>
      <div className="grid min-h-[580px] overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-soft lg:grid-cols-[350px_1fr]">
        <aside className="border-b border-black/[0.07] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-black/[0.07] px-6 py-5">
            <h2 className="font-display text-xl text-ink">Recent orders</h2>
            <span className="text-xs text-muted">Newest first</span>
          </div>
          <div className="flex gap-3 overflow-x-auto p-3 lg:block lg:space-y-1">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => onSelect(order.id)}
                aria-current={order.id === selectedId ? "true" : undefined}
                className={`min-w-[220px] flex-1 rounded-2xl p-4 text-left transition lg:min-w-0 lg:w-full ${order.id === selectedId ? "bg-leaf/70" : "hover:bg-paper"}`}
              >
                <span className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${order.id === selectedId ? "text-forest" : "text-muted"}`}
                  >
                    {order.id}
                  </span>
                  <Icon name="chevron" className="h-4 w-4 text-muted" />
                </span>
                <span className="mt-2 block text-sm font-medium text-ink">
                  {order.firstName} {order.lastName}
                </span>
                <span className="mt-1 flex items-center justify-between text-xs text-muted">
                  <span>{displayDate(order.date)}</span>
                  <span>{money(order.total)}</span>
                </span>
              </button>
            ))}
          </div>
        </aside>
        {selectedOrder ? (
          <OrderDetail order={selectedOrder} products={products} />
        ) : (
          <div className="grid place-items-center p-8 text-sm text-muted">
            No orders yet.
          </div>
        )}
      </div>
    </main>
  );
}

function OrderConfirmation({ orderId, onContinue }) {
  return (
    <main className="grid min-h-[calc(100vh-76px)] place-items-center px-5 py-12">
      <section className="max-w-md rounded-3xl bg-white p-9 text-center shadow-soft sm:p-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf text-forest">
          <Icon name="check" className="h-7 w-7" />
        </span>
        <p className="eyebrow mb-3 mt-7">Made with care</p>
        <h1 className="font-display text-4xl tracking-[-0.04em] text-ink">
          Thank you.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Your order <span className="font-semibold text-ink">{orderId}</span>{" "}
          is in. We can’t wait for it to find its way to you.
        </p>
        <button
          onClick={onContinue}
          className="mt-8 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#244b39]"
        >
          Back to the collection
        </button>
      </section>
    </main>
  );
}

function getInitialScreen() {
  if (window.location.pathname === "/orders")
    return { role: "admin", screen: "orders" };
  if (window.location.pathname === "/checkout")
    return { role: "client", screen: "checkout" };
  if (window.location.pathname === "/shop")
    return { role: "client", screen: "shop" };
  return { role: null, screen: "login" };
}

export default function App() {
  const initial = getInitialScreen();
  const [role, setRole] = useState(initial.role);
  const [screen, setScreen] = useState(initial.screen);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [confirmationId, setConfirmationId] = useState("");
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const loadData = useCallback(async () => {
    setDataError("");
    if (screen === "orders") {
      if (ordersLoaded) return;
      setDataLoading(true);
      try {
        const loadedOrders = await ordersApi.list();
        setOrders(loadedOrders);
        setSelectedId((current) => current ?? loadedOrders[0]?.id ?? null);
        setOrdersLoaded(true);
      } catch (error) {
        setDataError(
          error instanceof Error ? error.message : "Unable to load orders.",
        );
      } finally {
        setDataLoading(false);
      }
      return;
    }

    if (screen !== "shop" && screen !== "checkout") return;
    if (productsLoaded) return;

    setDataLoading(true);
    try {
      const loadedProducts = await productsApi.list();
      setProducts(loadedProducts);
      setProductsLoaded(true);
    } catch (error) {
      setDataError(
        error instanceof Error ? error.message : "Unable to load products.",
      );
    } finally {
      setDataLoading(false);
    }
  }, [ordersLoaded, productsLoaded, screen]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0),
    [cart],
  );

  const navigate = (nextScreen, nextRole = role) => {
    const routes = {
      login: "/login",
      orders: "/orders",
      shop: "/shop",
      checkout: "/checkout",
    };
    window.history.pushState({}, "", routes[nextScreen]);
    setRole(nextRole);
    setScreen(nextScreen);
  };
  const addToCart = (productId) =>
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  const changeQuantity = (productId, amount) =>
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) + amount;
      const next = { ...current };
      if (nextQuantity <= 0) delete next[productId];
      else next[productId] = nextQuantity;
      return next;
    });
  const placeOrder = (customer) => {
    const items = products
      .filter((product) => cart[product.id] > 0)
      .map((product) => ({
        productId: product.id,
        quantity: cart[product.id],
      }));
    const total = items.reduce(
      (sum, item) =>
        sum +
        products.find((product) => product.id === item.productId).price *
          item.quantity,
      0,
    );
    const latestOrderNumber = orders.reduce(
      (latest, order) => Math.max(latest, Number(order.id.split("-")[1]) || 0),
      1048,
    );
    const orderId = `CG-${latestOrderNumber + 1}`;
    setOrders((current) => [
      {
        customerName: `${customer.firstName} ${customer.lastName}`,
        id: orderId,
        date: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }).format(new Date()),
        total,
        status: "Processing",
        items,
      },
      ...current,
    ]);
    setCart({});
    setConfirmationId(orderId);
    setScreen("confirmation");
  };
  const logout = () => {
    setRole(null);
    setScreen("login");
    window.history.pushState({}, "", "/login");
  };
  const needsData = ["shop", "checkout", "orders"].includes(screen);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header
        role={role}
        onHome={() =>
          navigate(
            role === "admin" ? "orders" : role === "client" ? "shop" : "login",
          )
        }
        cartCount={cartCount}
        onCart={() => navigate("checkout", "client")}
        onLogout={logout}
      />
      {screen === "login" && (
        <Login
          onLogin={(nextRole) =>
            navigate(nextRole === "admin" ? "orders" : "shop", nextRole)
          }
        />
      )}
      {needsData && dataLoading && (
        <main className="mx-auto max-w-[1260px] px-5 py-16 text-sm text-muted sm:px-10 lg:px-16">
          Loading store data…
        </main>
      )}
      {needsData && !dataLoading && dataError && (
        <main className="mx-auto max-w-[1260px] px-5 py-16 text-sm text-red-700 sm:px-10 lg:px-16">
          <p role="alert">Unable to load store data: {dataError}</p>
          <button
            onClick={loadData}
            className="mt-4 rounded-full bg-forest px-5 py-2.5 font-medium text-white"
          >
            Try again
          </button>
        </main>
      )}
      {screen === "shop" && !dataLoading && !dataError && (
        <Shop
          products={products}
          cart={cart}
          onAdd={addToCart}
          onCart={() => navigate("checkout", "client")}
        />
      )}
      {screen === "checkout" && !dataLoading && !dataError && (
        <Checkout
          products={products}
          cart={cart}
          onChangeQuantity={changeQuantity}
          onBack={() => navigate("shop", "client")}
          onPlaceOrder={placeOrder}
        />
      )}
      {screen === "orders" && !dataLoading && !dataError && (
        <Admin
          orders={orders}
          products={products}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}
      {screen === "confirmation" && (
        <OrderConfirmation
          orderId={confirmationId}
          onContinue={() => navigate("shop", "client")}
        />
      )}
    </div>
  );
}
