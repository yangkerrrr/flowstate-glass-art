const Footer = () => {
  return (
    <footer className="py-20 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-3xl font-black tracking-tight text-[hsl(var(--sol-mark))]">SOL</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Medicube certified reseller—authentic products, secure checkout, and trackable delivery.
            </p>
            <p className="text-muted-foreground text-xs max-w-sm mt-4 leading-relaxed">
              Medicube® is a trademark of its respective owner. This store is independently operated and is not the official Medicube website.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Navigate
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Products", href: "#products" },
                { label: "Why Us", href: "#why-us" },
                { label: "Routines", href: "#routines" },
                { label: "Shop", href: "/shop" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Connect
            </h4>
            <ul className="space-y-2">
              {["Support", "Shipping", "Returns"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 SOL. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Shipping"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
