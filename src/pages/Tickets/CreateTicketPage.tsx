import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useCategories } from '../../hooks/useCategories'
import { TicketForm, type TicketFormValues } from '../../components/Tickets/TicketForm'
import { ticketService } from '../../services/ticketService'
import { getErrorMessage } from '../../services/api'
import { Loader, ErrorState } from '../../components/common/States'

export function CreateTicketPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { categories, loading, error, reload } = useCategories()
  const navigate = useNavigate()

  if (loading) return <Loader label="Loading form…" />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!user) return null

  async function handleSubmit(values: TicketFormValues) {
    try {
      const ticket = await ticketService.create(values, { id: user!.id, name: user!.fullName })
      showToast('Ticket created successfully.')
      navigate(`/tickets/${ticket.id}`)
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-50 mb-1">Create a support ticket</h1>
      <p className="text-sm text-ink-400 mb-6">Tell us what's going on — we'll route it to the right team.</p>
      <div className="rounded-lg border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
        <TicketForm categories={categories} submitLabel="Submit Ticket" onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
      </div>
    </div>
  )
}
