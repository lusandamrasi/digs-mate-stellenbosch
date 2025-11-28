import { createContext, useContext, ReactNode } from 'react'

type ThemeProviderProps = {
  children: ReactNode
}

type ThemeProviderState = {
  theme: 'light'
  setTheme: (theme: 'light') => void
}

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // Always use light theme with green colors
  const value = {
    theme: 'light' as const,
    setTheme: () => null, // No-op since we only support light theme
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
