import { Layout } from './Layout'
import { renderRoute } from './routes'
import { useHashRoute } from '../hooks/useHashRoute'
import { useMockData } from '../hooks/useMockData'

function App() {
  const { page, navigate } = useHashRoute()
  const query = useMockData()

  if (!query.data) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Laddar Compound OS...
        </div>
      </div>
    )
  }

  return (
    <Layout page={page} navigate={navigate}>
      {renderRoute(page, query.data, navigate)}
    </Layout>
  )
}

export default App
