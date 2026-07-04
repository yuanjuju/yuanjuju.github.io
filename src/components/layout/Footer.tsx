export function Footer() {
  return (
    <footer className="border-t border-gray-200/50 dark:border-[#1a1d2e] mt-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Jinian. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/jinian"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/jinian"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
