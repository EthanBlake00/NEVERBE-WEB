"use client";
import React from "react";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";
import { Button, Drawer, Collapse, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { toggleMenu } from "@/redux/headerSlice/headerSlice";
import { NavigationItem } from "@/actions/websiteAction";
import { useFilterData } from "@/hooks/useFilterData";

const { Text } = Typography;

const DEFAULT_LINKS: NavigationItem[] = [
  { title: "Home", link: "/" },
  { title: "Bundles", link: "/collections/combos" },
  { title: "Offers", link: "/collections/offers" },
];

const Menu = ({ mainNav = [] }: { mainNav?: NavigationItem[] }) => {
  const dispatch: AppDispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.headerSlice.showMenu);

  const { brands, categories } = useFilterData(true);

  let displayLinks = mainNav.length > 0 ? mainNav : DEFAULT_LINKS;
  if (!displayLinks.some((l) => l.link === "/")) {
    displayLinks = [{ title: "Home", link: "/" }, ...displayLinks];
  }

  const handleClose = () => dispatch(toggleMenu(false));

  const collapseItems = [
    {
      key: "categories",
      label: (
        <Text
          style={{
            fontSize: 22,
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            color: "var(--color-primary-dark)",
          }}
        >
          Categories
        </Text>
      ),
      children: (
        <div
          className="flex flex-col space-y-3 pl-3"
          style={{ borderLeft: "2px solid rgba(46, 158, 91,0.4)" }}
        >
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/collections/products?category=${encodeURIComponent(item.label.toLowerCase())}`}
              className="text-sm font-bold uppercase tracking-tight transition-all hover:translate-x-1 hover:text-accent!"
              style={{ color: "var(--color-primary-dark)" }}
              onClick={handleClose}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ),
    },
    {
      key: "brands",
      label: (
        <Text
          style={{
            fontSize: 22,
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            color: "var(--color-primary-dark)",
          }}
        >
          Brands
        </Text>
      ),
      children: (
        <div
          className="flex flex-col space-y-3 pl-3"
          style={{ borderLeft: "2px solid rgba(46, 158, 91,0.4)" }}
        >
          {brands.map((item) => (
            <Link
              key={item.id}
              href={`/collections/products?brand=${encodeURIComponent(item.label.toLowerCase())}`}
              className="text-sm font-bold uppercase tracking-tight transition-all hover:translate-x-1 hover:text-accent!"
              style={{ color: "var(--color-primary-dark)" }}
              onClick={handleClose}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Drawer
      open={isOpen}
      onClose={handleClose}
      placement="right"
      width={360}
      styles={{
        header: {
          background: "#fff",
          borderBottom: "1px solid rgba(46, 158, 91,0.15)",
          padding: "20px 28px",
          borderRadius: 0,
        },
        body: {
          background: "#f8faf5",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        mask: { backdropFilter: "blur(8px)" },
        content: {
          borderRadius: "32px 0 0 32px",
          overflow: "hidden",
        },
      }}
      title={
        <span
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 900,
            fontSize: 20,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            color: "var(--color-primary-dark)",
          }}
        >
          Menu
        </span>
      }
      closeIcon={
        <span
          style={{
            color: "var(--color-accent)",
            fontSize: 20,
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          ✕
        </span>
      }
    >

      {/* Nav Links */}
      <nav
        className="flex-1 overflow-y-auto px-6 bg-white hide-scrollbar"
        style={{ paddingTop: 8, paddingBottom: 8 }}
      >
        {displayLinks.map((link) => (
          <Link
            key={link.title}
            href={link.link}
            onClick={handleClose}
            className="flex items-center justify-between py-4 group"
            style={{ borderBottom: "1px solid var(--color-primary-100)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontWeight: 900,
                fontSize: 26,
                textTransform: "uppercase",
                letterSpacing: "-0.03em",
                color: "var(--color-primary-dark)",
                transition: "color 0.2s ease, transform 0.2s ease",
              }}
              className="group-hover:text-accent! group-hover:translate-x-2 inline-block transition-all"
            >
              {link.title}
            </span>
            <IoChevronForward
              size={16}
              style={{ color: "var(--color-primary-200)", flexShrink: 0 }}
              className="group-hover:text-accent!"
            />
          </Link>
        ))}

        {/* Collapsible sections via Ant Collapse */}
        <Collapse
          ghost
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <RightOutlined
              rotate={isActive ? 90 : 0}
              style={{
                color: isActive
                  ? "var(--color-accent)"
                  : "var(--color-primary-400)",
                transition: "all 0.3s ease",
                fontSize: 14,
              }}
            />
          )}
          items={collapseItems}
          style={{ borderTop: "1px solid var(--color-primary-100)" }}
        />
      </nav>

      {/* Footer */}
      <div
        className="p-6 mt-auto bg-white"
        style={{
          borderTop: "1px solid rgba(46, 158, 91,0.15)",
        }}
      >
        <div className="flex gap-8 mb-3">
          <Link
            href="/contact"
            className="text-xs font-black uppercase tracking-widest transition-colors hover:text-accent!"
            style={{ color: "var(--color-primary-dark)" }}
            onClick={handleClose}
          >
            Contact
          </Link>
          <Link
            href="/contact"
            className="text-xs font-black uppercase tracking-widest transition-colors hover:text-accent!"
            style={{ color: "var(--color-primary-dark)" }}
            onClick={handleClose}
          >
            Help
          </Link>
        </div>
        <p
          style={{
            fontSize: 9,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "var(--color-primary-100)",
            margin: 0,
          }}
        >
          &copy; {new Date().getFullYear()} Neverbe, Inc.
        </p>
      </div>
    </Drawer>
  );
};

export default Menu;
