import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Confirmation dialog for delete actions
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onOpenChange - Function to call when open state changes
 * @param {Function} props.onConfirm - Function to call when delete is confirmed
 * @param {string} props.title - Dialog title
 * @param {string} props.description - Dialog description
 * @returns {React.ReactNode} The confirmation dialog component
 */
export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer. La conversación será eliminada permanentemente."
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white dark:bg-slate-900 border-legal-200 dark:border-legal-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-legal-800 dark:text-legal-200">{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-legal-200 text-legal-800 hover:bg-legal-100 dark:border-legal-700 dark:text-legal-200 dark:hover:bg-legal-800">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}