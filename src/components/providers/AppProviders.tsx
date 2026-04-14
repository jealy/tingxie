import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useState } from 'react'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

const FIVE_MINUTES = 1000 * 60 * 5

const AppProviders = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: FIVE_MINUTES,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={150}>
        {children}
        <Toaster
          position="top-center"
          closeButton
          richColors
          toastOptions={{
            classNames: {
              toast: 'font-sans',
              title: 'text-sm font-semibold',
              description: 'text-sm',
            },
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default AppProviders
