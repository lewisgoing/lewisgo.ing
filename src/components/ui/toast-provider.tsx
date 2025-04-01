"use client"

import { Toast, ToastClose, ToastDescription, ToastProvider as Provider, ToastTitle, ToastViewport } from "src/components/ui/toast"
import { useToast } from "src/components/ui/use-toast"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts } = useToast()

  return (
    <Provider>
      {children}
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </Provider>
  )
}