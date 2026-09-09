import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="admin-shell">
      <div className="eyebrow">SUSHI24</div>
      <h1>Digital Menu</h1>
      <p className="lead">Телевизионное меню Sushi24 с данными из Syrve, переключением категорий и адаптацией под разные экраны.</p>
      <div className="screen-list">
        <Link className="screen-link" href="/screen/isani"><strong>Открыть меню Isani</strong><small>TV preview</small></Link>
        <Link className="screen-link" href="/admin"><strong>Открыть точки</strong><small>Все Sushi24 locations</small></Link>
      </div>
    </main>
  );
}
