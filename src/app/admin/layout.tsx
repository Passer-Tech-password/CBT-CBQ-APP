import AdminLayout from "@/components/admin/admin-layout"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}
