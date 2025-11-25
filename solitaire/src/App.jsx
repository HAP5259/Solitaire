import Card from './components/Card.jsx';

export default function App() {
    const test_card = { rank: 'ace', suit: 'hearts', faceUp: true };
    return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="p-6 rounded-xl bg-white shadow-xl">
        <p className="mb-4 text-xl font-bold text-slate-800">
          Tailwind test
        </p>
        <Card card={test_card} />
      </div>
    </div>
    );
}
