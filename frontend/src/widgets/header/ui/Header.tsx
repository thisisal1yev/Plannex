import { Link } from 'react-router'
import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@shared/model/theme.store'
import { Button } from '@shared/ui/Button'

export function Header() {
  const { theme, toggle } = useThemeStore()

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="font-bold text-primary text-lg tracking-tight">
          Planner AI
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Переключить тему"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link to="/login">
            <Button variant="ghost" size="sm">Войти</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Регистрация</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
