'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LocationConfig, NormalizedMenu } from '@/lib/types';

type Props = { initialMenu: NormalizedMenu; config: LocationConfig };

export default function MenuBoard({ initialMenu, config }: Props) {
  const [menu, setMenu] = useState(initialMenu);
  const [stale, setStale] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(initialMenu.categories[0]?.id ?? '');
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await fetch(`/api/menu/${config.id}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('refresh failed');
        setMenu(await response.json());
        setStale(false);
      } catch {
        setStale(true);
      }
    };
    const id = window.setInterval(refresh, (config.refreshSeconds ?? 60) * 1000);
    return () => window.clearInterval(id);
  }, [config.id, config.refreshSeconds]);

  useEffect(() => {
    const calculate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (h > w) return setItemsPerPage(h > 1600 ? 8 : 6);
      if (w / h > 2.1 || w >= 3000) return setItemsPerPage(10);
      if (w >= 1800) return setItemsPerPage(8);
      setItemsPerPage(6);
    };
    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);

  const categories = useMemo(() => menu.categories.map((category) => ({
    ...category,
    items: category.items.filter((item) => config.showUnavailable || item.available)
  })).filter((category) => category.items.length > 0), [menu, config.showUnavailable]);

  useEffect(() => {
    if (!categories.some((category) => category.id === activeCategoryId)) {
      setActiveCategoryId(categories[0]?.id ?? '');
      setPage(0);
    }
  }, [categories, activeCategoryId]);

  const activeIndex = Math.max(0, categories.findIndex((category) => category.id === activeCategoryId));
  const activeCategory = categories[activeIndex];
  const totalPages = activeCategory ? Math.max(1, Math.ceil(activeCategory.items.length / itemsPerPage)) : 1;
  const visibleItems = activeCategory?.items.slice(page * itemsPerPage, (page + 1) * itemsPerPage) ?? [];

  const chooseCategory = useCallback((index: number) => {
    if (!categories.length) return;
    const normalized = (index + categories.length) % categories.length;
    setActiveCategoryId(categories[normalized].id);
    setPage(0);
    requestAnimationFrame(() => navRef.current?.querySelector<HTMLElement>(`[data-category-index="${normalized}"]`)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }));
  }, [categories]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') chooseCategory(activeIndex - 1);
      if (event.key === 'ArrowRight') chooseCategory(activeIndex + 1);
      if (event.key === 'ArrowUp' && totalPages > 1) setPage((p) => (p - 1 + totalPages) % totalPages);
      if (event.key === 'ArrowDown' && totalPages > 1) setPage((p) => (p + 1) % totalPages);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, chooseCategory, totalPages]);

  if (!activeCategory) return <main className="board empty-state">Нет доступных позиций</main>;

  return (
    <main className="board">
      <header className="board-header">
        <div className="brand-lockup"><div className="brand-mark">SUSHI<b>24</b></div><div className="brand-subline">{config.name}</div></div>
        {stale ? <div className="offline-indicator">offline cache</div> : null}
      </header>

      <div className="category-nav-shell">
        <button className="nav-arrow" onClick={() => chooseCategory(activeIndex - 1)}>‹</button>
        <nav className="category-nav" ref={navRef}>
          {categories.map((category, index) => <button key={category.id} data-category-index={index} className={`category-tab ${category.id === activeCategory.id ? 'is-active' : ''}`} onClick={() => chooseCategory(index)}>{category.name}</button>)}
        </nav>
        <button className="nav-arrow" onClick={() => chooseCategory(activeIndex + 1)}>›</button>
      </div>

      <section className="category-stage">
        <div className="category-stage-heading"><h1>{activeCategory.name}</h1>{totalPages > 1 ? <div className="pager"><button onClick={() => setPage((page - 1 + totalPages) % totalPages)}>‹</button><strong>{page + 1}/{totalPages}</strong><button onClick={() => setPage((page + 1) % totalPages)}>›</button></div> : null}</div>
        <div className="items-grid">
          {visibleItems.map((item) => <article className="menu-card" key={item.id}>
            <div className="image-wrap">{item.imageUrl ? <Image src={item.imageUrl} alt={item.name} fill sizes="25vw" /> : <div className="image-placeholder">SUSHI24</div>}{item.oldPrice && item.oldPrice > item.price ? <div className="discount-badge">-{Math.round((1 - item.price / item.oldPrice) * 100)}%</div> : null}</div>
            <div className="card-copy"><h2>{item.name}</h2>{config.showDescriptions && item.description ? <p>{item.description}</p> : null}<div className="price-line"><strong>{item.price.toFixed(2)} ₾</strong>{item.oldPrice && item.oldPrice > item.price ? <del>{item.oldPrice.toFixed(2)} ₾</del> : null}</div></div>
          </article>)}
        </div>
      </section>
      <footer className="board-footer"><span>sushi24.ge</span><span>← → categories · ↑ ↓ pages</span></footer>
    </main>
  );
}
