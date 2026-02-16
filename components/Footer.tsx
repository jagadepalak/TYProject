export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20 py-6 text-center text-gray-400 animate-fade-in">
      
      <p className="text-sm">
        © {new Date().getFullYear()} StartupPitch Platform
      </p>

      <p className="text-xs mt-1">
        Built for Final Year Project | BSc IT
      </p>

    </footer>
  );
}
