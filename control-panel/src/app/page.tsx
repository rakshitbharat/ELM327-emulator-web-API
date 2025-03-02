import ControlPanel from './control-panel';

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <main className="container mx-auto">
        <ControlPanel />
      </main>
    </div>
  );
}
