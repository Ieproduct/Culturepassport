import { Dialog, Box, Typography, Button, IconButton, SvgIcon } from '@mui/material'
import type { ReactNode } from 'react'

/** Figma "Icon no x" (I40:11787;2963:21629) — Union shape, color Grey 01 #9A9A9A */
function IconCloseX() {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 24 }}>
      <path
        d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z"
        fill="#9A9A9A"
      />
    </SvgIcon>
  )
}

type ConfirmDialogProps = {
  open: boolean
  title?: string
  message?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

/**
 * Confirmation modal — Figma 40:11787 "Modal Confirm - Main"
 */
export function ConfirmDialog({
  open,
  title = 'Confirm to proceed ?',
  message = (
    <>
      Please make sure all the information is complete
      <br />
      before continuing.
    </>
  ),
  confirmLabel = 'Accept',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          maxWidth: 460,
          width: '100%',
          m: { xs: '16px', sm: '32px' },
          position: 'relative',
          overflow: 'visible',
          boxShadow: 'none',
        },
      }}
    >
      <Box
        sx={{
          pt: '32px',
          px: '24px',
          pb: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        {/* ─── X Close Button (top-right) ─── */}
        <IconButton
          onClick={onCancel}
          disabled={loading}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 24,
            height: 24,
            p: 0,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
          }}
        >
          <IconCloseX />
        </IconButton>

        {/* ─── Title + Body ─── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 24,
              lineHeight: '32px',
              color: '#6B7280',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: '20px',
              color: '#6B7280',
            }}
          >
            {message}
          </Typography>
        </Box>

        {/* ─── Action Buttons ─── */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', gap: '10px', p: '10px' }}>
            <Button
              onClick={onCancel}
              disabled={loading}
              variant="contained"
              sx={{
                bgcolor: '#D32F2F',
                color: '#FFFFFF',
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                lineHeight: '26px',
                letterSpacing: '0.46px',
                textTransform: 'capitalize',
                borderRadius: '4px',
                px: '22px',
                py: '8px',
                minWidth: 0,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#C62828',
                  boxShadow: 'none',
                },
              }}
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              variant="contained"
              sx={{
                bgcolor: '#2E7D32',
                color: '#FFFFFF',
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                lineHeight: '26px',
                letterSpacing: '0.46px',
                textTransform: 'capitalize',
                borderRadius: '4px',
                px: '22px',
                py: '8px',
                minWidth: 0,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#1B5E20',
                  boxShadow: 'none',
                },
              }}
            >
              {loading ? 'Processing...' : confirmLabel}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}
