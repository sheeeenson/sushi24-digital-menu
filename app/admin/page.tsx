import Link from 'next/link';
import { locations } from '@/config/screens';

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <div className="eyebrow">SUSHI24 / DIGITAL MENU</div>
      <h1>Экраны Sushi24</h1>
      <p className="lead">Выберите точку. Сейчас меню работает в preview-режиме; после подключения Syrve эти же экраны будут получать актуальные позиции и цены автоматически.</p>
      <div className="screen-list">
        {locations.map((location) => (
          <Link className="screen-link" href={`/screen/${location.id}`} key={location.id}>
            <strong>{location.name}</strong>
            <small>/screen/{location.id}</small>
          </Link>
        ))}
      </div>
    </main>
  );
}
